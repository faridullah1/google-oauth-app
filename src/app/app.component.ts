import { Component } from '@angular/core';
import { AuthService, UserInfo } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
	userInfo!: UserInfo;
  	title = 'Google Auth';
	isLoggedIn = false;

	constructor(private authService: AuthService) {
		authService.userProfileSubject.subscribe(userInfo => {
			this.userInfo = userInfo;
			this.isLoggedIn = this.authService.isLoggedIn();
		});

		this.isLoggedIn = authService.isLoggedIn();
	}

	onloginWithGoogle(): void {
		this.authService.login();
	}

	onLogout(): void {
		this.authService.logout();
	}
}
