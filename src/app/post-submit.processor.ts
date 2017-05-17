import { StringOperation } from "./string-operation";

export class PostSubmitProcessor{

    private value: string;
    private stringOperations: StringOperation[];

    constructor(value: string, postSubmit: any[]){
        this.value = value;
        this.stringOperations = new Array<StringOperation>();
        postSubmit.forEach(elem => {
            let stringOperation: StringOperation = new StringOperation(elem.stringOperation);
            this.stringOperations.push(stringOperation);
        });
    }

    public run(): string{
        let result: string = this.value;
        this.stringOperations.forEach(stringOperation => {
            result = stringOperation.run(result);
        });
        return result;
    }
}