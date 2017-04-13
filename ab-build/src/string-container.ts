import replaceAll = require("replaceall");

export class StringContainer{
	private containedString: string;

	constructor(initial?: string){
		if(initial){
			this.containedString = initial;
		}else{
			this.containedString = "";
		}
	}

	public concat(str: string|StringContainer){
		if(str instanceof StringContainer){
			str = str.getString();
		}
		this.containedString = this.containedString.concat(str);
	}

	public replace(find: any, replace: string|StringContainer): StringContainer{
		if(replace instanceof StringContainer){
			replace = replace.getString();
		}
		if(find instanceof StringContainer){
			find = find.getString();
		}
		this.containedString = this.containedString.replace(find, replace);
		return this;
	}

	public replaceAll(find: string, replace: string): StringContainer{
		this.containedString = replaceAll(find,replace,this.containedString);
		return this;
	}

	public getString(): string{
		return this.containedString;
	}

	public toString(): string{
		return this.containedString;
	}
}