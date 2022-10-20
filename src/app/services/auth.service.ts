import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, combineLatest, filter, map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserInfo {
	info?: {
		sub: string;
		email: string;
		name: string;
		picture: string;
	}
}

export const config: AuthConfig = {
	clientId: environment.clientId,
	issuer: 'https://accounts.google.com',
	scope: 'openid profile email',
	redirectUri: 'http://localhost:4200',
	strictDiscoveryDocumentValidation: false
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	userProfileSubject = new BehaviorSubject<any>(null);

	private isAuthenticatedSubject$ = new BehaviorSubject<boolean>(false);
	isAuthenticated$ = this.isAuthenticatedSubject$.asObservable();
  
	private isDoneLoadingSubject$ = new BehaviorSubject<boolean>(false);
	isDoneLoading$ = this.isDoneLoadingSubject$.asObservable();
	
	canActivateProtectedRoutes$: Observable<boolean> = combineLatest([
		this.isAuthenticated$,
		this.isDoneLoading$
    ]).pipe(map(values => values.every(b => b)));

	constructor(private readonly oauthService: OAuthService, private router: Router) 
	{
		this.init();
	}

	private init(): void {
		this.oauthService.configure(config);
		this.oauthService.logoutUrl = 'https://www.google.com/accounts/logout';

		this.listenToEvents();
	
		this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());

		this.oauthService.setupAutomaticSilentRefresh();
	}

	private listenToEvents(): void {
		window.addEventListener('storage', (event) => {
			// The `key` is `null` if the event was caused by `.clear()`
			if (event.key !== 'access_token' && event.key !== null) {
			  return;
			}
	  
			console.warn('Noticed changes to access_token (most likely from another tab), updating isAuthenticated');
			this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
	  
			if (!this.oauthService.hasValidAccessToken()) {
			  	this.navigateToLoginPage();
			}
		});

		this.oauthService.events.subscribe(_ => {
			this.isAuthenticatedSubject$.next(this.oauthService.hasValidAccessToken());
		});

		this.oauthService.events
			.pipe(filter(e => ['token_received'].includes(e.type)))
			.subscribe(e => this.loadUserProfile());

		this.oauthService.events
			.pipe(filter(e => ['session_terminated', 'session_error'].includes(e.type)))
			.subscribe(e => this.navigateToLoginPage());
	}

	public runInitialLoginSequence(): Promise<void> {
		return this.oauthService.loadDiscoveryDocument()
		  .then(() => this.oauthService.tryLogin())
		  .then(() => {
			if (this.oauthService.hasValidAccessToken()) {
			  	return Promise.resolve();
			}
	
			return Promise.reject();
		  })
		  .then(() => this.isDoneLoadingSubject$.next(true))
		  .catch(() => this.isDoneLoadingSubject$.next(true));
	}

	private navigateToLoginPage() {
		// TODO: Remember current URL
		this.router.navigateByUrl('/login');
	}

	loadUserProfile(): void {
		if (this.oauthService.hasValidAccessToken()) {
			this.oauthService.loadUserProfile().then(profile => 
			{
				console.log('Profile =============', profile);
				this.userProfileSubject.next(profile as UserInfo);
			});
		}
	}
	
	login(): void {
		this.oauthService.initLoginFlow();
	}

	get isLoggedIn(): boolean {
		return this.oauthService.hasValidAccessToken();
	}

	getToken(): string {
		return this.oauthService.getIdToken();
	}

	logout(): void {
		this.oauthService.logOut();
		location.reload();
	}
}
