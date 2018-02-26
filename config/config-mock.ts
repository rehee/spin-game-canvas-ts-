import { HeaderMenu } from "../script-code/app/module/header/header-menu";
export function generalMenuMock() {
    let result: HeaderMenu[] = [
        new HeaderMenu('', 'home Page', 'Home'),
        new HeaderMenu('h2', 'home Page', 'Home')
    ];
    return result;
}
export class ResponseMockSet {
    static Menu: HeaderMenu[] = generalMenuMock();
}
