import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions, ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";

import { AppComponent } from "./app.component";
const fileSaver = require("file-saver");

import { PostSubmitProcessor } from "./post-submit.processor";

@Injectable()
export class WorkerServiceConsumer {

    private static readonly config: any = {
        artifactGenerationRequest: {
            devEndpoint: "http://localhost:8080/artifactGenerationRequest",
            endpoint: "https://artifacter-worker.herokuapp.com/artifactGenerationRequest"
        }
    }

    constructor(private http: Http) {
    }

    public invoke(generator: string, formFunction: string, map: any, postSubmitProcess: any) {
        map = JSON.parse(JSON.stringify(map));
        for (var key in postSubmitProcess) {
            let value: string = map[key];
            let postSubmit: any[] = postSubmitProcess[key];
            map[key] = new PostSubmitProcessor(value, postSubmit).run();
        }
        let jsonRequest: any = {};
        jsonRequest.generator = generator;
        jsonRequest.formFunction = formFunction;
        jsonRequest.map = map;

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob });
        let endpoint = "";
        if(AppComponent.environment == "DEPLOYED"){
            endpoint = WorkerServiceConsumer.config.artifactGenerationRequest.endpoint;
        }else{
            endpoint = WorkerServiceConsumer.config.artifactGenerationRequest.devEndpoint;
        }
        let obs: Observable<Response> = this.http.post(endpoint, JSON.stringify(jsonRequest), options);
        obs.subscribe((response) => {
            fileSaver(response.blob(), "result.zip");
        });
    }

}