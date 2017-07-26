import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'input-renderer',
  templateUrl: './input-renderer.component.html',
  styleUrls: ['./input-renderer.component.css']
})
export class InputRendererComponent implements OnInit {

  @Input() input: any;
  @Input() inputName: string;
  @Input() inputHierarchy: string;
  @Input() form: any;
  @Input() parentArray: any[];
  @Input() elementIndex: number;

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

  ngOnInit() {
  }

}
