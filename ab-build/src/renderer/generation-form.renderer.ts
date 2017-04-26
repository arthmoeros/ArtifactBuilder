import * as fs from "fs";
import * as replaceAll from "replaceall";

import { FormsConfig } from "./../entity/forms-config";
import { GenerationForm } from "./../entity/generation-form";
import { FormComponent } from "./../entity/form-component";
import { Input } from "./../entity/input";
import { InputGroup } from "./../entity/input-group";
import { Metadata } from "./../entity/metadata";
import { Form } from "./../entity/form";

import { StringContainer } from "./../container/string.container";
import { RegexContainer } from "./../container/regex.container";
import { StringHandlerUtil } from "./../other/string-handler.util";

import { abBuildWorkspaceFolder } from "./../constants";
const mainComponentTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-config-files/templates/main-component.component.html.abtmpl").toString();
const regexFormListRadioTmpl = new RegexContainer(/(::FORM_LIST_RADIO_TMPL::)([\s\S]*)(::\/FORM_LIST_RADIO_TMPL::)/g);

const mainComponentComponent: string = fs.readFileSync(abBuildWorkspaceFolder + "core-config-files/templates/main-component.component.ts.abtmpl").toString();

const formComponentTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-config-files/templates/form-component.component.html.abtmpl").toString();
const regexForGroupListTmpl = new RegexContainer(/(::FOR_GROUP_LIST::)([\s\S]*)(::\/FOR_GROUP_LIST::)/g);
const regexForGroupInputListTmpl = new RegexContainer(/(::FOR_GROUP_INPUT_LIST::)([\s\S]*)(::\/FOR_GROUP_INPUT_LIST::)/g);
const regexInputContainerTmpl = new RegexContainer(/(::INPUT_CONTAINER::)([\s\S]*)(::\/INPUT_CONTAINER::)/g);
const regexInputCheckboxTmpl = new RegexContainer(/(::CHECKBOX::)([\s\S]*)(::\/CHECKBOX::)/g);
const regexInputChoiceTmpl = new RegexContainer(/(::CHOICE::)([\s\S]*)(::\/CHOICE::)/g);
const regexInputChoiceOptionsTmpl = new RegexContainer(/(::CHOICE_OPTIONS::)([\s\S]*)(::\/CHOICE_OPTIONS::)/g);
const regexInputElseTmpl = new RegexContainer(/(::ELSE::)([\s\S]*)(::\/ELSE::)/g);

const formComponentGenReqTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-config-files/templates/form-component-genreq.component.html.abtmpl").toString();

const formComponentComponent: string = fs.readFileSync(abBuildWorkspaceFolder + "core-config-files/templates/form-component.component.ts.abtmpl").toString();
const regexInputs = new RegexContainer(/(::INPUTS::)([\s\S]*)(::\/INPUTS::)/g);
const regexInputsDefaultValue = new RegexContainer(/(::DEFAULT_VALUES::)([\s\S]*)(::\/DEFAULT_VALUES::)/g);

const formComponentGenReqComponent: string = fs.readFileSync(abBuildWorkspaceFolder + "core-config-files/templates/form-component-genreq.component.ts.abtmpl").toString();
export class GenerationFormRenderer{

	public render(formsConfig: FormsConfig): GenerationForm{
		let mainComponent: FormComponent = this.renderMainComponent(formsConfig);
		let formComponents: FormComponent[] = this.renderFormComponents(formsConfig);

		let generationForm: GenerationForm = new GenerationForm();
		generationForm.$mainForm = mainComponent;
		generationForm.$forms = formComponents;

		return generationForm;
	}

	private renderMainComponent(formsConfig: FormsConfig): FormComponent {
		let mainComponent: FormComponent = new FormComponent();
		mainComponent.$name = formsConfig.$metadata.$generatorKey;

		let ngTemplate: string = mainComponentTemplate;
		ngTemplate = replaceAll("&{TITLE}", formsConfig.$metadata.$title, ngTemplate);
		ngTemplate = replaceAll("&{DESCRIPTION}", formsConfig.$metadata.$description, ngTemplate);
		ngTemplate = ngTemplate.replace(regexFormListRadioTmpl.regex, this.renderFormListRadioButtons(formsConfig.$forms));
		ngTemplate = replaceAll("&{FORM_DISPLAY}", this.renderFormListNgSelectors(formsConfig.$forms), ngTemplate);

		let ngComponent: StringContainer = new StringContainer(mainComponentComponent);
		ngComponent.replaceAll("&{(cC2dashed)form.name}", StringHandlerUtil.convertCamelCaseToDashed(mainComponent.$name));
		ngComponent.replaceAll("&{form.name}", mainComponent.$name);
		ngComponent.replaceAll("&{form.className}", StringHandlerUtil.convertToClassName(mainComponent.$name));

		mainComponent.$ngTemplate = ngTemplate;
		mainComponent.$ngComponent = ngComponent.toString();
		return mainComponent;
	}

