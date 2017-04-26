import { InputGroup } from "./input-group";

export class Form {
	private isGenerationRequestFileForm: boolean;
	private formId: string;
	private formTitle: string;
	private formDescription: string;
	private formFunction: string;
	private inputGroupList: InputGroup[];


	public get $isGenerationRequestFileForm(): boolean {
		return this.isGenerationRequestFileForm;
	}

	public set $isGenerationRequestFileForm(value: boolean) {
		this.isGenerationRequestFileForm = value;
	}

	public get $formId(): string {
		return this.formId;
	}

	public set $formId(value: string) {
		this.formId = value;
	}

	public get $formTitle(): string {
		return this.formTitle;
	}

	public set $formTitle(value: string) {
		this.formTitle = value;
	}

	public get $formDescription(): string {
		return this.formDescription;
	}

	public set $formDescription(value: string) {
		this.formDescription = value;
	}

	public get $formFunction(): string {
		return this.formFunction;
	}

	public set $formFunction(value: string) {
		this.formFunction = value;
	}

	public get $inputGroupList(): InputGroup[] {
		return this.inputGroupList;
	}

	public set $inputGroupList(value: InputGroup[]) {
		this.inputGroupList = value;
	}
	

}