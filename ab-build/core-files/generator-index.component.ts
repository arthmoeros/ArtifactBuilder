import { Component } from '@angular/core';

@Component({
	selector: 'generator-index',
	template: `
    <h3>{{title}}</h3>
	<ul>
		::MAIN_NG_COMPONENTS_LINKS::
		<li><a [routerLink]="['/<!--component.path-->']"><!--component.name--></a></li>
		::/MAIN_NG_COMPONENTS_LINKS::
	</ul>
	`,
	styleUrls: ['/app.component.css']
})

export class GeneratorIndexComponent {
	title = 'Generator Index';

}