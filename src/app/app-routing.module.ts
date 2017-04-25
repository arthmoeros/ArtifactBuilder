import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GeneratorIndexComponent } from './abgenerated/generator-index.component';

import { SampleXMLArchOSBAltStub } from './abgenerated/sample-xml-arch-osb-alt/sample-xml-arch-osb-alt-main.component';

import { SampleFormOneAltStub } from './abgenerated/sample-xml-arch-osb-alt/sample-form-one-alt.component';

import { GenReqFileFormStub } from './abgenerated/common-gen/gen-req-file-form.component';

import { SampleXMLArchOSBStub } from './abgenerated/sample-xml-arch-osb/sample-xml-arch-osb-main.component';

import { SampleFormOneStub } from './abgenerated/sample-xml-arch-osb/sample-form-one.component';


const routes: Routes = [
    { path: '', redirectTo: '/generator-index', pathMatch: 'full' },
    { path: 'generator-index', component: GeneratorIndexComponent },

    { path: 'sample-xml-arch-osb-alt', component: SampleXMLArchOSBAltStub,
		children: [
			
			{ path: 'sample-form-one-alt', component: SampleFormOneAltStub },
			
			{ path: 'gen-req-file-form', component: GenReqFileFormStub },
			
		]
	},

    { path: 'sample-xml-arch-osb', component: SampleXMLArchOSBStub,
		children: [
			
			{ path: 'sample-form-one', component: SampleFormOneStub },
			
			{ path: 'gen-req-file-form', component: GenReqFileFormStub },
			
		]
	},

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }