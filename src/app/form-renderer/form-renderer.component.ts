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
  config: {};

  constructor(private router: Router, private route: ActivatedRoute, private artifacter: ArtifacterCoreService) {
    this.route.params.subscribe(params => {
      this.formId = params.id;
      console.log('id :' + this.formId);
      artifacter.getFormConfiguration(this.formId)
        .then((result) => {
          console.log(result);
          this.config = result;
        })
        .catch((error) => {
          throw new Error(error);
        });
    });
  }

  public showme(){
    console.log(JSON.stringify(this.config));
  }

  ngOnInit() {
  }

}
