import { Component, OnInit, Input , forwardRef} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'input-renderer',
  templateUrl: './input-renderer.component.html',
  styleUrls: ['./input-renderer.component.css'],
  providers: [
    { 
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputRendererComponent),
      multi: true
    }
  ]
})
export class InputRendererComponent implements ControlValueAccessor {

  @Input() input: any;
  @Input() inputName: string;
  @Input() inputHierarchy: string;
  @Input() form: any;
  @Input() parentArray: any[];
  @Input() elementIndex: number;
  @Input() parentModel: any;
  innerValue: any;

  propagateChange = (_: any) => {};

  constructor() { }

  public writeValue(value){
    if(value !== undefined){
      this.innerValue = value;
    }
  }

  public registerOnChange(fn){
    this.propagateChange = fn;
  }

  registerOnTouched() {}

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
