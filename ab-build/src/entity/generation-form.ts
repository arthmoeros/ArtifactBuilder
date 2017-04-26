import { FormComponent } from "./form-component";

export class GenerationForm{

	private mainForm: FormComponent;
	private forms: FormComponent[];


	public get $mainForm(): FormComponent {
		return this.mainForm;
	}

	public set $mainForm(value: FormComponent) {
		this.mainForm = value;
	}

	public get $forms(): FormComponent[] {
		return this.forms;
	}

	public set $forms(value: FormComponent[]) {
		this.forms = value;
	}
	
}