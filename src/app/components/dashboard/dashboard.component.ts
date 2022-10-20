import { Component } from '@angular/core';
import { AuthService, UserInfo } from 'src/app/services/auth.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
	userInfo!: UserInfo;
	isLoggedIn = false;

	constructor(private authService: AuthService) {
		this.authService.loadUserProfile();

		authService.userProfileSubject.subscribe(userInfo => {
			this.userInfo = userInfo;
			this.isLoggedIn = this.authService.isLoggedIn;
		});
	}

	onLogout(): void {
		this.authService.logout();
	}
}
