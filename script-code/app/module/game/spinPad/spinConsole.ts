import { GameAssets } from "../gameAsset";
import { ImageKey } from "../imageKey";
import { GameRendetText, GetMS, GetSizeByMS, CentralSpin, pointInCircle, GetSpinAngle, GetFullMS, CentralResizeLocation } from "../../../utility/gameUtility";
import { GameTextKey, ImageLocationAndSize, I2DPosition } from "../gameConfig";
import { isFunction } from "util";
import { GameStatus } from "../../status/gameStatus";
import { stat } from "fs";

export class SpinConsole {
    private ctx: CanvasRenderingContext2D;
    private status: GameStatus;

    public Label: SpinLabel;
    public Led: SpinLight;
    public Spin: SpinDial;
    public Button: SpinButton;
    public Flash: Spinflash;

    constructor(ctx: CanvasRenderingContext2D, status: GameStatus, labelText: string[], spinClickFunction) {
        this.ctx = ctx;
        this.status = status;
        this.Flash = new Spinflash(ctx, status);
        this.Label = new SpinLabel(ctx, labelText, status);
        this.Led = new SpinLight(ctx);
        this.Spin = new SpinDial(ctx, status);
        this.Button = new SpinButton(ctx, spinClickFunction, status);

    }

    Render() {
        this.Flash.Render();
        this.Button.Render();
        this.Label.Render();
        this.Led.Render();
        this.Spin.Render();

    }
    CheckClicked(position: I2DPosition) {
        this.Button.CheckClicked(position);
    }
}

export class SpinLabel {
    x: number = 575;
    y: number = 185;
    LabelBG: HTMLImageElement;
    LabelNormal: HTMLImageElement;
    LabelWin: HTMLImageElement;

    private labelText: string[];
    private status: GameStatus
    textStartX: number = this.x + 60;
    textStartY: number = this.y + 60;
    textSpace: number = 50;
    labelBgX: number = this.x + 20;
    labelBgErrorX: number = this.x + 22;
    labelBgErrorY: number = this.y + 3;
    private ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D, labelText: string[], status: GameStatus) {
        this.ctx = ctx;
        this.status = status;
        this.LabelBG = new Image();
        this.LabelBG.src = GameAssets.ImagePath[ImageKey.ScreenSafeMini];
        this.LabelNormal = new Image();
        this.LabelNormal.src = GameAssets.ImagePath[ImageKey.ScreenSafeBk];
        this.LabelWin = new Image();
        this.LabelWin.src = GameAssets.ImagePath[ImageKey.ScreenSafeWin];
        this.labelText = labelText;
    }
    Render() {
        if (this.status.GameWin == false) {
            for (let i = 0; i < this.labelText.length; i++) {
                GameRendetText(
                    this.labelText[i],
                    GameTextKey.ResultText,
                    this.textStartX + this.textSpace * i,
                    this.textStartY,
                    this.ctx);
            }
        } else {
            GameRendetText(
                "W I N",
                GameTextKey.ResultText,
                this.textStartX + this.textSpace * (2 / 3),
                this.textStartY,
                this.ctx);
        }
        if (this.status.GameOver && this.status.GameWin == false) {
            this.ctx.drawImage(this.LabelNormal, this.labelBgErrorX, this.labelBgErrorY);
        }
        if (this.status.GameWin) {
            this.ctx.drawImage(this.LabelWin, this.labelBgX, this.y);
        }
        this.ctx.drawImage(this.LabelBG, this.x, this.y);
    }
}

export class SpinLight {
    LedImage: HTMLImageElement;
    LedWidth: number = 118;
    LedHeight: number = 44;
    LeftX: number = 590;
    RightX: number = 765;
    Y: number = 275;
    private ctx: CanvasRenderingContext2D;
    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.LedImage = new Image();
        this.LedImage.src = GameAssets.ImagePath[ImageKey.LedsSafeDial];
    }

    Render() {
        this.RenderLed(this.LeftX, this.Y);
        this.RenderLed(this.RightX, this.Y);
    }
    RenderLed(x: number, y: number) {
        let index: number = Math.floor(GetSizeByMS(0, 2, 300));
        this.ctx.drawImage(this.LedImage, this.LedWidth * index, 0, this.LedWidth, this.LedHeight, x, y, this.LedWidth, this.LedHeight);
    }

}

export class SpinDial {
    Background: HTMLImageElement;
    BGX: number = 625;
    BGY: number = 290;
    BGWidth: number = 222;
    BGHeight: number = 243;

    DialWidth: number = 275;
    DialHeight: number = 275;
    DialLocation: ImageLocationAndSize = new ImageLocationAndSize(
        this.BGX, this.BGY + 22, 222, 222);

    MarkerWidth: number = 32;
    MarkerHeight: number = 67;
    MarkerLocation: ImageLocationAndSize = new ImageLocationAndSize(
        720, 275, 32 * (3 / 4), 67 * (3 / 4));

