import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GeneratorIndexComponent } from './abgenerated/generator-index.component';
::NGCOMPONENTS_IMPORTS::
import { <!--component.className-->Stub } from './abgenerated/<!--folder.name-->/<!--component.name-->.component';
::/NGCOMPONENTS_IMPORTS::

const routes: Routes = [
    { path: '', redirectTo: '/generator-index', pathMatch: 'full' },
    { path: 'generator-index', component: GeneratorIndexComponent },
::MAIN_NGCOMPONENTS_ROUTES::
    { path: '<!--component.path-->', component: <!--component.className-->Stub,
		children: [
			::MAIN_NGCOMPONENT_CHILDREN::
			{ path: '<!--component.path-->', component: <!--component.className-->Stub },
			::/MAIN_NGCOMPONENT_CHILDREN::
		]
	},
::/MAIN_NGCOMPONENTS_ROUTES::
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }