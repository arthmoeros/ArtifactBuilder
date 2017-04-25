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
import { RegexContainer } from "./regex-container";
import { GenerationForm } from "./generation-form.entity";

const appSrcFolder: string = "./src/app";
const abGeneratedFolder: string = appSrcFolder + "/abgenerated/";
const abGeneratorsFolder: string = appSrcFolder + "/abgenerators/";

const formsConfigFolder: string = appSrcFolder + "/forms-config";
const abBuildWorkspaceFolder: string = "./ab-build/";
const abXmlConfigFolder: string = abBuildWorkspaceFolder + "config/abxml";
const abGeneratorsConfigFolder: string = abBuildWorkspaceFolder + "config/abgenerators";

const mainComponentTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/main-component.template.html").toString();
const regexFormListRadioTmpl = new RegexContainer(/(:: FORM_LIST_RADIO_TMPL ::)([\s\S]*)(:: \/FORM_LIST_RADIO_TMPL ::)/g);

const mainComponentComponent: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/main-component.component.ts").toString();

const formComponentTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/form-component.template.html").toString();
const regexForGroupListTmpl = new RegexContainer(/(:: FOR_GROUP_LIST ::)([\s\S]*)(:: \/FOR_GROUP_LIST ::)/g);
const regexForGroupInputListTmpl = new RegexContainer(/(:: FOR_GROUP_INPUT_LIST ::)([\s\S]*)(:: \/FOR_GROUP_INPUT_LIST ::)/g);
const regexInputContainerTmpl = new RegexContainer(/(:: INPUT_CONTAINER ::)([\s\S]*)(:: \/INPUT_CONTAINER ::)/g);
const regexInputCheckboxTmpl = new RegexContainer(/(:: CHECKBOX ::)([\s\S]*)(:: \/CHECKBOX ::)/g);
const regexInputChoiceTmpl = new RegexContainer(/(:: CHOICE ::)([\s\S]*)(:: \/CHOICE ::)/g);
const regexInputChoiceOptionsTmpl = new RegexContainer(/(:: CHOICE_OPTIONS ::)([\s\S]*)(:: \/CHOICE_OPTIONS ::)/g);
const regexInputElseTmpl = new RegexContainer(/(:: ELSE ::)([\s\S]*)(:: \/ELSE ::)/g);

const formComponentGenReqTemplate: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/form-component-genreq.template.html").toString();

const formComponentComponent: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/form-component.component.ts").toString();
const regexInputs = new RegexContainer(/(::INPUTS::)([\s\S]*)(::\/INPUTS::)/g);
const regexInputsDefaultValue = new RegexContainer(/(::DEFAULT_VALUES::)([\s\S]*)(::\/DEFAULT_VALUES::)/g);

const formComponentGenReqComponent: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/form-component-genreq.component.ts").toString();

const tmplAppRoutingModule: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/app-routing.module.ts").toString();
const tmplAppComponent: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/app.component.ts").toString();
const tmplAppModule: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/app.module.ts").toString();
const regexNgComponentsImports = new RegexContainer(/(::NGCOMPONENTS_IMPORTS::)([\s\S]*)(::\/NGCOMPONENTS_IMPORTS::)/g);
const regexMainNgComponentsRoutes = new RegexContainer(/(::MAIN_NGCOMPONENTS_ROUTES::)([\s\S]*)(::\/MAIN_NGCOMPONENTS_ROUTES::)/g);
const regexMainNgComponentChildren = new RegexContainer(/(::MAIN_NGCOMPONENT_CHILDREN::)([\s\S]*)(::\/MAIN_NGCOMPONENT_CHILDREN::)/g);
const regexNgComponentsDeclaration = new RegexContainer(/(::NGCOMPONENTS_DECLARATION::)([\s\S]*)(::\/NGCOMPONENTS_DECLARATION::)/g);

const tmplGeneratorIndexComponent: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/generator-index.component.ts").toString();
const regexMainNgComponentsLinks = new RegexContainer(/(::MAIN_NG_COMPONENTS_LINKS::)([\s\S]*)(::\/MAIN_NG_COMPONENTS_LINKS::)/g);

class NgBaseComponentBuilder {

	private xmlContents: string;
	private xpath: XpathProcessorUtil;
	private genReqFileFormGenerated: boolean = false;
	private genReqFileFormImported: boolean = false;
	private genReqFileFormDeclared: boolean = false;

	constructor() {
	}

	public main() {
		shelljs.rm("-R", abGeneratedFolder);
		shelljs.rm("-R", abGeneratorsFolder);
		shelljs.mkdir("-p", abGeneratorsFolder);
		shelljs.cp("-R", abBuildWorkspaceFolder + "config/abgenerators", appSrcFolder);
		let formConfigFileNames: string[] = shelljs.ls(abXmlConfigFolder);
		let generationForms: GenerationForm[] = new Array<GenerationForm>();
		formConfigFileNames.forEach(formConfigFileName => {
			if (formConfigFileName.indexOf(".xml") != -1) {
				this.xmlContents = fs.readFileSync(abXmlConfigFolder + "/" + formConfigFileName).toString();
				this.xpath = new XpathProcessorUtil(this.xmlContents);
				generationForms.push(this.processConfiguration());
			}
		});


		let appRoutingModule: string = this.renderAppRoutingModule(generationForms);
		let appComponent: string = this.renderAppComponent(generationForms);
		let appModule: string = this.renderAppModule(generationForms);

		fs.writeFileSync(appSrcFolder + "/app-routing.module.ts", appRoutingModule);
		fs.writeFileSync(appSrcFolder + "/app.component.ts", appComponent);
		fs.writeFileSync(appSrcFolder + "/app.module.ts", appModule);

		let generatorIndexComponent: string = this.renderGeneratorIndexComponent(generationForms);

		fs.writeFileSync(abGeneratedFolder + "/generator-index.component.ts", generatorIndexComponent);
	}

	public processConfiguration(): GenerationForm {
		if (this.validateXML() != null) {
			return;
		}
		let formsConfig: FormsConfig = this.processXML();

		let mainComponent: FormComponent = this.renderMainComponent(formsConfig);
		let formComponents: FormComponent[] = this.renderFormComponents(formsConfig);

		let mainComponentName: string = this.convertCamelCaseToDashed(mainComponent.$name);
		shelljs.mkdir("-p", abGeneratedFolder + mainComponentName);

		fs.writeFileSync(abGeneratedFolder + mainComponentName + "/" + mainComponentName + "-main.component.html", pretty(mainComponent.$ngTemplate));
		fs.writeFileSync(abGeneratedFolder + mainComponentName + "/" + mainComponentName + "-main.component.ts", mainComponent.$ngComponent);
		formComponents.forEach(formComponent => {
			if(formComponent.$isGenReqFileForm){
				if(!this.genReqFileFormGenerated){
					let formComponentName: string = this.convertCamelCaseToDashed(formComponent.$name);
					shelljs.mkdir(abGeneratedFolder + "common-gen/");
					fs.writeFileSync(abGeneratedFolder + "common-gen/" + formComponentName + ".component.html", pretty(formComponent.$ngTemplate));
					fs.writeFileSync(abGeneratedFolder + "common-gen/" + formComponentName + ".component.ts", formComponent.$ngComponent);
					this.genReqFileFormGenerated = true;
				}
			}else{
				let formComponentName: string = this.convertCamelCaseToDashed(formComponent.$name);
				fs.writeFileSync(abGeneratedFolder + mainComponentName + "/" + formComponentName + ".component.html", pretty(formComponent.$ngTemplate));
				fs.writeFileSync(abGeneratedFolder + mainComponentName + "/" + formComponentName + ".component.ts", formComponent.$ngComponent);
			}
		});

		let generationForm: GenerationForm = new GenerationForm();
		generationForm.$mainForm = mainComponent;
		generationForm.$forms = formComponents;

		return generationForm;
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
			current.replace("<!--component.path-->", this.convertCamelCaseToDashed(generationForm.$mainForm.$name));
			current.replace("<!--component.name-->", generationForm.$mainForm.$name);

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
		result.replace("<!--component.path-->", this.convertCamelCaseToDashed(mainComponent.$name));
		result.replace("<!--component.className-->", this.convertToClassName(mainComponent.$name));
		return result.toString();
	}

	private renderMainNgComponentChildren(formComponents: FormComponent[]): string {
		let tmpl: string = regexMainNgComponentChildren.search(tmplAppRoutingModule)[2];
		let result: StringContainer = new StringContainer();
		formComponents.forEach(formComponent => {
			let current: StringContainer = new StringContainer(tmpl);
			current.replace("<!--component.path-->", this.convertCamelCaseToDashed(formComponent.$name));
			current.replace("<!--component.className-->", this.convertToClassName(formComponent.$name));
			result.concat(current.toString());
		});
		return result.toString();
	}

	private renderNgComponentsImports(mainComponent: FormComponent, formComponents: FormComponent[], template: string): string {
		let tmpl: string = regexNgComponentsImports.search(template)[2];
		let result: StringContainer = new StringContainer();

		let current: StringContainer = new StringContainer(tmpl);
		current.replace("<!--component.className-->", this.convertToClassName(mainComponent.$name));
		current.replace("<!--folder.name-->", this.convertCamelCaseToDashed(mainComponent.$name));
		current.replace("<!--component.name-->", this.convertCamelCaseToDashed(mainComponent.$name).concat("-main"));
		result.concat(current);

		formComponents.forEach(formComponent => {
			if(formComponent.$isGenReqFileForm && this.genReqFileFormImported){
				return;
			}
			let current: StringContainer = new StringContainer(tmpl);
			current.replace("<!--component.className-->", this.convertToClassName(formComponent.$name));
			if(formComponent.$isGenReqFileForm){
				current.replace("<!--folder.name-->", "common-gen");
				this.genReqFileFormImported = true;
			}else{
				current.replace("<!--folder.name-->", this.convertCamelCaseToDashed(mainComponent.$name));
			}
			current.replace("<!--component.name-->", this.convertCamelCaseToDashed(formComponent.$name));
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
		current.replace("<!--component.className-->", this.convertToClassName(mainComponent.$name));
		result.concat(current);

		formComponents.forEach(formComponent => {
			if(formComponent.$isGenReqFileForm){
				if(this.genReqFileFormDeclared){
					return;
				}
				this.genReqFileFormDeclared = true;
			}
			let current: StringContainer = new StringContainer(tmpl);
			current.replace("<!--component.className-->", this.convertToClassName(formComponent.$name));
			result.concat(current);
		});

		return result.toString();
	}

	private validateXML(): any {
		let xsdContents: string = fs.readFileSync(abBuildWorkspaceFolder + "core-files/forms-config-schema.xsd").toString();
		let formsConfigSchema = xsdLib.parse(xsdContents);

		let validationErrors = formsConfigSchema.validate(this.xmlContents);
		if (validationErrors != null) {
			console.error(validationErrors.toString());
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

	private renderMainComponent(formsConfig: FormsConfig): FormComponent {
		let mainComponent: FormComponent = new FormComponent();
		mainComponent.$name = formsConfig.$metadata.$generatorKey;

		let ngTemplate: string = mainComponentTemplate;
		ngTemplate = replaceAll("<!--#TITLE#-->", formsConfig.$metadata.$title, ngTemplate);
		ngTemplate = replaceAll("<!--#DESCRIPTION#-->", formsConfig.$metadata.$description, ngTemplate);
		ngTemplate = ngTemplate.replace(regexFormListRadioTmpl.regex, this.renderFormListRadioButtons(formsConfig.$forms));
		ngTemplate = replaceAll("<!--#FORM_DISPLAY#-->", this.renderFormListNgSelectors(formsConfig.$forms), ngTemplate);

		let ngComponent: StringContainer = new StringContainer(mainComponentComponent);
		ngComponent.replaceAll("<!--(cC2dashed)form.name-->", this.convertCamelCaseToDashed(mainComponent.$name));
		ngComponent.replaceAll("<!--form.name-->", mainComponent.$name);
		ngComponent.replaceAll("<!--form.className-->", this.convertToClassName(mainComponent.$name));

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
				currentItem = replaceAll("<!--formLink-->", this.convertCamelCaseToDashed(form.$formId), currentItem);
				currentItem = replaceAll("<!--FORM_ID-->", form.$formId, currentItem);
				currentItem = replaceAll("<!--FORM_TITLE-->", form.$formTitle, currentItem);
			} else {
				currentItem = replaceAll("<!--formLink-->", this.convertCamelCaseToDashed("GenReqFileForm"), currentItem);
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
			ngTemplate.replaceAll("<!--form.formFunction-->", form.$formFunction);

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
			ngComponent.replaceAll("<!--meta.generatorComponent-->", meta.$generatorComponent);
			ngComponent.replaceAll("<!--form.formId-->", form.$formId);
			ngComponent.replaceAll("<!--form.className-->", this.convertToClassName(form.$formId));
			ngComponent.replaceAll("<!--form.formFunction-->", form.$formFunction);

			ngComponent.replaceAll("<!--(cC2dashed)form.formId-->", this.convertCamelCaseToDashed(form.$formId));

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
				currentStr.replace("<!--input.mapValueKey-->", input.$mapValueKey)
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
					currentStr.replace("<!--input.mapValueKey-->", input.$mapValueKey)
					let value: string = input.$commonDefaultValue;
					if (input.$type == "checkbox") {
						value = value == "1" || value == "true" ? "true" : "false";
					}
					currentStr.replace("<!--input.commonDefaultValue-->", value);

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
		input.$choiceOptions.forEach(option => {
			let optionTmpl: StringContainer = new StringContainer(regexInputChoiceOptionsTmpl.search(choiceStr.getString())[2]);
			optionsStr.concat(optionTmpl.replaceAll("<!--input.$choiceOptions.[]-->", option));
		});
		return optionsStr;
	}

	private convertCamelCaseToDashed(str: string): string {
		let firstPass: RegExp = new RegExp(/([a-z])([A-Z])/g);
		let secondPass: RegExp = new RegExp(/([A-Z])([A-Z])([a-z])/g);
		let result: StringContainer = new StringContainer(str);
		result.replace(firstPass, "$1-$2");
		result.replace(secondPass, "$1-$2$3");
		return result.toString().toLowerCase();
	}

	private convertToClassName(str: string): string {
		if (str.charAt(0) != str.charAt(0).toUpperCase()) {
			return str.charAt(0).toUpperCase().concat(str.slice(1, str.length));
		} else {
			return str;
		}
	}

}

var ngb = new NgBaseComponentBuilder();
ngb.main();