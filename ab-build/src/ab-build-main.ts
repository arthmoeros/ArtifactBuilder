/// <reference path="../../node_modules/@types/node/index.d.ts" />
import * as fs from "fs";
import * as shelljs from "shelljs";
import { FormsConfig } from "./entity/forms-config";
import { GenerationForm } from "./entity/generation-form";
import { XmlConfigUnmarshallUtil } from "./other/xml-config-unmarshall.util";
import { GenerationFormRenderer } from "./renderer/generation-form.renderer";
import { GenerationFormWriter } from "./other/generation-form.writer";
import { NgCoreFilesRenderer } from "./renderer/ng-core-files.renderer";

import { abGeneratedFolder, abGeneratorsFolder, abGeneratorsConfigFolder, appSrcFolder, abXmlConfigFolder } from "./constants";
class AbBuildMain {

	public main() {
		console.info("Starting AB-Build");
		shelljs.rm("-R", abGeneratedFolder);
		shelljs.rm("-R", abGeneratorsFolder);
		console.info("Cleaned existing target folders");
		shelljs.mkdir("-p", abGeneratorsFolder);
		shelljs.cp("-R", abGeneratorsConfigFolder, appSrcFolder);
		console.info("Copied Generators");
		let formConfigFileNames: string[] = shelljs.ls(abXmlConfigFolder);
		console.info("Found the following files in abxml folder (I will only consider XML files): "+formConfigFileNames);
		let generationForms: GenerationForm[] = new Array<GenerationForm>();
		formConfigFileNames.forEach(formConfigFileName => {
			if (formConfigFileName.indexOf(".xml") != -1) {
				console.info("Processing file "+formConfigFileName);
				generationForms.push(this.processConfiguration(formConfigFileName));
			}
		});
		new GenerationFormWriter().write(generationForms);
		console.info("Generation Forms files written");

		let coreFiles: Map<string,string> = new NgCoreFilesRenderer().render(generationForms);
		console.info("NG core files rendered");
		
		coreFiles.forEach((value, key) => {
			fs.writeFileSync(key, value)
		});
		console.info("NG core files written");
		console.info("donzo!");
	}

	public processConfiguration(xmlConfigFileName: string): GenerationForm {
		let formsConfig: FormsConfig = new XmlConfigUnmarshallUtil().unmarshall(xmlConfigFileName);
		console.info("> XML unmarshalled into FormsConfig");
		let genForm: GenerationForm = new GenerationFormRenderer().render(formsConfig);
		console.info("> Generation Form files rendered");
		return genForm;
	}

}

var ngb = new AbBuildMain();
ngb.main();