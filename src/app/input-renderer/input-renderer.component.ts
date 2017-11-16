import { Component, Input , DoCheck} from '@angular/core';

@Component({
  selector: 'input-renderer',
  templateUrl: './input-renderer.component.html',
  styleUrls: ['./input-renderer.component.css'],
})
export class InputRendererComponent implements DoCheck {
  
  @Input() input: any;
  @Input() inputName: string;
  @Input() inputHierarchy: string;
  @Input() form: any;
  @Input() parentArray: any[];
  @Input() elementIndex: number;
  @Input() parentConfig: any;
  @Input() selectedForm: string;

  constructor() { }

  public getLabel(form: any, inputHierarchy: any) {
    return form.$inputDisplayData[inputHierarchy].label;
  }

  public getHelptext(form: any, inputHierarchy: any) {
    return form.$inputDisplayData[inputHierarchy].helptext;
  }

  public getPlaceholder(form: any, inputHierarchy: any) {
    return form.$inputDisplayData[inputHierarchy].placeholder;
  }

  public addArrayItem(inputHierarchy: string, arrayName: string, arrayInput: any) {
    if (arrayInput['@items'] == null) {
      arrayInput['@items'] = [];
    }
    let item: any = JSON.parse(JSON.stringify(arrayInput['@item']));
    item.$index = arrayInput['@items'].length;
    arrayInput['@items'].push(item);
  }

  public removeArrayItem(parentArray: any[], index: number) {
    for (let i = 0; i < parentArray.length; i++) {
      if (parentArray[i].$index == index) {
        parentArray.splice(i, 1);
        return;
      }
    }
  }

  /**
   * Can be a bit resource devourer, make a note here to refactor this whole form validation mess
   * maybe using recursive template and merging both input-renderer and form-renderer
   * 
   * https://stackoverflow.com/questions/41109500/angular2-recursive-html-without-making-a-new-component
   */
  ngDoCheck(){
    let elements: HTMLCollectionOf<Element> = document.getElementsByClassName(`ng-invalid selected-form-${this.form.$requestSchema.$task}`);
    for(let i = 0; i < elements.length; i++){
      if(elements.item(i).nodeName == 'INPUT'){
        this.parentConfig.formValid = false;
        return;
      }
    }
    this.parentConfig.formValid = true;
  }

  ngOnInit() {
  }

}