	private renderFormListRadioButtons(formList: Form[]): string {
		let radioTmpl: string = regexFormListRadioTmpl.search(mainComponentTemplate)[2];
		let result: string = "";
		formList.forEach(form => {
			let currentItem: string = radioTmpl;
			if (!form.$isGenerationRequestFileForm) {
				currentItem = replaceAll("&{formLink}", StringHandlerUtil.convertCamelCaseToDashed(form.$formId), currentItem);
				currentItem = replaceAll("&{FORM_ID}", form.$formId, currentItem);
				currentItem = replaceAll("&{FORM_TITLE}", form.$formTitle, currentItem);
			} else {
				currentItem = replaceAll("&{formLink}", StringHandlerUtil.convertCamelCaseToDashed("GenReqFileForm"), currentItem);
				currentItem = replaceAll("&{FORM_ID}", "GenReqFileForm", currentItem);
				currentItem = replaceAll("&{FORM_TITLE}", "Generate using file", currentItem);
			}
			result = result.concat(currentItem);
		});
		return result;
	}

	private renderFormListNgSelectors(formList: Form[]): string {
		let result: string = "";
		formList.forEach(form => {
			let currentItem: string = "<&{FORM_ID}></&{FORM_ID}>\n";
			if (!form.$isGenerationRequestFileForm) {
				currentItem = replaceAll("&{FORM_ID}", form.$formId, currentItem);
			} else {
				currentItem = replaceAll("&{FORM_ID}", "GenReqFileForm", currentItem);
			}
			result = result.concat(currentItem);
		});
		return result;
	}

	private renderFormComponents(formsConfig: FormsConfig): FormComponent[] {
		let formComponentList: FormComponent[] = new Array<FormComponent>();
		formsConfig.$forms.forEach(form => {
			let formComponent: FormComponent = new FormComponent();
			formComponent.$name = form.$formId;
			formComponent.$ngTemplate = this.renderNgTemplate(form);
			formComponent.$ngComponent = this.renderNgComponent(form, formsConfig.$metadata);
			formComponent.$isGenReqFileForm = form.$isGenerationRequestFileForm;
			formComponentList.push(formComponent);
		});
		return formComponentList;
	}

	private renderNgTemplate(form: Form): string {
		if (!form.$isGenerationRequestFileForm) {
			let ngTemplate: StringContainer = new StringContainer(formComponentTemplate);
			ngTemplate.replace(regexForGroupListTmpl.regex, this.renderInputGroups(form.$inputGroupList, ngTemplate));
			ngTemplate.replaceAll("&{form.formFunction}", form.$formFunction);

			return ngTemplate.toString();
		} else {
			return formComponentGenReqTemplate;
		}
	}

	private renderNgComponent(form: Form, meta: Metadata): string {
		if (!form.$isGenerationRequestFileForm) {
			let ngComponent: StringContainer = new StringContainer(formComponentComponent);
			ngComponent.replace(regexInputs.regex, this.renderComponentInputs(form.$inputGroupList, ngComponent));
			ngComponent.replace(regexInputsDefaultValue.regex, this.renderComponentInputsDefaultValue(form.$inputGroupList, ngComponent));
			ngComponent.replaceAll("&{meta.generatorComponent}", meta.$generatorComponent);
			ngComponent.replaceAll("&{form.formId}", form.$formId);
			ngComponent.replaceAll("&{form.className}", StringHandlerUtil.convertToClassName(form.$formId));
			ngComponent.replaceAll("&{form.formFunction}", form.$formFunction);

			ngComponent.replaceAll("&{(cC2dashed)form.formId}", StringHandlerUtil.convertCamelCaseToDashed(form.$formId));

			return ngComponent.toString();
		} else {
			return formComponentGenReqComponent;
		}
	}

	private renderComponentInputs(inputGroupList: InputGroup[], ngComponent: StringContainer): StringContainer {
		let inputsStr: StringContainer = new StringContainer();
		let inputsTmpl: string = regexInputs.search(ngComponent.toString())[2];
		inputGroupList.forEach(inputGroup => {
			inputGroup.$inputList.forEach(input => {
				let currentStr: StringContainer = new StringContainer(inputsTmpl);
				currentStr.replace("&{input.mapValueKey}", input.$mapValueKey)
				inputsStr.concat(currentStr);
			});
		});
		return inputsStr;
	}

