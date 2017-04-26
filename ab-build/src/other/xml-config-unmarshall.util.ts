import * as fs from "fs";
import * as xsdLib from "libxml-xsd";

import { Input } from "./../entity/input";
import { InputGroup } from "./../entity/input-group";
import { Metadata } from "./../entity/metadata";
import { Form } from "./../entity/form";
import { FormsConfig } from "./../entity/forms-config";
import { XPathProcessorUtil, ELEMENT_NODE } from "./xpath-processor.util";

import { abBuildWorkspaceFolder, abXmlConfigFolder } from "./../constants";
export class XmlConfigUnmarshallUtil {

	private xmlContents: string;
	private xpath: XPathProcessorUtil;

	public unmarshall(xmlFileName: string): FormsConfig {
		this.xmlContents = fs.readFileSync(abXmlConfigFolder + "/" + xmlFileName).toString();
		this.xpath = new XPathProcessorUtil(this.xmlContents);

		if (this.validateXML() != null) {
			return;
		}
		return this.processXML();
	}
	

	private validateXML(): any {
		let xsdContents: string = fs.readFileSync(abBuildWorkspaceFolder + "core-config-files/forms-config-schema.xsd").toString();
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

}