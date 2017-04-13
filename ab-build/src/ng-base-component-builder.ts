/// <reference path="../../node_modules/@types/node/index.d.ts" />
import fs = require("fs");
import xsdLib = require("libxml-xsd");
import replaceAll = require("replaceall");
import shelljs = require("shelljs");
import pretty = require("pretty");
import { FormComponent } from "./form-component.entity";
import { Input } from "./input.entity";
import { InputGroup } from "./input-group.entity";
import { Metadata } from "./metadata.entity";
import { Form } from "./form.entity";
import { FormsConfig } from "./forms-config.entity";
import { XpathProcessorUtil, ELEMENT_NODE } from "./xpath-processor.util";
import { StringContainer } from "./string-container";
import { Logger } from "./logger";
import { RegexContainer } from "./regex-container";

const logger: Logger = new Logger();
const appSrcFolder: string = "./src/app";
const abGeneratedFolder: string = appSrcFolder + "/abgenerated/";

const formsConfigFolder: string = appSrcFolder + "/forms-config";
const abBuildWorkspaceFolder: string = "./ab-build/";

const mainComponentTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/main-component.template.html").toString();
const regexFormListRadioTmpl = new RegexContainer(/(:: FORM_LIST_RADIO_TMPL ::)([\s\S]*)(:: \/FORM_LIST_RADIO_TMPL ::)/g);

const formComponentTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/form-component.template.html").toString();
const regexForGroupListTmpl = new RegexContainer(/(:: FOR_GROUP_LIST ::)([\s\S]*)(:: \/FOR_GROUP_LIST ::)/g);
const regexForGroupInputListTmpl = new RegexContainer(/(:: FOR_GROUP_INPUT_LIST ::)([\s\S]*)(:: \/FOR_GROUP_INPUT_LIST ::)/g);
const regexInputContainerTmpl = new RegexContainer(/(:: INPUT_CONTAINER ::)([\s\S]*)(:: \/INPUT_CONTAINER ::)/g);
const regexInputCheckboxTmpl = new RegexContainer(/(:: CHECKBOX ::)([\s\S]*)(:: \/CHECKBOX ::)/g);
const regexInputChoiceTmpl = new RegexContainer(/(:: CHOICE ::)([\s\S]*)(:: \/CHOICE ::)/g);
const regexInputChoiceOptionsTmpl = new RegexContainer(/(:: CHOICE_OPTIONS ::)([\s\S]*)(:: \/CHOICE_OPTIONS ::)/g);
const regexInputElseTmpl = new RegexContainer(/(:: ELSE ::)([\s\S]*)(:: \/ELSE ::)/g);

const formComponentGenReqTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/form-component-genreq.template.html").toString();

class NgBaseComponentBuilder {

	private xmlContents: string = fs.readFileSync(abBuildWorkspaceFolder + "config/sample-arch-osb.xml").toString();
	private xpath: XpathProcessorUtil;

	constructor() {
		this.xpath = new XpathProcessorUtil(this.xmlContents);
	}

	public main() {
		if (this.validateXML() != null) {
			return;
		}
		let formsConfig: FormsConfig = this.processXML();

		let mainComponent: FormComponent = this.renderMainComponentNgTemplate(formsConfig);
		let formComponents: FormComponent[] = this.renderFormComponentsNgTemplates(formsConfig);

		shelljs.rm("-R", abGeneratedFolder);
		shelljs.mkdir("-p", abGeneratedFolder + mainComponent.$name);
		fs.writeFileSync(abGeneratedFolder + mainComponent.$name + "/main.component.html", mainComponent.$ngTemplate);
		formComponents.forEach(formComponent => {
			fs.writeFileSync(abGeneratedFolder + mainComponent.$name + "/" + formComponent.$name + ".component.html", pretty(formComponent.$ngTemplate));
		});
	}

	private validateXML(): any {
		let xsdContents: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/forms-config-schema.xsd").toString();
		let formsConfigSchema = xsdLib.parse(xsdContents);

		let validationErrors = formsConfigSchema.validate(this.xmlContents);
		if (validationErrors != null) {
			console.log(validationErrors.toString());
			return validationErrors;
		}
		return null;
	}

