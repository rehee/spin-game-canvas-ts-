import { GameAssets } from "./gameAsset";
import { CentralSpin, GetMS } from "../../utility/gameUtility";
import { ImageKey } from "./imageKey";

export class Spark {
    private ctx: CanvasRenderingContext2D;
    private x: number;
    private y: number;
    private angel: number;
    private image: HTMLImageElement;
    private speed: number = 2;
    lastTicket: number;
    StarSping = (x: number, y: number, width: number, height: number, angel: number, renderFunction: any): void => null;
    constructor(ctx: CanvasRenderingContext2D, x: number, y: number) {
        this.ctx = ctx;
        this.x = x + 20;
        this.y = y + 20;
        this.angel = Math.random() * (2 * Math.PI);

        this.lastTicket = 100;
        this.image = new Image();
        this.image.src = GameAssets.GetGameImageAssetPath(ImageKey.Star);
        this.StarSping = (x, y, width, height, angel, renderFunction) =>
            CentralSpin(ctx, x, y, width, height, angel, renderFunction);
    }
    RenderStar() {
        this.ctx.save();
        this.StarSping(this.x, this.y, 25, 25, 0.09 * GetMS(),
            () => this.ctx.drawImage(this.image, this.x, this.y, 25, 25)
        );
        this.x = this.x + this.speed * Math.cos(this.angel);
        this.y = this.y + this.speed * Math.sin(this.angel);
        this.lastTicket--;
    }
}