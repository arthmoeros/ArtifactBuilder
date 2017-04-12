export class Input{
	private type: string;

	private mapLabel: string;
	private mapValueKey: string;

	private commonDefaultValue: string;
	private commonHelptext: string;
	private commonBlocked: boolean;
	private commonRequired: boolean;
	private commonPostSubmit: string[];

	private boxPlaceholder: string;

	private choiceOptions: string[];


	public get $mapLabel(): string {
		return this.mapLabel;
	}

	public set $mapLabel(value: string) {
		this.mapLabel = value;
	}

	public get $mapValueKey(): string {
		return this.mapValueKey;
	}

	public set $mapValueKey(value: string) {
		this.mapValueKey = value;
	}

	public get $commonDefaultValue(): string {
		return this.commonDefaultValue;
	}

	public set $commonDefaultValue(value: string) {
		this.commonDefaultValue = value;
	}

	public get $commonHelptext(): string {
		return this.commonHelptext;
	}

	public set $commonHelptext(value: string) {
		this.commonHelptext = value;
	}

	public get $commonBlocked(): boolean {
		return this.commonBlocked;
	}

	public set $commonBlocked(value: boolean) {
		this.commonBlocked = value;
	}

	public get $commonRequired(): boolean {
		return this.commonRequired;
	}

	public set $commonRequired(value: boolean) {
		this.commonRequired = value;
	}

	public get $commonPostSubmit(): string[] {
		return this.commonPostSubmit;
	}

	public set $commonPostSubmit(value: string[]) {
		this.commonPostSubmit = value;
	}
	

	public get $boxPlaceholder(): string {
		return this.boxPlaceholder;
	}

	public set $boxPlaceholder(value: string) {
		this.boxPlaceholder = value;
	}

	public get $choiceOptions(): string[] {
		return this.choiceOptions;
	}

	public set $choiceOptions(value: string[]) {
		this.choiceOptions = value;
	}

	public get $type(): string {
		return this.type;
	}

	public set $type(value: string) {
		this.type = value;
	}
	
}