	private processXML(): FormsConfig {
		let formsConfig: FormsConfig = new FormsConfig();

		let metadata: Metadata = new Metadata();
		metadata.$generatorKey = this.xpath.selectValue("/abFormsConfig/metadata/generatorKey");
		metadata.$generatorComponent = this.xpath.selectValue("/abFormsConfig/metadata/generatorComponent");
		metadata.$title = this.xpath.selectValue("/abFormsConfig/metadata/title");
		metadata.$description = this.xpath.selectValue("/abFormsConfig/metadata/description");

		let formNodeList: Node[] = this.xpath.selectNodes("/abFormsConfig/form");
		let formList: Form[] = new Array<Form>();
		formNodeList.forEach(formNode => {
			let form = new Form();
			form.$isGenerationRequestFileForm = this.xpath.isPresent("generationRequestFileForm", formNode);
			if (!form.$isGenerationRequestFileForm) {
				form.$formId = this.xpath.selectValue("formId", formNode);
				form.$formTitle = this.xpath.selectValue("formTitle", formNode);
				form.$formDescription = this.xpath.selectValue("formDescription", formNode);
				form.$formFunction = this.xpath.selectValue("formFunction", formNode);

				let inputGroups: InputGroup[] = new Array<InputGroup>();
				let inputGroupNodeList: Node[] = this.xpath.selectNodes("formElements/inputGroup", formNode);
				inputGroupNodeList.forEach(inputGroupNode => {
					let inputGroup: InputGroup = new InputGroup();
					inputGroup.$groupTitle = this.xpath.selectValue("groupTitle", inputGroupNode);
					inputGroup.$inputList = this.processInputs(this.xpath.selectNodes("inputs", inputGroupNode)[0]);
					inputGroups.push(inputGroup);
				});
				form.$inputGroupList = inputGroups;
			} else {
				form.$formId = "GenReqFileForm";
			}
			formList.push(form);
		});

		formsConfig.$forms = formList;
		formsConfig.$metadata = metadata;

		return formsConfig;
	}

	private processInputs(inputsNode: Node): Input[] {
		let inputList: Input[] = new Array<Input>();
		let children: NodeList = inputsNode.childNodes;
		for (var index = 0; index < children.length; index++) {
			let child: Node = children.item(index);
			if (child.nodeType == ELEMENT_NODE) {
				let input: Input = new Input();
				input.$mapLabel = this.xpath.selectValue("label", child);
				input.$mapValueKey = this.xpath.selectValue("valueKey", child);

				switch (child.nodeName) {
					case "text":
						input.$type = "text";
						this.fillCommonInputInfo(input, child);
						input.$boxPlaceholder = this.xpath.selectValue("placeholder", child);
						break;

					case "number":
						input.$type = "number";
						this.fillCommonInputInfo(input, child);
						input.$boxPlaceholder = this.xpath.selectValue("placeholder", child);
						break;

					case "checkbox":
						input.$type = "checkbox";
						this.fillCommonInputInfo(input, child);
						break;
					// TODO: develop file upload
					// case "file":
					// 	input.$type = "file";
					// 	break;

					case "choice":
						input.$type = "choice";
						this.fillCommonInputInfo(input, child);
						let optionNodes: Node[] = this.xpath.selectNodes("options/option", child);
						input.$choiceOptions = new Array<string>();
						optionNodes.forEach(optionNode => {
							input.$choiceOptions.push(this.xpath.selectValue(".", optionNode));
						});
						break;

					default:
						break;
				}
				inputList.push(input);
			}
		}
		return inputList;
	}

