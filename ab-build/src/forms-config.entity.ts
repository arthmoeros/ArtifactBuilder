import { Form } from "./form.entity";
import { Metadata } from "./metadata.entity";

export class FormsConfig{
	private metadata:Metadata;
	private forms:Form[];
	
	public get $metadata(): Metadata {
		return this.metadata;
	}

	public set $metadata(value: Metadata) {
		this.metadata = value;
	}

	public get $forms(): Form[] {
		return this.forms;
	}

	public set $forms(value: Form[]) {
		this.forms = value;
	}
	
}