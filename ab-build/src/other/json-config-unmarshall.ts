import * as fs from "fs";

import { Input } from "./../entity/input";
import { InputGroup } from "./../entity/input-group";
import { Metadata } from "./../entity/metadata";
import { Form } from "./../entity/form";
import { FormsConfig } from "./../entity/forms-config";

import { abBuildWorkspaceFolder, abXmlConfigFolder } from "./../constants";
export class JSONConfigUnmarshallUtil {

	private config: any;

	public unmarshall(xmlFileName: string): FormsConfig {
		this.config = JSON.parse(fs.readFileSync(abXmlConfigFolder + "/" + xmlFileName).toString()).abFormsConfig;

		if (this.validateJSON() != null) {
			return;
		}
		return this.processJSON();
	}


	private validateJSON(): any {
		// TODO: validate against a JSON Schema
		return null;
	}

	private processJSON(): FormsConfig {
		// TODO: omit this and use the JSON directly
		let formsConfig: FormsConfig = new FormsConfig();

		let metadata: Metadata = new Metadata();
		metadata.$generatorKey = this.config.metadata.generatorKey;
		metadata.$generatorComponent = this.config.metadata.generatorComponent;
		metadata.$title = this.config.metadata.title;
		metadata.$description = this.config.metadata.description;

		let formList: Form[] = new Array<Form>();
		this.config.form.forEach(formItem => {
			let form = new Form();
			form.$isGenerationRequestFileForm = formItem.generationRequestFileForm != null;
			if (!form.$isGenerationRequestFileForm) {
				form.$formId = formItem.formId;
				form.$formTitle = formItem.formTitle;
				form.$formDescription = formItem.formDescription;
				form.$formFunction = formItem.formFunction;

				let inputGroups: InputGroup[] = new Array<InputGroup>();
				formItem.formElements.inputGroup.forEach(inputGroupItem => {
					let inputGroup: InputGroup = new InputGroup();
					inputGroup.$groupTitle = inputGroupItem.groupTitle;
					inputGroup.$inputList = this.processInputs(inputGroupItem.inputs);
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

	private processInputs(inputs: any): Input[] {
		let inputList: Input[] = new Array<Input>();
		inputs.forEach(inputItem => {
			let input: Input = new Input();
			if (inputItem.text) {
				input.$type = "text";
				this.fillCommonInputInfo(input, inputItem.text);
				input.$boxPlaceholder = inputItem.text.placeholder;
			} else if (inputItem.number) {
				input.$type = "number";
				this.fillCommonInputInfo(input, inputItem.number);
				input.$boxPlaceholder = inputItem.number.placeholder;
			} else if (inputItem.checkbox) {
				input.$type = "checkbox";
				this.fillCommonInputInfo(input, inputItem.checkbox);
				// }else if(inputItem.file)
				// TODO: develop file upload
				// case "file":
				// 	input.$type = "file";
				// 	break;
				// }
			} else if (inputItem.choice) {
				input.$type = "choice";
				this.fillCommonInputInfo(input, inputItem.choice);
				input.$choiceOptions = new Array<string>();
				inputItem.choice.options.forEach(option => {
					input.$choiceOptions.push(option);
				});

			}
			inputList.push(input);

		});
		return inputList;
	}

	private fillCommonInputInfo(currentInput: Input, input: any) {
		currentInput.$mapLabel = input.label;
		currentInput.$mapValueKey = input.valueKey;
		currentInput.$commonDefaultValue = input.defaultValue;
		currentInput.$commonHelptext = input.helptext;
		currentInput.$commonBlocked = input.blocked != null;
		currentInput.$commonRequired = input.required != null;

		if (input.postSubmit) {
			currentInput.$commonPostSubmit = new Array<string>();
			input.postSubmit.forEach(op => {
				let postSubmitOp: string = op.stringOperation;
				currentInput.$commonPostSubmit.push(postSubmitOp);
			});
		}
	}

}