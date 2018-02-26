import { TreasureType } from "./treasureType";
import { GameAssets } from "./gameAsset";

export class Treasure {
    private ctx: CanvasRenderingContext2D
    ThisType: TreasureType;
    BonusMultiply: number;
    Image: HTMLImageElement;
    constructor(multi: number, ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.ThisType = GameAssets.GetTreasureByMultiple(multi);
        this.Image = new Image();
        this.Image.src = GameAssets.GetTreasureImageAssetPath(this.ThisType);
    }
    RenderNormalImage(x: number, y: number, dx: number, dy: number) {
        this.ctx.drawImage(this.Image, 25, 15, 170, 140, x, y, dx, dy);
    }
    RenderGlowImage(x: number, y: number, dx: number, dy: number) {
        this.ctx.drawImage(this.Image, 225, 15, 170, 140, x, y, dx, dy);
    }

}