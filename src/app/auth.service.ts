import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Subject } from 'rxjs';

export interface UserInfo {
	info: {
		sub: string;
		email: string;
		name: string;
		picture: string;
	}
}

const config: AuthConfig = {
	clientId: '601653797159-p2raa8mrfotcorb6jh3jd8sj4ab0c7jr.apps.googleusercontent.com',
	issuer: 'https://accounts.google.com',
	scope: 'openid profile email',
	redirectUri: 'http://localhost:4200',
	strictDiscoveryDocumentValidation: false
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
	userProfileSubject = new Subject<UserInfo>();

	constructor(private readonly authService: OAuthService) 
	{
		this.authService.configure(config);
		this.authService.logoutUrl = 'https://www.google.com/accounts/logout';

		this.authService.loadDiscoveryDocument().then(() => {
			this.authService.tryLoginImplicitFlow().then((value) => {
				if (this.isLoggedIn()) {
					this.authService.loadUserProfile().then(profile => {
						console.log(profile);
						this.userProfileSubject.next(profile as UserInfo);
					});
				}
			})
		});
	}

	login(): void {
		this.authService.loadDiscoveryDocument().then(() => {
			this.authService.tryLoginImplicitFlow().then((value) => {
				if (!this.isLoggedIn()) {
					this.authService.initLoginFlow();
				}
			})
		});
	}

	isLoggedIn(): boolean {
		return this.authService.hasValidAccessToken();
	}

	logout(): void {
		this.authService.logOut();
	}
}
