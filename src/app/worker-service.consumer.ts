import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions,ResponseContentType } from "@angular/http";
import { Observable } from "rxjs/Observable";
const fileSaver = require("file-saver");

import { PostSubmitProcessor } from "./post-submit.processor";

@Injectable()
export class WorkerServiceConsumer{

    constructor(private http: Http){
    }

    public invoke(generator: string, formFunction: string, map: any, postSubmitProcess: any){
        map = JSON.parse(JSON.stringify(map));
        for(var key in postSubmitProcess){
            let value: string = map[key];
            let postSubmit: any[] = postSubmitProcess[key];
            map[key] = new PostSubmitProcessor(value, postSubmit).run();
        }
        let jsonRequest: any = {};
        jsonRequest.generator = generator;
        jsonRequest.formFunction = formFunction;
        jsonRequest.map = map;

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers , responseType: ResponseContentType.Blob});
        let obs : Observable<Response> = this.http.post("http://localhost:8080/artifactGenerationRequest", JSON.stringify(jsonRequest), options);
        obs.subscribe((response) => {
            fileSaver(response.blob(), "result.zip");
        });
    }

}