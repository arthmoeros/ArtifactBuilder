import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AppComponent } from "./app.component";
const fileSaver = require("file-saver");
var deployed;

import { PostSubmitProcessor } from "./post-submit.processor";

@Injectable()
export class WorkerServiceConsumer {

    private static readonly config: any = {
        artifactGenerationRequest: {
            devEndpoint: "http://localhost:8080/artifactGenerationRequest",
            endpoint: "https://artifacter-worker.herokuapp.com/artifactGenerationRequest"
        },
        generatedArtifacts: {
            devEndpoint: "http://localhost:8080/generatedArtifacts",
            endpoint: "https://artifacter-worker.herokuapp.com/generatedArtifacts"
        }
    }

    constructor(private http: Http) {
    }

    public invoke(generator: string, formFunction: string, map: any, postSubmitProcess: any) {
        document.getElementById("loadingBlocker").className = "app-blocker-loading";
        map = JSON.parse(JSON.stringify(map));
        for (var key in postSubmitProcess) {
            let value: string = map[key];
            if(value != null){
                let postSubmit: any[] = postSubmitProcess[key];
                map[key] = new PostSubmitProcessor(value, postSubmit).run();
            }
        }
        let jsonRequest: any = {};
        jsonRequest.generator = generator;
        jsonRequest.formFunction = formFunction;
        jsonRequest.map = map;

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Json });
        let endpoint = "";
        if(deployed != null){
            endpoint = WorkerServiceConsumer.config.artifactGenerationRequest.endpoint;
        }else{
            endpoint = WorkerServiceConsumer.config.artifactGenerationRequest.devEndpoint;
        }
        let obs: Observable<Response> = this.http.post(endpoint, JSON.stringify(jsonRequest), options);
        obs.subscribe((response) => {
            let respUUID: string = response.json().artifactsUUID;
            
            let endpoint: string = "";
            if(deployed != null){
                endpoint = WorkerServiceConsumer.config.generatedArtifacts.endpoint;
            }else{
                endpoint = WorkerServiceConsumer.config.generatedArtifacts.devEndpoint;
            }
            endpoint = endpoint + "?uuid=" + respUUID;

            if(document.getElementById("downloaderFrame") == null){
                let iframe: HTMLIFrameElement = document.createElement("iframe");
                iframe.name = "downloader";
                iframe.id = "downloaderFrame";
                iframe.style.display = "none";
                document.body.appendChild(iframe);
            }

            window.open(endpoint, "downloader");
            //fileSaver(response.blob(), "result.zip");
            document.getElementById("loadingBlocker").className = "app-blocker-loading hidden";
        }, (error) => {
            alert("An error ocurred while retrieving the Worker response: "+error);
            document.getElementById("loadingBlocker").className = "app-blocker-loading hidden";
        });
    }

}