	private renderComponentInputsDefaultValue(inputGroupList: InputGroup[], ngComponent: StringContainer): StringContainer {
		let inputsStr: StringContainer = new StringContainer();
		let inputsTmpl: string = regexInputsDefaultValue.search(ngComponent.toString())[2];
		inputGroupList.forEach(inputGroup => {
			inputGroup.$inputList.forEach(input => {
				if (input.$commonDefaultValue) {
					let currentStr: StringContainer = new StringContainer(inputsTmpl);
					currentStr.replace("&{input.mapValueKey}", input.$mapValueKey)
					let value: string = input.$commonDefaultValue;
					if (input.$type == "checkbox") {
						value = value == "1" || value == "true" ? "true" : "false";
					}
					currentStr.replace("&{input.commonDefaultValue}", value);

					inputsStr.concat(currentStr);
				}
			});
		});
		return inputsStr;
	}

	private renderInputGroups(inputGroupList: InputGroup[], ngTemplate: StringContainer): StringContainer {
		let inputGroupListStr: StringContainer = new StringContainer();
		inputGroupList.forEach(inputGroup => {
			let inputGroupListTmpl: StringContainer = new StringContainer(regexForGroupListTmpl.search(ngTemplate.toString())[2]);
			let inputListStr: StringContainer = new StringContainer();
			inputGroup.$inputList.forEach(input => {
				inputListStr.concat(this.renderInput(input, ngTemplate));
			});
			inputGroupListTmpl.replace(regexForGroupInputListTmpl.regex, inputListStr.getString());
			inputGroupListTmpl.replaceAll("&{group.groupTitle}", inputGroup.$groupTitle);
			inputGroupListStr.concat(inputGroupListTmpl.toString());
		});
		return inputGroupListStr;
	}

	private renderInput(input: Input, ngTemplate: StringContainer) {
		var forGroupInputListTmpl = regexForGroupInputListTmpl.search(ngTemplate.getString());
		let inputStr: StringContainer = new StringContainer(forGroupInputListTmpl[2]);
		inputStr.replaceAll("&{input.mapLabel}", input.$mapLabel);
		inputStr.replaceAll("&{input.commonHelptext}", input.$commonHelptext);
		switch (input.$type) {
			case "checkbox":
				let tmplCheckbox: StringContainer = new StringContainer(regexInputCheckboxTmpl.search(ngTemplate.getString())[2]);
				tmplCheckbox.replaceAll("&{input.type}", input.$type);
				tmplCheckbox.replaceAll("&{input.mapValueKey}", input.$mapValueKey);
				tmplCheckbox.replaceAll("&{input.commonDefaultValue}", input.$commonDefaultValue);
				inputStr.replace(regexInputContainerTmpl.regex, tmplCheckbox.getString());
				break;
			case "choice":
				let tmplChoice: StringContainer = new StringContainer(regexInputChoiceTmpl.search(ngTemplate.getString())[2]);
				tmplChoice.replace(regexInputChoiceOptionsTmpl.regex, this.renderChoiceOptions(input, tmplChoice).toString());
				tmplChoice.replaceAll("&{input.type}", input.$type);
				tmplChoice.replaceAll("&{input.commonDefaultValue}", input.$commonDefaultValue);
				tmplChoice.replaceAll("&{input.mapValueKey}", input.$mapValueKey);
				tmplChoice.replaceAll("&{input.commonBlocked?\"readonly\"}", input.$commonBlocked ? "readonly" : "");
				tmplChoice.replaceAll("&{input.commonRequired?\"required\"}", input.$commonRequired ? "required" : "");
				inputStr.replace(regexInputContainerTmpl.regex, tmplChoice.getString());
				break;
			default:
				let tmplElse: StringContainer = new StringContainer(regexInputElseTmpl.search(ngTemplate.getString())[2]);
				tmplElse.replaceAll("&{input.type}", input.$type);
				tmplElse.replaceAll("&{input.mapValueKey}", input.$mapValueKey);
				tmplElse.replaceAll("&{input.boxPlaceholder}", input.$boxPlaceholder);
				tmplElse.replaceAll("&{input.commonDefaultValue}", input.$commonDefaultValue);
				tmplElse.replaceAll("&{input.commonBlocked?\"readonly\"}", input.$commonBlocked ? "readonly" : "");
				tmplElse.replaceAll("&{input.commonRequired?\"required\"}", input.$commonRequired ? "required" : "");
				inputStr.replace(regexInputContainerTmpl.regex, tmplElse.getString());
				break;
		}
		return inputStr;
	}

	private renderChoiceOptions(input: Input, choiceStr: StringContainer): StringContainer {
		let optionsStr: StringContainer = new StringContainer();
		input.$choiceOptions.forEach(option => {
			let optionTmpl: StringContainer = new StringContainer(regexInputChoiceOptionsTmpl.search(choiceStr.getString())[2]);
			optionsStr.concat(optionTmpl.replaceAll("&{input.choiceOptions}", option));
		});
		return optionsStr;
	}
}