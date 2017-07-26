import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { ArtifacterCoreService } from "./../artifacter-core.service";

@Component({
  selector: 'app-form-renderer',
  templateUrl: './form-renderer.component.html',
  styleUrls: ['./form-renderer.component.css']
})
export class FormRendererComponent implements OnInit {

  formId: string;
  selectedForm: string;
  config: any;

  constructor(private router: Router, private route: ActivatedRoute, private artifacter: ArtifacterCoreService) {
    this.route.params.subscribe(params => {
      this.formId = params.id;
      artifacter.getFormConfiguration(this.formId)
        .then((result) => {
          this.config = result;
          this.selectedForm = this.config.$forms[0].$requestSchema.$task;
        })
        .catch((error) => {
          throw new Error(error);
        });
    });
  }

  public submitForm(event, task: string){
    console.log(JSON.stringify(this.config));
  }

  ngOnInit() {
  }

}
