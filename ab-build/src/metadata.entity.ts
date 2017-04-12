export class Metadata{
	private generatorKey: string;
	private generatorComponent: string;
	private title: string;
	private description: string;

	public get $generatorKey(): string {
		return this.generatorKey;
	}

	public set $generatorKey(value: string) {
		this.generatorKey = value;
	}

	public get $generatorComponent(): string {
		return this.generatorComponent;
	}

	public set $generatorComponent(value: string) {
		this.generatorComponent = value;
	}

	public get $title(): string {
		return this.title;
	}

	public set $title(value: string) {
		this.title = value;
	}

	public get $description(): string {
		return this.description;
	}

	public set $description(value: string) {
		this.description = value;
	}
	
	
}