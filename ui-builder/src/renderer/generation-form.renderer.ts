import { StringContainer, RegexContainer, StringHandlerUtil } from "@artifacter/common";
import * as fs from "fs";

import { GenerationForm } from "./../entity/generation-form";
import { FormComponent } from "./../entity/form-component";


import { uiBuilderWorkspaceFolder } from "./../constants";
const mainComponentTemplate: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/main-component.component.html.atmpl").toString();
const regexFormListRadioTmpl = new RegexContainer(/(::FORM_LIST_RADIO_TMPL::)([\s\S]*)(::\/FORM_LIST_RADIO_TMPL::)/g);

const mainComponentComponent: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/main-component.component.ts.atmpl").toString();

const formComponentTemplate: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/form-component.component.html.atmpl").toString();
const regexForGroupListTmpl = new RegexContainer(/(::FOR_GROUP_LIST::)([\s\S]*)(::\/FOR_GROUP_LIST::)/g);
const regexForGroupInputListTmpl = new RegexContainer(/(::FOR_GROUP_INPUT_LIST::)([\s\S]*)(::\/FOR_GROUP_INPUT_LIST::)/g);
const regexInputContainerTmpl = new RegexContainer(/(::INPUT_CONTAINER::)([\s\S]*)(::\/INPUT_CONTAINER::)/g);
const regexInputCheckboxTmpl = new RegexContainer(/(::CHECKBOX::)([\s\S]*)(::\/CHECKBOX::)/g);
const regexInputChoiceTmpl = new RegexContainer(/(::CHOICE::)([\s\S]*)(::\/CHOICE::)/g);
const regexInputChoiceOptionsTmpl = new RegexContainer(/(::CHOICE_OPTIONS::)([\s\S]*)(::\/CHOICE_OPTIONS::)/g);
const regexInputElseTmpl = new RegexContainer(/(::ELSE::)([\s\S]*)(::\/ELSE::)/g);

const formComponentGenReqTemplate: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/form-component-genreq.component.html.atmpl").toString();

const formComponentComponent: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/form-component.component.ts.atmpl").toString();
const regexInputs = new RegexContainer(/(::INPUTS::)([\s\S]*)(::\/INPUTS::)/g);
const regexInputsDefaultValue = new RegexContainer(/(::DEFAULT_VALUES::)([\s\S]*)(::\/DEFAULT_VALUES::)/g);

const formComponentGenReqComponent: string = fs.readFileSync(uiBuilderWorkspaceFolder + "core-config-files/templates/form-component-genreq.component.ts.atmpl").toString();

export class GenerationFormRenderer {

	public render(uiConfig: any): GenerationForm {
		let mainComponent: FormComponent = this.renderMainComponent(uiConfig);
		let formComponents: FormComponent[] = this.renderFormComponents(uiConfig);

		let generationForm: GenerationForm = new GenerationForm();
		generationForm.$mainForm = mainComponent;
		generationForm.$forms = formComponents;

		return generationForm;
	}

	private renderMainComponent(uiConfig: any): FormComponent {
		let mainComponent: FormComponent = new FormComponent();
		mainComponent.$name = uiConfig.metadata.generatorKey;

		let ngTemplate: StringContainer = new StringContainer(mainComponentTemplate);
		ngTemplate.replaceAll("&{TITLE}", uiConfig.metadata.title);
		ngTemplate.replaceAll("&{DESCRIPTION}", uiConfig.metadata.description);
		ngTemplate.replace(regexFormListRadioTmpl.regex, this.renderFormListRadioButtons(uiConfig.form));

		let ngComponent: StringContainer = new StringContainer(mainComponentComponent);
		ngComponent.replaceAll("&{(cC2dashed)form.name}", StringHandlerUtil.convertCamelCaseToDashed(mainComponent.$name));
		ngComponent.replaceAll("&{form.name}", mainComponent.$name);
		ngComponent.replaceAll("&{form.className}", StringHandlerUtil.convertToClassName(mainComponent.$name));

		mainComponent.$ngTemplate = ngTemplate.toString();
		mainComponent.$ngComponent = ngComponent.toString();
		return mainComponent;
	}

