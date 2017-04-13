export class Logger {

	public log(obj) {
		if(obj.toString){
		console.log(obj.toString());
		}
	}
}