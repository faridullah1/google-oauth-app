import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	constructor(private authService: AuthService, private router: Router) {
		authService.userProfileSubject.subscribe(userInfo => {
			console.log(userInfo);
			console.log(this.authService.isLoggedIn);
		});
	}

	ngOnInit(): void {
	}

	onloginWithGoogle(): void {
		this.authService.login();
	}
}
