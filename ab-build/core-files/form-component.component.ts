import generator = require('../abgenerators/<!--meta.generatorComponent-->');
import { Component } from '@angular/core';

@Component({
	selector: '<!--(cC2dashed)form.formId-->',
	templateUrl: './<!--(cC2dashed)form.formId-->.component.html'
})
export class <!--form.formId-->Stub {

	private map: {
		::INPUTS::
		<!--input.mapValueKey-->: string,
		::/INPUTS::
	};

	public <!--input.formId-->Submit(): {
		generator.<!--form.formFunction-->(map);
	};


}