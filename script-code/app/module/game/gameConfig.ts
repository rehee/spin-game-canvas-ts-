export class I2DPosition {
    X: number;
    Y: number;
    constructor(x: number, y: number) {
        this.X = x;
        this.Y = y;
    }
}



export class ImageLocationAndSize {
    X: number;
    Y: number;
    Width: number;
    Height: number;
    constructor(x: number, y: number, width: number, height: number) {
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
    }
}

export enum GameFontFamily {
    DimboItalic,
    TitanOneRegular
}

export enum GameTextKey {
    ChestCloseText,
    ChestOpenText,
    MainHeader,
    MainText,
    ResultText,
    MainTextCenter,
}
export class GameConfig {
    width: number;
    height: number;
    deposit: number;

    static GameFontFamilyMap: { [key: number]: GameFontFamily } = {
        [GameTextKey.ChestCloseText]: GameFontFamily.TitanOneRegular,
        [GameTextKey.ChestOpenText]: GameFontFamily.TitanOneRegular,
        [GameTextKey.MainHeader]: GameFontFamily.TitanOneRegular,
        [GameTextKey.MainText]: GameFontFamily.TitanOneRegular,
        [GameTextKey.ResultText]: GameFontFamily.TitanOneRegular,
        [GameTextKey.MainTextCenter]: GameFontFamily.DimboItalic,
    }
    static GameFontSizeMap: { [key: number]: number } = {
        [GameTextKey.ChestCloseText]: 30,
        [GameTextKey.ChestOpenText]: 30,
        [GameTextKey.MainHeader]: 30,
        [GameTextKey.MainText]: 30,
        [GameTextKey.ResultText]: 47,
        [GameTextKey.MainTextCenter]: 60,
    }
    static GameFontColorMap: { [key: number]: string } = {
        [GameTextKey.ChestCloseText]: '#fff',
        [GameTextKey.ChestOpenText]: '#fff',
        [GameTextKey.MainHeader]: '#fff',
        [GameTextKey.MainText]: '#fff',
        [GameTextKey.ResultText]: '#fff',
        [GameTextKey.MainTextCenter]: '#000'
    }
    static GameFontBorderColorMap: { [key: number]: string } = {
        [GameTextKey.ChestCloseText]: '#000',
        [GameTextKey.ChestOpenText]: '#000',
        [GameTextKey.MainHeader]: '#000',
        [GameTextKey.MainText]: '#000',
        [GameTextKey.ResultText]: '#000',
        [GameTextKey.MainTextCenter]: '#000'
    }
}


