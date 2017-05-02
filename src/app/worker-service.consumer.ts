import { Injectable } from "@angular/core";
import { Http, Response, Headers, RequestOptions,ResponseContentType } from "@angular/http";
import "rxjs/add/operator/map";
import { Observable } from "rxjs/Observable";
const fileSaver = require("file-saver");

@Injectable()
export class WorkerServiceConsumer{

    constructor(private http: Http){
    }

    public invoke(generator: string, formFunction: string, map: any){
        let jsonRequest: any = {};
        jsonRequest.generator = generator;
        jsonRequest.formFunction = formFunction;
        jsonRequest.map = map;

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers , responseType: ResponseContentType.Blob});
        let obs : Observable<Response> = this.http.post("http://localhost:8080/requestArtifactGeneration", JSON.stringify(jsonRequest), options);
        obs.subscribe((response) => {
            fileSaver(response.blob(), "result.zip");
        });
    }

}