    Dial: HTMLImageElement;
    PointMarker: HTMLImageElement;
    private ctx: CanvasRenderingContext2D;
    private status: GameStatus;
    constructor(ctx: CanvasRenderingContext2D, status: GameStatus) {
        this.ctx = ctx;
        this.status = status;
        this.Background = new Image();
        this.Background.src = GameAssets.ImagePath[ImageKey.SupportSafeDial];
        this.Dial = new Image();
        this.Dial.src = GameAssets.ImagePath[ImageKey.SafeDialMiniGame];
        this.PointMarker = new Image();
        this.PointMarker.src = GameAssets.ImagePath[ImageKey.Marker];
    }
    Render() {
        this.ctx.save();
        let timeFromLastSpin = GetFullMS() - this.status.LastSpinFinish;
        let thisSpinType = this.status.GameWin ? SpinType.Green : SpinType.Normal;
        if (this.status.GameWin == false && this.status.LastSpinFinish > 0 && timeFromLastSpin < 1000) {
            let color = Math.round(GetSizeByMS(0, 1, 300));
            thisSpinType = SpinType[SpinType[color]];
        }
        if (thisSpinType != SpinType.Normal) {
            this.RenderMark(thisSpinType);
        }
        CentralSpin(this.ctx, this.DialLocation.X, this.DialLocation.Y, this.DialLocation.Width, this.DialLocation.Height,
            this.status.DialAngle, () => this.RenderSpin(thisSpinType));
        this.ctx.drawImage(this.Background, this.BGX, this.BGY, this.BGWidth, this.BGHeight);
    }

    RenderSpin(type: SpinType) {
        this.ctx.drawImage(this.Dial, this.DialWidth * type, 0, this.DialWidth, this.DialHeight, this.DialLocation.X, this.DialLocation.Y, this.DialLocation.Width, this.DialLocation.Height);
    }

    RenderMark(type: SpinType) {
        if (type == SpinType.Normal) {
            type = SpinType.Red;
        }
        let x = 0;
        if (type == SpinType.Green) {
            x = this.MarkerWidth * (type - 1) + 7;
        }
        this.ctx.drawImage(this.PointMarker, x, 0, this.MarkerWidth, this.MarkerHeight, this.MarkerLocation.X, this.MarkerLocation.Y, this.MarkerLocation.Width, this.MarkerLocation.Height);
    }

}

export class SpinButton {
    ButtonImage: HTMLImageElement;
    DialLocation: ImageLocationAndSize = new ImageLocationAndSize(
        700, 390, 72, 61);

    private ctx: CanvasRenderingContext2D;
    private spinClickFunction;
    private status: GameStatus;
    constructor(ctx: CanvasRenderingContext2D, spinClickFunction: any = null, status: GameStatus) {
        this.ctx = ctx;
        this.ButtonImage = new Image();
        this.status = status;
        this.ButtonImage.src = GameAssets.ImagePath[ImageKey.SpinTextSafe];
        this.spinClickFunction = () => spinClickFunction();
    }

    Render() {
        if (!(this.status.GameOver || this.status.IsSpin || GetMS() > 500)) {
            this.ctx.drawImage(this.ButtonImage, this.DialLocation.X, this.DialLocation.Y, this.DialLocation.Width, this.DialLocation.Height);
        }
    }

    CheckClicked(position: I2DPosition) {
        var clicked = pointInCircle(position.X, position.Y, 735, 425, 30);
        if (clicked == true && isFunction(this.spinClickFunction)) {
            this.spinClickFunction();
        }
    }
}

export class Spinflash {
    private ctx: CanvasRenderingContext2D;
    private status: GameStatus;
    Flash: HTMLImageElement;
    X: number = 722;
    Y: number = 410;
    R: number = 105;
    DefaultLength: number = 30;
    Size: number = 10;
    constructor(ctx: CanvasRenderingContext2D, status: GameStatus) {
        this.ctx = ctx;
        this.status = status;
        this.Flash = new Image();
        this.Flash.src = GameAssets.ImagePath[ImageKey.SparkSafe];

    }
    Render() {
        if (this.status.IsSpin || this.status.GameOver == true || this.status.GameWin == true) {
            return;
        }
        let circle = 2 * Math.PI * this.R;
        let flashNumber = 30;
        for (var i = 0; i < flashNumber; i++) {
            let angle = Math.random() * flashNumber / flashNumber * 2 * Math.PI;
            let x = this.X + this.R * Math.sin(angle);
            let y = this.Y + this.R * Math.cos(angle);
            let scale = this.DefaultLength;
            let rate = Math.random() * 5000;
            if (rate < 3000) {
                rate = 3000;
            }
            let mSize = GetSizeByMS(0.8, 3, rate);
            let location = CentralResizeLocation(
                new ImageLocationAndSize(x, y, 30, 30), mSize
            )
            this.ctx.drawImage(this.Flash, location.X, location.Y, location.Width, location.Width);
        }
    }
}


enum SpinType {
    Normal = 0,
    Red = 1,
    Green = 2,
}