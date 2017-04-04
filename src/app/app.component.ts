import { Component } from '@angular/core';

@Component({
	selector: 'my-app',
	template: `
    <h1>{{title}}</h1>
	<nav>
		<a routerLink="/dashboard" routerlinkActive="active">Dashboard</a>
		<a routerLink="/heroes" routerlinkActive="active">Heroes</a>
		<a routerLink="/heroForm" routerlinkActive="active">Hero Form</a>
	</nav>
	<router-outlet></router-outlet>
	`,
	styleUrls: ['./app.component.css']
})

export class AppComponent {
	title = 'Tour of Heroes';

}