	private fillCommonInputInfo(currentInput: Input, currentNodeInput: Node) {
		currentInput.$commonDefaultValue = this.xpath.selectValue("defaultValue", currentNodeInput);
		currentInput.$commonHelptext = this.xpath.selectValue("helptext", currentNodeInput);
		currentInput.$commonBlocked = this.xpath.isPresent("blocked", currentNodeInput);
		currentInput.$commonRequired = this.xpath.isPresent("required", currentNodeInput);

		currentInput.$commonPostSubmit = new Array<string>();
		let postSubmitOpsNodes: Node[] = this.xpath.selectNodes("postSubmit/stringOperation", currentNodeInput);
		postSubmitOpsNodes.forEach(opNode => {
			let postSubmitOp: string = this.xpath.selectValue(".", opNode);
			currentInput.$commonPostSubmit.push(postSubmitOp);
		});
	}

	private renderMainComponentNgTemplate(formsConfig: FormsConfig): FormComponent {
		let result: string = mainComponentTemplate;
		result = replaceAll("<!--#TITLE#-->", formsConfig.$metadata.$title, result);
		result = replaceAll("<!--#DESCRIPTION#-->", formsConfig.$metadata.$description, result);
		result = result.replace(regexFormListRadioTmpl.regex, this.renderFormListRadioButtons(formsConfig.$forms));
		result = replaceAll("<!--#FORM_DISPLAY#-->", this.renderFormListNgSelectors(formsConfig.$forms), result);

		let mainComponent: FormComponent = new FormComponent();
		mainComponent.$name = formsConfig.$metadata.$generatorKey;
		mainComponent.$ngTemplate = result;
		return mainComponent;
	}

	private renderFormListRadioButtons(formList: Form[]): string {
		let radioTmpl: string = regexFormListRadioTmpl.search(mainComponentTemplate)[2];
		let result: string = "";
		formList.forEach(form => {
			let currentItem: string = radioTmpl;
			if (!form.$isGenerationRequestFileForm) {
				currentItem = replaceAll("<!--FORM_ID-->", form.$formId, currentItem);
				currentItem = replaceAll("<!--FORM_TITLE-->", form.$formTitle, currentItem);
			} else {
				currentItem = replaceAll("<!--FORM_ID-->", "GenReqFileForm", currentItem);
				currentItem = replaceAll("<!--FORM_TITLE-->", "Generate using file", currentItem);
			}
			result = result.concat(currentItem);
		});
		return result;
	}

	private renderFormListNgSelectors(formList: Form[]): string {
		let result: string = "";
		formList.forEach(form => {
			let currentItem: string = "<<!--FORM_ID-->></<!--FORM_ID-->>\n";
			if (!form.$isGenerationRequestFileForm) {
				currentItem = replaceAll("<!--FORM_ID-->", form.$formId, currentItem);
			} else {
				currentItem = replaceAll("<!--FORM_ID-->", "GenReqFileForm", currentItem);
			}
			result = result.concat(currentItem);
		});
		return result;
	}

	private renderFormComponentsNgTemplates(formsConfig: FormsConfig): FormComponent[] {
		let formComponentList: FormComponent[] = new Array<FormComponent>();
		formsConfig.$forms.forEach(form => {
			if (!form.$isGenerationRequestFileForm) {
				let ngTemplate: StringContainer = new StringContainer(formComponentTemplate);
				ngTemplate.replace(regexForGroupListTmpl.regex, this.renderInputGroups(form.$inputGroupList, ngTemplate));
				ngTemplate.replaceAll("<!--form.formFunction-->", form.$formFunction);

				console.log(ngTemplate.toString());
				let formComponent: FormComponent = new FormComponent();
				formComponent.$name = form.$formId;
				formComponent.$ngTemplate = ngTemplate.toString();
				formComponentList.push(formComponent);
			} else {
				let formComponent: FormComponent = new FormComponent();
				formComponent.$name = form.$formId;
				formComponent.$ngTemplate = formComponentGenReqTemplate;
				formComponentList.push(formComponent);

			}
		});
		return formComponentList;
	}

