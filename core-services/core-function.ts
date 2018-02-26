import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import { HttpType, Config, ApiProperty, ApiCall } from '../config/config';


export class CoreFunction {

    static Delay(ms: number) {
        return new Promise(
            resolve => setTimeout(resolve, ms)
        )
    }
    static CreateApiCall(http: Http) {
        let httpRequestFunction = async () => {
            return await CoreFunction.GetHttpResponseAsync(http);
        }
        let apiCall = async <T>(httpType: HttpType, url: number, data: any = null, aditionalUrl: string = null, files: FileContain[] = []): Promise<T> => {
            return await (await httpRequestFunction())<T>(httpType, url, data, aditionalUrl, files);
        }
        return apiCall;
    }
    static GetHttpResponseAsync(http: Http, getOption: any = CoreFunction.GetHttpOption, getObserver: any = CoreFunction.GetHttpObserveAsync, getPromise: any = CoreFunction.GetHttpPromise, generalUrl: any = CoreFunction.generalUrl(Config.BaseUrl)) {
        let observer = getObserver(http, getOption());
        return <T>(httpType: HttpType, url: number, data: any = null, additionalUrl = "", files: FileContain[] = []) => {
            let apiProperty: ApiProperty = Config.ApiUrl[url]
            if (typeof (apiProperty) == 'undefined' || apiProperty == null) {
                return new Promise<T>((resolve, reject) => {
                    resolve(null);
                });
            }
            if (apiProperty.UseMock) {
                return new Promise<T>((resolve, reject) => {
                    resolve(apiProperty.ResponseMockModule);
                });
            }
            return getPromise(observer(httpType, generalUrl(apiProperty.Url, additionalUrl), data, files));
        };
    }
    static GetHttpPromise<T>(observe: Observable<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            observe.subscribe(
                response => {
                    resolve(response)
                },
                error => resolve(null)
            )
        });
    }

    static GetHttpObserveAsync(http: Http, option: any, error: any = CoreFunction.error) {
        return <T>(httpType: HttpType, url: string = "", data: any, files: FileContain[] = []) => {
            let observable: Observable<Response>;
            switch (httpType) {
                case HttpType.Get:
                    observable = http.get(
                        url, option
                    )
                    break;
                case HttpType.Post:
                    observable = http.post(
                        url, JSON.stringify(data), option
                    )
                    break;
                case HttpType.Put:
                    observable = http.put(
                        url, JSON.stringify(data), option
                    )
                    break;
                case HttpType.Delete:
                    observable = http.delete(
                        url, option
                    )
                    break;
                case HttpType.File:
                    let headers = new Headers();
                    let options = new RequestOptions({ headers: headers });
                    let formData: FormData = new FormData();
                    files.forEach(b => {
                        formData.append(b.FileName, b.File, b.File.name);
                    })
                    for (let key in data) {
                        if (!data.hasOwnProperty(key)) {
                            continue;
                        }
                        formData.append(String(key), String(data[key]));
                    }
                    observable = http.post(
                        url, formData, options
                    )
            }
            return observable.map((reponse: Response) => <T>reponse.json())
                .catch(error);
        };
    }
    static error(e: any) {
        Observable.throw(e.json().error || 'Server error')
    }
    static generalUrl(baseUrl: string) {
        return (url: string, additionalUrl: string) => {
            let additioinalUrlCheck = "";
            if (additionalUrl != null && typeof (additionalUrl) != 'undefined') {
                additioinalUrlCheck = additionalUrl;
            }
            if (url.indexOf('http') == 0) {
                return `${url}${additioinalUrlCheck}`;
            }
            return `${baseUrl}${url}${additioinalUrlCheck}`
        }
    }
    static GetHttpOption(): RequestOptions {
        let headers = new Headers({ "Content-Type": "application/json" })
        let options = new RequestOptions({ headers: headers });
        return options;
    }
    public static ConvertStringToNumner = function (input: any, def: number = 0): number {
        try {
            let result = Number(input);
            if (isNaN(result)) {
                return def;
            }
            return result;
        }
        catch (e) {
            return def;
        }
    }
}

export class FileContain {
    FileName: string;
    File: File;
    constructor(fileName: string, file: File) {
        this.FileName = fileName;
        this.File = file;
    }
}