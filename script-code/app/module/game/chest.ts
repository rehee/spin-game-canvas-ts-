import { Spark } from "./spark";
import { Treasure } from "./treasure";
import { GameAssets } from "./gameAsset";
import { ImageKey } from "./imageKey";
import { GameConfig, GameTextKey, I2DPosition, ImageLocationAndSize } from "./gameConfig";
import { GameRendetText, CentralResizeLocation, GetSizeByMS } from "../../utility/gameUtility";
import { getAllLifecycleHooks } from "@angular/compiler/src/lifecycle_reflector";

export class Chest {
    private index: number;
    private ChestBg: { [key: number]: any };
    private ctx: CanvasRenderingContext2D;
    private openFlashTicks = 0;

    isOpen: boolean = false;
    isSpark: boolean = false;
    noTreasure: boolean = false;
    glowTreasure: boolean = false;

    ChestClose: HTMLImageElement;
    ChestOpen: HTMLImageElement
    ChestNumber: number;
    Item: Treasure;
    ThisChestLocation: ChestLocation;
    Widht: number = 120;
    Height: number = 120;
    x: number;
    y: number;
    MultipleTime: number;
    spark: Spark[] = [];

    closeFontPosition: I2DPosition;
    treasureLocation: ImageLocationAndSize;
    treasureWidth: number = this.Widht - 3;
    treasureHeight: number = this.Height - 20;
    static GetCloseFontPosition(x, y, width, height): I2DPosition {
        return new I2DPosition(
            x + width / 2 - 4,
            y + height / 2 + 14
        );
    }

    constructor(index: number, location: ChestLocation, multiple: number, ctx: CanvasRenderingContext2D) {
        this.index = index;
        this.ThisChestLocation = location;
        this.ctx = ctx;
        this.ChestClose = new Image();
        this.ChestClose.src = GameAssets.GetGameImageAssetPath(ImageKey.SafeMini);
        this.Item = new Treasure(multiple, ctx);
        this.ChestOpen = new Image();
        this.ChestOpen.src = GameAssets.GetGameImageAssetPath(ImageKey.SafeOpenMini);
        this.ChestBg = {
            [Number(true)]: this.ChestOpen,
            [Number(false)]: this.ChestClose,
        };
        this.x = 50 + (this.Widht + 30) * this.ThisChestLocation.x;
        this.y = 180 + (this.Height + 20) * this.ThisChestLocation.y;
        this.MultipleTime = multiple;
        this.closeFontPosition = Chest.GetCloseFontPosition(this.x, this.y, this.Widht, this.Height);
        this.treasureLocation = new ImageLocationAndSize(
            this.x + 21, this.y + 15, this.treasureWidth, this.treasureHeight
        );
    }
    SetChestOpen(isOpen: boolean, flashTicket: number = 45, noTreasure: boolean = false) {
        this.isOpen = isOpen;
        this.noTreasure = noTreasure;
        this.openFlashTicks = flashTicket;
    }

    RenderChest() {
        this.spark.forEach(b => b.RenderStar());
        this.spark = this.spark.filter(b => b.lastTicket > 0);
        if (this.isOpen === false) {
            GameRendetText(
                String(this.index + 1),
                GameTextKey.ChestCloseText,
                this.closeFontPosition.X,
                this.closeFontPosition.Y,
                this.ctx);
        } else {
            GameRendetText(
                `X${String(this.MultipleTime)}`,
                GameTextKey.ChestOpenText,
                this.x + this.Widht / 2 - 4,
                this.y + this.Height / 2 + 14,
                this.ctx);

            if (this.noTreasure == false) {
                let position: ImageLocationAndSize = this.treasureLocation;
                let maxScale = 1;
                let minScale = 0.8
                if (this.glowTreasure) {
                    maxScale = 1.2;
                    minScale = 0.9;
                }
                if (this.openFlashTicks > 0) {
                    position = CentralResizeLocation(this.treasureLocation, GetSizeByMS(minScale, maxScale, 350))
                    this.openFlashTicks--;
                }
                if (this.glowTreasure) {
                    this.Item.RenderGlowImage(position.X, position.Y, position.Width, position.Height);
                } else {
                    this.Item.RenderNormalImage(position.X, position.Y, position.Width, position.Height);
                }



            }
        }

        this.ctx.drawImage(this.ChestBg[Number(this.isOpen)], this.x, this.y, this.Widht, this.Height);
        if (this.isSpark) {
            this.spark.push(new Spark(this.ctx, this.x + this.Widht / 2, this.y + +this.Height / 2));
        }
    }
}

export class ChestLocation {
    x: number
    y: number
}