	private renderInputGroups(inputGroupList: InputGroup[], ngTemplate: StringContainer): StringContainer {
		let inputGroupListStr: StringContainer = new StringContainer();
		let inputGroupListTmpl: StringContainer = new StringContainer(regexForGroupListTmpl.search(ngTemplate.toString())[2]);
		inputGroupList.forEach(inputGroup => {
			let inputListStr: StringContainer = new StringContainer();
			inputGroup.$inputList.forEach(input => {
				inputListStr.concat(this.renderInput(input, ngTemplate));
			});
			inputGroupListTmpl.replace(regexForGroupInputListTmpl.regex, inputListStr.getString());
			inputGroupListTmpl.replaceAll("<!--group.groupTitle-->", inputGroup.$groupTitle);
			inputGroupListStr.concat(inputGroupListTmpl.toString());
		});
		return inputGroupListStr;
	}

	private renderInput(input: Input, ngTemplate: StringContainer) {
		var forGroupInputListTmpl = regexForGroupInputListTmpl.search(ngTemplate.getString());
		let inputStr: StringContainer = new StringContainer(forGroupInputListTmpl[2]);
		inputStr.replaceAll("<!--input.mapLabel-->", input.$mapLabel);
		inputStr.replaceAll("<!--input.commonHelptext-->", input.$commonHelptext);
		switch (input.$type) {
			case "checkbox":
				let tmplCheckbox: StringContainer = new StringContainer(regexInputCheckboxTmpl.search(ngTemplate.getString())[2]);
				tmplCheckbox.replaceAll("<!--input.type-->", input.$type);
				tmplCheckbox.replaceAll("<!--input.mapValueKey-->", input.$mapValueKey);
				tmplCheckbox.replaceAll("<!--input.commonDefaultValue-->", input.$commonDefaultValue);
				inputStr.replace(regexInputContainerTmpl.regex, tmplCheckbox.getString());
				break;
			case "choice":
				let tmplChoice: StringContainer = new StringContainer(regexInputChoiceTmpl.search(ngTemplate.getString())[2]);
				tmplChoice.replace(regexInputChoiceOptionsTmpl.regex, this.renderChoiceOptions(input, tmplChoice).toString());
				tmplChoice.replaceAll("<!--input.type-->", input.$type);
				tmplChoice.replaceAll("<!--input.commonDefaultValue-->", input.$commonDefaultValue);
				tmplChoice.replaceAll("<!--input.mapValueKey-->", input.$mapValueKey);
				tmplChoice.replaceAll("<!--input.commonBlocked?=readonly-->", input.$commonBlocked ? "readonly" : "");
				tmplChoice.replaceAll("<!--input.commonRequired?=required-->", input.$commonRequired ? "required" : "");
				inputStr.replace(regexInputContainerTmpl.regex, tmplChoice.getString());
				break;
			default:
				let tmplElse: StringContainer = new StringContainer(regexInputElseTmpl.search(ngTemplate.getString())[2]);
				tmplElse.replaceAll("<!--input.type-->", input.$type);
				tmplElse.replaceAll("<!--input.mapValueKey-->", input.$mapValueKey);
				tmplElse.replaceAll("<!--input.boxPlaceholder-->", input.$boxPlaceholder);
				tmplElse.replaceAll("<!--input.commonDefaultValue-->", input.$commonDefaultValue);
				tmplElse.replaceAll("<!--input.commonBlocked?=readonly-->", input.$commonBlocked ? "readonly" : "");
				tmplElse.replaceAll("<!--input.commonRequired?=required-->", input.$commonRequired ? "required" : "");
				inputStr.replace(regexInputContainerTmpl.regex, tmplElse.getString());
				break;
		}
		return inputStr;
	}

	private renderChoiceOptions(input: Input, choiceStr: StringContainer): StringContainer {
		let optionsStr: StringContainer = new StringContainer();
		let optionTmpl: StringContainer = new StringContainer(regexInputChoiceOptionsTmpl.search(choiceStr.getString())[2]);
		input.$choiceOptions.forEach(option => {
			optionsStr.concat(optionTmpl.replaceAll("<!--input.$choiceOptions.[]-->", option));
		});
		return optionsStr;
	}

}

var ngb = new NgBaseComponentBuilder();
ngb.main();