	private renderFormListRadioButtons(formList: any[]): string {
		let radioTmpl: string = regexFormListRadioTmpl.search(mainComponentTemplate)[2];
		let result: StringContainer = new StringContainer();
		formList.forEach(form => {
			let currentItem: StringContainer = new StringContainer(radioTmpl);
			if (form.generationRequestFileForm == null) {
				currentItem.replaceAll("&{formLink}", StringHandlerUtil.convertCamelCaseToDashed(form.formId));
				currentItem.replaceAll("&{FORM_ID}", form.formId);
				currentItem.replaceAll("&{FORM_TITLE}", form.formTitle);
			} else {
				currentItem.replaceAll("&{formLink}", StringHandlerUtil.convertCamelCaseToDashed("GenReqFileForm"));
				currentItem.replaceAll("&{FORM_ID}", "GenReqFileForm");
				currentItem.replaceAll("&{FORM_TITLE}", "Generate using file");
			}
			result.concat(currentItem);
		});
		return result.toString();
	}

	private renderFormComponents(uiConfig: any): FormComponent[] {
		let formComponentList: FormComponent[] = new Array<FormComponent>();
		uiConfig.form.forEach(form => {
			let formComponent: FormComponent = new FormComponent();
			formComponent.$isGenReqFileForm = form.generationRequestFileForm != null;
			formComponent.$name = !formComponent.$isGenReqFileForm ? form.formId : "GenReqFileForm";
			formComponent.$ngTemplate = this.renderNgTemplate(form);
			formComponent.$ngComponent = this.renderNgComponent(form, uiConfig.metadata);
			formComponentList.push(formComponent);
		});
		return formComponentList;
	}

	private renderNgTemplate(form: any): string {
		if (form.generationRequestFileForm == null) {
			let ngTemplate: StringContainer = new StringContainer(formComponentTemplate);
			ngTemplate.replace(regexForGroupListTmpl.regex, this.renderInputGroups(form.formElements.inputGroup, ngTemplate));
			ngTemplate.replaceAll("&{form.formFunction}", form.formFunction);

			return ngTemplate.toString();
		} else {
			return formComponentGenReqTemplate;
		}
	}

	private renderNgComponent(form: any, meta: any): string {
		if (form.generationRequestFileForm == null) {
			let ngComponent: StringContainer = new StringContainer(formComponentComponent);
			ngComponent.replace(regexInputs.regex, this.renderComponentInputs(form.formElements.inputGroup, ngComponent));
			ngComponent.replace(regexInputsDefaultValue.regex, this.renderComponentInputsDefaultValue(form.formElements.inputGroup, ngComponent));
			ngComponent.replaceAll("&{meta.generatorComponent}", meta.generatorComponent);
			ngComponent.replaceAll("&{form.formId}", form.formId);
			ngComponent.replaceAll("&{form.className}", StringHandlerUtil.convertToClassName(form.formId));
			ngComponent.replaceAll("&{form.formFunction}", form.formFunction);

			ngComponent.replaceAll("&{(cC2dashed)form.formId}", StringHandlerUtil.convertCamelCaseToDashed(form.formId));

			return ngComponent.toString();
		} else {
			return formComponentGenReqComponent;
		}
	}

	private renderComponentInputs(inputGroupList: any[], ngComponent: StringContainer): StringContainer {
		let inputsStr: StringContainer = new StringContainer();
		let inputsTmpl: string = regexInputs.search(ngComponent.toString())[2];
		inputGroupList.forEach(inputGroup => {
			inputGroup.inputs.forEach(input => {
				let containingInput = input;
				input = this.resolveCommonInput(input);
				let currentStr: StringContainer = new StringContainer(inputsTmpl);
				currentStr.replace("&{input.mapValueKey}", input.valueKey);
				if(containingInput.checkbox){
					currentStr.replace("&{isCheckbox?'boolean':'string'}", "boolean");
				}else{
					currentStr.replace("&{isCheckbox?'boolean':'string'}", "string");
				}
				inputsStr.concat(currentStr);
			});
		});
		return inputsStr;
	}

	private resolveCommonInput(input: any): any {
		if (input.text) {
			return input.text;
		} else if (input.number) {
			return input.number;
		} else if (input.checkbox) {
			return input.checkbox;
		} else if (input.choice) {
			return input.choice;
		} else if (input.file) {
			return input.file;
		} else {
			return input;
		}
	}

	private resolveInputTypeString(input: any): any {
		if (input.text) {
			return "text";
		} else if (input.number) {
			return "number";
		} else if (input.file) {
			return "file";
		} else {
			return "";
		}
	}

