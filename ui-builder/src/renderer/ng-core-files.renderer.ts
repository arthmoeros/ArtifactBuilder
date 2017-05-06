import { StringContainer, RegexContainer, StringHandlerUtil } from "@artifacter/common";
import * as fs from "fs";

import { GenerationForm } from "./../entity/generation-form";
import { FormComponent } from "./../entity/form-component";

import { appSrcFolder, generatedFolder, uiBuilderWorkspaceFolder } from "./../constants";

const tmplAppRoutingModule: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/app-routing.module.ts.atmpl").toString();
const tmplAppComponent: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/app.component.ts.atmpl").toString();
const tmplAppModule: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/app.module.ts.atmpl").toString();
const regexNgComponentsImports = new RegexContainer(/(::NGCOMPONENTS_IMPORTS::)([\s\S]*)(::\/NGCOMPONENTS_IMPORTS::)/g);
const regexMainNgComponentsRoutes = new RegexContainer(/(::MAIN_NGCOMPONENTS_ROUTES::)([\s\S]*)(::\/MAIN_NGCOMPONENTS_ROUTES::)/g);
const regexMainNgComponentChildren = new RegexContainer(/(::MAIN_NGCOMPONENT_CHILDREN::)([\s\S]*)(::\/MAIN_NGCOMPONENT_CHILDREN::)/g);
const regexNgComponentsDeclaration = new RegexContainer(/(::NGCOMPONENTS_DECLARATION::)([\s\S]*)(::\/NGCOMPONENTS_DECLARATION::)/g);

const tmplGeneratorIndexComponent: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/generator-index.component.ts.atmpl").toString();
const regexMainNgComponentsLinks = new RegexContainer(/(::MAIN_NG_COMPONENTS_LINKS::)([\s\S]*)(::\/MAIN_NG_COMPONENTS_LINKS::)/g);
export class NgCoreFilesRenderer {

	private genReqFileFormImported: boolean = false;
	private genReqFileFormDeclared: boolean = false;

	public render(generationForms: GenerationForm[]): Map<string, string> {
		let mapFiles = new Map<string, string>();

		let appRoutingModule: string = this.renderAppRoutingModule(generationForms);
		let appComponent: string = this.renderAppComponent(generationForms);
		let appModule: string = this.renderAppModule(generationForms);
		let generatorIndexComponent: string = this.renderGeneratorIndexComponent(generationForms);

		mapFiles.set(appSrcFolder + "/app-routing.module.ts", appRoutingModule);
		mapFiles.set(appSrcFolder + "/app.component.ts", appComponent);
		mapFiles.set(appSrcFolder + "/app.module.ts", appModule);
		mapFiles.set(generatedFolder + "/generator-index.component.ts", generatorIndexComponent);

		return mapFiles;
	}

	private renderGeneratorIndexComponent(generationForms: GenerationForm[]): string {
		let result: StringContainer = new StringContainer(tmplGeneratorIndexComponent);
		result.replace(regexMainNgComponentsLinks.regex, this.renderMainNgComponentsLinks(generationForms));
		return result.toString();
	}

	private renderMainNgComponentsLinks(generationForms: GenerationForm[]): string {
		let tmpl: string = regexMainNgComponentsLinks.search(tmplGeneratorIndexComponent)[2];
		let result: StringContainer = new StringContainer();
		generationForms.forEach(generationForm => {
			let current: StringContainer = new StringContainer(tmpl);
			current.replace("&{component.path}", StringHandlerUtil.convertCamelCaseToDashed(generationForm.$mainForm.$name));
			current.replace("&{component.name}", generationForm.$mainForm.$name);

			result.concat(current);
		});
		return result.toString();
	}

	private renderAppRoutingModule(generationForms: GenerationForm[]): string {
		let result: StringContainer = new StringContainer(tmplAppRoutingModule);
		let mainNgComponentsRoutes: StringContainer = new StringContainer();
		let ngComponentsImports: StringContainer = new StringContainer();
		this.genReqFileFormImported = false;
		generationForms.forEach(generationForm => {
			mainNgComponentsRoutes.concat(this.renderMainNgComponentsRoutes(generationForm.$mainForm, generationForm.$forms));
			ngComponentsImports.concat(this.renderNgComponentsImports(generationForm.$mainForm, generationForm.$forms, tmplAppRoutingModule));
		});
		result.replace(regexMainNgComponentsRoutes.regex, mainNgComponentsRoutes);
		result.replace(regexNgComponentsImports.regex, ngComponentsImports);
		return result.toString();
	}

