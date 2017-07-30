import { Component, OnInit } from '@angular/core';
import { ArtifacterCoreService } from "./../artifacter-core.service";

@Component({
  selector: 'app-generator-index',
  templateUrl: './generator-index.component.html',
  styleUrls: ['./generator-index.component.css']
})
export class GeneratorIndexComponent implements OnInit {

  private formsIndex: string[];

  constructor(private coreService: ArtifacterCoreService) {
    this.loadIndex();
  }

  public loadIndex() {
    this.coreService.getFormConfigurations()
      .then((result) => {
        this.formsIndex = result;
      }).catch((error) => {
        throw new Error(error);
      });
  }

  ngOnInit() {
  }

}