	private renderComponentInputsDefaultValue(inputGroupList: any[], ngComponent: StringContainer): StringContainer {
		let inputsStr: StringContainer = new StringContainer();
		let inputsTmpl: string = regexInputsDefaultValue.search(ngComponent.toString())[2];
		inputGroupList.forEach(inputGroup => {
			inputGroup.inputs.forEach(input => {
				let concreteInput: any = this.resolveCommonInput(input);
				if (concreteInput.defaultValue != null || input.checkbox != null) {
					let currentStr: StringContainer = new StringContainer(inputsTmpl);
					currentStr.replace("&{input.mapValueKey}", concreteInput.valueKey)
					let value: string = concreteInput.defaultValue;
					if (input.checkbox) {
						value = value == "1" || value == "true" ? "true" : "false";
					}else {
						value = "\""+value+"\"";
					}
					currentStr.replace("&{input.commonDefaultValue}", value);

					inputsStr.concat(currentStr);
				}
			});
		});
		return inputsStr;
	}

	private renderInputGroups(inputGroupList: any[], ngTemplate: StringContainer): StringContainer {
		let inputGroupListStr: StringContainer = new StringContainer();
		inputGroupList.forEach(inputGroup => {
			let inputGroupListTmpl: StringContainer = new StringContainer(regexForGroupListTmpl.search(ngTemplate.toString())[2]);
			let inputListStr: StringContainer = new StringContainer();
			inputGroup.inputs.forEach(input => {
				inputListStr.concat(this.renderInput(input, ngTemplate));
			});
			inputGroupListTmpl.replace(regexForGroupInputListTmpl.regex, inputListStr.getString());
			inputGroupListTmpl.replaceAll("&{group.groupTitle}", inputGroup.groupTitle);
			inputGroupListStr.concat(inputGroupListTmpl.toString());
		});
		return inputGroupListStr;
	}

	private renderInput(input: any, ngTemplate: StringContainer) {
		var forGroupInputListTmpl = regexForGroupInputListTmpl.search(ngTemplate.getString());
		let inputStr: StringContainer = new StringContainer(forGroupInputListTmpl[2]);
		let commonInput: any = this.resolveCommonInput(input);
		inputStr.replaceAll("&{input.mapLabel}", commonInput.label);
		inputStr.replaceAll("&{input.commonHelptext}", commonInput.helptext);
		if (input.checkbox) {
			let tmplCheckbox: StringContainer = new StringContainer(regexInputCheckboxTmpl.search(ngTemplate.getString())[2]);
			tmplCheckbox.replaceAll("&{input.type}", "checkbox");
			tmplCheckbox.replaceAll("&{input.mapValueKey}", commonInput.valueKey);
			inputStr.replace(regexInputContainerTmpl.regex, tmplCheckbox.getString());
		} else if (input.choice) {
			let tmplChoice: StringContainer = new StringContainer(regexInputChoiceTmpl.search(ngTemplate.getString())[2]);
			tmplChoice.replace(regexInputChoiceOptionsTmpl.regex, this.renderChoiceOptions(commonInput, tmplChoice).toString());
			tmplChoice.replaceAll("&{input.type}", "select");
			tmplChoice.replaceAll("&{input.mapValueKey}", commonInput.valueKey);
			tmplChoice.replaceAll("&{input.commonReadonly?\"readonly\"}", commonInput.readonly != null ? "readonly" : "");
			tmplChoice.replaceAll("&{input.commonRequired?\"required\"}", commonInput.required != null ? "required" : "");
			inputStr.replace(regexInputContainerTmpl.regex, tmplChoice.getString());
		} else {
			let tmplElse: StringContainer = new StringContainer(regexInputElseTmpl.search(ngTemplate.getString())[2]);
			tmplElse.replaceAll("&{input.type}", this.resolveInputTypeString(input));
			tmplElse.replaceAll("&{input.mapValueKey}", commonInput.valueKey);
			tmplElse.replaceAll("&{input.boxPlaceholder}", commonInput.placeholder);
			tmplElse.replaceAll("&{input.commonReadonly?\"readonly\"}", commonInput.readonly != null ? "readonly" : "");
			tmplElse.replaceAll("&{input.commonRequired?\"required\"}", commonInput.required != null ? "required" : "");
			inputStr.replace(regexInputContainerTmpl.regex, tmplElse.getString());
		}
		return inputStr;
	}

	private renderChoiceOptions(input: any, choiceStr: StringContainer): StringContainer {
		let optionsStr: StringContainer = new StringContainer();
		input.options.forEach(option => {
			let optionTmpl: StringContainer = new StringContainer(regexInputChoiceOptionsTmpl.search(choiceStr.getString())[2]);
			optionsStr.concat(optionTmpl.replaceAll("&{input.choiceOptions}", option.option));
		});
		return optionsStr;
	}
}