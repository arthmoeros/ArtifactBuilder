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

	public concat(str: string){
		this.containedString = this.containedString.concat(str);
	}

	public replace(find: any, replace: string){
		this.containedString = this.containedString.replace(find, replace);
	}

	public replaceAll(find: any, replace: string){
		this.containedString = replaceAll(find,replace,this.containedString);
	}

	public getString(){
		return this.containedString;
	}
}