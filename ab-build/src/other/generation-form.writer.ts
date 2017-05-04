import { StringHandlerUtil } from "@artifacter/common";
import * as fs from "fs";
import * as shelljs from "shelljs";
import * as pretty from "pretty";

import { GenerationForm } from "./../entity/generation-form";
import { FormComponent } from "./../entity/form-component";


import { appSrcFolder, abGeneratedFolder } from "./../constants";
export class GenerationFormWriter {

	private genReqFileFormGenerated: boolean = false;

	public write(generationForms: GenerationForm[]) {
		generationForms.forEach(genForm => {
			let mainComponent: FormComponent = genForm.$mainForm;
			let formComponents: FormComponent[] = genForm.$forms;

			let mainComponentName: string = StringHandlerUtil.convertCamelCaseToDashed(mainComponent.$name);
			shelljs.mkdir("-p", abGeneratedFolder + mainComponentName);

			fs.writeFileSync(abGeneratedFolder + mainComponentName + "/" + mainComponentName + "-main.component.html", pretty(mainComponent.$ngTemplate));
			fs.writeFileSync(abGeneratedFolder + mainComponentName + "/" + mainComponentName + "-main.component.ts", mainComponent.$ngComponent);
			formComponents.forEach(formComponent => {
				if (formComponent.$isGenReqFileForm) {
					if (!this.genReqFileFormGenerated) {
						let formComponentName: string = StringHandlerUtil.convertCamelCaseToDashed(formComponent.$name);
						shelljs.mkdir(abGeneratedFolder + "common-gen/");
						fs.writeFileSync(abGeneratedFolder + "common-gen/" + formComponentName + ".component.html", pretty(formComponent.$ngTemplate));
						fs.writeFileSync(abGeneratedFolder + "common-gen/" + formComponentName + ".component.ts", formComponent.$ngComponent);
						this.genReqFileFormGenerated = true;
					}
				} else {
					let formComponentName: string = StringHandlerUtil.convertCamelCaseToDashed(formComponent.$name);
					fs.writeFileSync(abGeneratedFolder + mainComponentName + "/" + formComponentName + ".component.html", pretty(formComponent.$ngTemplate));
					fs.writeFileSync(abGeneratedFolder + mainComponentName + "/" + formComponentName + ".component.ts", formComponent.$ngComponent);
				}
			});
		});
	}
}