import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { QSDTCoreService } from "./../qsdt-core.service";

@Component({
  selector: 'app-form-renderer',
  templateUrl: './form-renderer.component.html',
  styleUrls: ['./form-renderer.component.css']
})
export class FormRendererComponent {

  formValid: boolean;
  formId: string;
  selectedForm: string;
  config: any;

  constructor(private router: Router, private route: ActivatedRoute, private qsdt: QSDTCoreService) {
    this.formValid = false;
    this.route.params.subscribe(params => {
      this.formId = params.id;
      qsdt.getFormConfiguration(this.formId)
        .then((result) => {
          this.config = result;
          this.selectedForm = this.config.$forms[0].$requestSchema.$task;
          this.config.formValid = false;
          this.setupDefaultValues(this.config);
        })
        .catch((error) => {
          throw new Error(error);
        });
    });
  }

  private setupDefaultValues(node: any){
    if(node['@defaultValue'] != null){
      node['@value'] = node['@defaultValue'];
    }else{
      for(let key in node){
        if(typeof(node[key]) == 'object'){
          this.setupDefaultValues(node[key]);
        }
      }
    }
  }

  public submitForm(event, task: string) {
    let currentForm: any = null;
    for (let i = 0; i < this.config.$forms.length; i++) {
      currentForm = this.config.$forms[i];
      if (currentForm.$requestSchema.$task == task) {
        break;
      } else {
        currentForm = null;
      }
    }
    if (currentForm != null) {
      let requestCopy: any = JSON.parse(JSON.stringify(currentForm.$requestSchema));
      this.valuesSubmitter(requestCopy);
      let blocker = document.getElementById("loadingBlocker");
      blocker.className = "app-blocker-loading";
      let buttons: any = document.getElementsByClassName("q-form-submit-button");
      for(let i = 0; i < buttons.length; i++){
        buttons[i].blur();
      }
      this.qsdt.requestArtifactGeneration(requestCopy)
        .then((location) => {
          this.qsdt.triggerArtifactDownload(location);
        });
    }
  }

  private valuesSubmitter(schema: any): any {
    if (schema['$index'] != null) {
      delete schema['$index'];
    }
    for (let key in schema) {
      if (schema['@type'] == 'array') {
        let array: any[] = [];
        if (schema['@items'] == null) {
          return array;
        }
        for (let i = 0; i < schema['@items'].length; i++) {
          array.push(this.valuesSubmitter(schema['@items'][i]));
        }
        return array;
      } else if (key == '@type') {
        return schema['@value'] != null ? schema['@value'] : null;
      } else if (typeof (schema[key]) == 'object') {
        schema[key] = this.valuesSubmitter(schema[key]);
      }
    }
    return schema;
  }

}
