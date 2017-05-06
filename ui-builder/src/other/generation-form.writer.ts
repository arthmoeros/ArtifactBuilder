import { StringHandlerUtil } from "@artifacter/common";
import * as fs from "fs";
import * as shelljs from "shelljs";
import * as pretty from "pretty";

import { GenerationForm } from "./../entity/generation-form";
import { FormComponent } from "./../entity/form-component";


import { appSrcFolder, generatedFolder } from "./../constants";
export class GenerationFormWriter {

	private genReqFileFormGenerated: boolean = false;

	public write(generationForms: GenerationForm[]) {
		generationForms.forEach(genForm => {
			let mainComponent: FormComponent = genForm.$mainForm;
			let formComponents: FormComponent[] = genForm.$forms;

			let mainComponentName: string = StringHandlerUtil.convertCamelCaseToDashed(mainComponent.$name);
			shelljs.mkdir("-p", generatedFolder + mainComponentName);

			fs.writeFileSync(generatedFolder + mainComponentName + "/" + mainComponentName + "-main.component.html", pretty(mainComponent.$ngTemplate));
			fs.writeFileSync(generatedFolder + mainComponentName + "/" + mainComponentName + "-main.component.ts", mainComponent.$ngComponent);
			formComponents.forEach(formComponent => {
				if (formComponent.$isGenReqFileForm) {
					if (!this.genReqFileFormGenerated) {
						let formComponentName: string = StringHandlerUtil.convertCamelCaseToDashed(formComponent.$name);
						shelljs.mkdir(generatedFolder + "common-gen/");
						fs.writeFileSync(generatedFolder + "common-gen/" + formComponentName + ".component.html", pretty(formComponent.$ngTemplate));
						fs.writeFileSync(generatedFolder + "common-gen/" + formComponentName + ".component.ts", formComponent.$ngComponent);
						this.genReqFileFormGenerated = true;
					}
				} else {
					let formComponentName: string = StringHandlerUtil.convertCamelCaseToDashed(formComponent.$name);
					fs.writeFileSync(generatedFolder + mainComponentName + "/" + formComponentName + ".component.html", pretty(formComponent.$ngTemplate));
					fs.writeFileSync(generatedFolder + mainComponentName + "/" + formComponentName + ".component.ts", formComponent.$ngComponent);
				}
			});
		});
	}
}