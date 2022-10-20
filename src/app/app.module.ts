import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OAuthModule, OAuthModuleConfig } from 'angular-oauth2-oidc';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';

export function authAppInitializerFactory(authService: AuthService): () => Promise<void> {
	return () => authService.runInitialLoginSequence();
}

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		UsersComponent,
		DashboardComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		HttpClientModule,

		MaterialModule,
		OAuthModule.forRoot()
	],
	providers: [
        { provide: APP_INITIALIZER, useFactory: authAppInitializerFactory, deps: [AuthService], multi: true },
        { 
			provide: OAuthModuleConfig, useValue: {
				allowedUrls: ['http://localhost/api'],
				sendAccessToken: true,
			}
		},
    ],
	bootstrap: [AppComponent]
})
export class AppModule {}
