import { ResponseMockSet } from "./config-mock";



export enum HttpType {
    Get = 1,
    Post = 2,
    Put = 3,
    Delete = 4,
    File = 5
}

export class ApiProperty {
    public Url: string = "";
    public UseMock: boolean = true;
    public ResponseMockModule: any = null;
    constructor(url: string, useMock: boolean, m: any) {
        this.Url = url;
        this.UseMock = useMock;
        this.ResponseMockModule = m;
    }
}
export enum ApiCall {
    GetMenu = 1,
}
export class Config {
    static BaseUrl: string = "/api";
    static ApiUrl: { [key: number]: ApiProperty } = {
        [ApiCall.GetMenu]: Config.setApi("/GetMenu", true, ResponseMockSet.Menu),
    }
    private static setApi(url: string, useMock: boolean, m: any) {
        return new ApiProperty(url, useMock, m);
    }
}