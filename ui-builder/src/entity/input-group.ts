import { Input } from "./input";

export class InputGroup{
	private groupTitle: string;
	private inputList: Input[];

	public get $groupTitle(): string {
		return this.groupTitle;
	}

	public set $groupTitle(value: string) {
		this.groupTitle = value;
	}

	public get $inputList(): Input[] {
		return this.inputList;
	}

	public set $inputList(value: Input[]) {
		this.inputList = value;
	}
}