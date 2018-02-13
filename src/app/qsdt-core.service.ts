import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { environment } from "./../environments/environment";

@Injectable()
export class QSDTCoreService {

  private baseEndpoint: string = environment.qsdtAPI;
  private endpointForms: string = this.baseEndpoint + "/forms";
  private endpointArtifacts: string = this.baseEndpoint + "/generatedArtifacts";

  constructor(private http: Http) { }

  /**
   * Retrieves a list of form configurations available on QSDT
   */
  public getFormConfigurations(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      let respObs: Observable<Response> = this.http.get(this.endpointForms);
      respObs.subscribe((response) => {
        resolve(response.json());
      }, (error) => {
        reject(error);
      });
    })
  }

  /**
   * Retrieves the Form Configuration for UI rendering
   * @param formId Form Configuration ID
   */
  public getFormConfiguration(formId: string): Promise<{}> {
    return new Promise((resolve, reject) => {
      let respObs: Observable<Response> = this.http.get(this.endpointForms + "/" + formId);
      respObs.subscribe((response) => {
        resolve(response.json());
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * Requests an Artifact Generation to QSDT using a Request object
   * based on the Form Configuration
   * @param request Request object based on Form Configuration
   */
  public requestArtifactGeneration(request: {}): Promise<string> {
    return new Promise((resolve, reject) => {
      let respObs: Observable<Response> = this.http.post(this.endpointArtifacts, request);
      respObs.subscribe((response) => {
        resolve(response.headers.get("Location"));
      }, (error) => {
        reject(error);
      })
    })
  }

  /**
   * Triggers the download of the generated artifact by using an appended
   * IFRAME element to the document.
   * @param location Location of the generated artifact
   */
  public triggerArtifactDownload(location: string) {
    if (document.getElementById("downloaderFrame") == null) {
      let iframe: HTMLIFrameElement = document.createElement("iframe");
      iframe.name = "downloader";
      iframe.id = "downloaderFrame";
      iframe.style.display = "none";
      document.body.appendChild(iframe);
    }
    if(environment.safeDownload){
      let downloader = document.getElementById("downloader");
      downloader.className = "app-blocker-loading";
      let anchor: any = document.getElementById("downloaderLink");
      anchor.href = this.baseEndpoint + location + "/generatedArtifacts.zip";
    }else{
      window.open(this.baseEndpoint + location + "/generatedArtifacts.zip", "downloader");
    }
    let blocker = document.getElementById("loadingBlocker");
    blocker.className = "app-blocker-loading hidden";
    
  }

}
