import { Component } from '@angular/core';

@Component({
	selector: 'my-app',
	template: `
    <h1>{{title}}</h1>
	<router-outlet></router-outlet>
	`,
	styleUrls: ['/app.component.css']
})

export class AppComponent {
	title = 'Artifact Builder';

}