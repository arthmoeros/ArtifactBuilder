import { Component } from '@angular/core';

import { Hero } from './hero';

@Component({
	selector: 'hero-form',
	templateUrl: './hero-form.component.html'
})
export class HeroFormComponent {
	powers = [
		'Rashos laser',
		'Vision de carne',
		'Aliento poderoso',
		'Aliento frio'
	];

	model = new Hero(666,'Super Pollo', this.powers[1], 'Juan Perez');

	submitted = false;

	onSubmit(){
		this.submitted = true;
	}

	get diagnostic(){
		return JSON.stringify(this.model);
	}

	newHero(){
		this.model = new Hero(42,'','');
	}
}