	private renderMainNgComponentsRoutes(mainComponent: FormComponent, formComponents: FormComponent[]): string {
		let result: StringContainer = new StringContainer(regexMainNgComponentsRoutes.search(tmplAppRoutingModule)[2]);
		result.replace(regexMainNgComponentChildren.regex, this.renderMainNgComponentChildren(formComponents));
		result.replace("&{component.path}", StringHandlerUtil.convertCamelCaseToDashed(mainComponent.$name));
		result.replace("&{component.className}", StringHandlerUtil.convertToClassName(mainComponent.$name));
		return result.toString();
	}

	private renderMainNgComponentChildren(formComponents: FormComponent[]): string {
		let tmpl: string = regexMainNgComponentChildren.search(tmplAppRoutingModule)[2];
		let result: StringContainer = new StringContainer();
		formComponents.forEach(formComponent => {
			let current: StringContainer = new StringContainer(tmpl);
			current.replace("&{component.path}", StringHandlerUtil.convertCamelCaseToDashed(formComponent.$name));
			current.replace("&{component.className}", StringHandlerUtil.convertToClassName(formComponent.$name));
			result.concat(current.toString());
		});
		return result.toString();
	}

	private renderNgComponentsImports(mainComponent: FormComponent, formComponents: FormComponent[], template: string): string {
		let tmpl: string = regexNgComponentsImports.search(template)[2];
		let result: StringContainer = new StringContainer();

		let current: StringContainer = new StringContainer(tmpl);
		current.replace("&{component.className}", StringHandlerUtil.convertToClassName(mainComponent.$name));
		current.replace("&{folder.name}", StringHandlerUtil.convertCamelCaseToDashed(mainComponent.$name));
		current.replace("&{component.name}", StringHandlerUtil.convertCamelCaseToDashed(mainComponent.$name).concat("-main"));
		result.concat(current);

		formComponents.forEach(formComponent => {
			if (formComponent.$isGenReqFileForm && this.genReqFileFormImported) {
				return;
			}
			let current: StringContainer = new StringContainer(tmpl);
			current.replace("&{component.className}", StringHandlerUtil.convertToClassName(formComponent.$name));
			if (formComponent.$isGenReqFileForm) {
				current.replace("&{folder.name}", "common-gen");
				this.genReqFileFormImported = true;
			} else {
				current.replace("&{folder.name}", StringHandlerUtil.convertCamelCaseToDashed(mainComponent.$name));
			}
			current.replace("&{component.name}", StringHandlerUtil.convertCamelCaseToDashed(formComponent.$name));
			result.concat(current);
		});

		return result.toString();
	}

	private renderAppComponent(generationForms: GenerationForm[]): string {
		return tmplAppComponent;
	}

	private renderAppModule(generationForms: GenerationForm[]): string {
		let result: StringContainer = new StringContainer(tmplAppModule);
		let ngComponentsDeclaration: StringContainer = new StringContainer();
		let ngComponentsImports: StringContainer = new StringContainer();
		this.genReqFileFormImported = false;
		this.genReqFileFormDeclared = false;
		generationForms.forEach(generationForm => {
			ngComponentsDeclaration.concat(this.renderNgComponentsDeclaration(generationForm.$mainForm, generationForm.$forms));
			ngComponentsImports.concat(this.renderNgComponentsImports(generationForm.$mainForm, generationForm.$forms, tmplAppModule));
		});
		result.replace(regexNgComponentsDeclaration.regex, ngComponentsDeclaration);
		result.replace(regexNgComponentsImports.regex, ngComponentsImports);
		return result.toString();
	}

	private renderNgComponentsDeclaration(mainComponent: FormComponent, formComponents: FormComponent[]) {
		let tmpl: string = regexNgComponentsDeclaration.search(tmplAppModule)[2];
		let result: StringContainer = new StringContainer();

		let current: StringContainer = new StringContainer(tmpl);
		current.replace("&{component.className}", StringHandlerUtil.convertToClassName(mainComponent.$name));
		result.concat(current);

		formComponents.forEach(formComponent => {
			if (formComponent.$isGenReqFileForm) {
				if (this.genReqFileFormDeclared) {
					return;
				}
				this.genReqFileFormDeclared = true;
			}
			let current: StringContainer = new StringContainer(tmpl);
			current.replace("&{component.className}", StringHandlerUtil.convertToClassName(formComponent.$name));
			result.concat(current);
		});

		return result.toString();
	}
}