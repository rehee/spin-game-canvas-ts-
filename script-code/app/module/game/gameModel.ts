import { GameConfig, I2DPosition } from "./gameConfig";
import { GameAssets } from './gameAsset';
import { ImageKey } from './imageKey';
import { Z_DEFAULT_STRATEGY } from "zlib";
import { TreasureType } from "./treasureType";
import { Chest } from "./chest";
import { GetChestLocation, GetSpinAngle } from "../../utility/gameUtility";
import { SpinConsole } from "./spinPad/spinConsole";
import { GameStatus } from "../status/gameStatus";
import { MainLabel } from "./mainLabel";

export class GameModel {
    private ctx: CanvasRenderingContext2D;
    private config: GameConfig;
    Background: HTMLImageElement;
    Status: GameStatus;

    Chests: Chest[];
    Spin: SpinConsole;
    MainLabel: MainLabel;

    CheckClicked(position: I2DPosition) {
        this.Spin.CheckClicked(position);
    }

    SpinClickFunction() {
        this.Status.RandomSpinForce();
    }
    constructor(ctx: CanvasRenderingContext2D, config: GameConfig) {
        this.ctx = ctx;
        this.config = config;
        this.Background = new Image();
        var src = GameAssets.GetGameImageAssetPath(ImageKey.BackGround);
        this.Background.src = src;
        this.Status = new GameStatus();
        this.Status.GameDeposit = isNaN(config.deposit) ? 10 : config.deposit;
        this.Chests = [];
        this.CreateChest();
        this.MainLabel = new MainLabel(this.ctx, this.Status);
        this.Spin = new SpinConsole(ctx, this.Status, this.Status.LabelText, () => this.SpinClickFunction());
    }
    CreateChest() {
        let i: number = 0;
        do {
            let multi = this.Status.MultiRange[Math.floor(Math.random() * this.Status.MultiRange.length)];
            if (this.Status.ChestMulti.filter(b => b == multi).length >= this.Status.MaxSameMulti) {
                continue;
            }
            this.Status.ChestMulti.push(multi);
            this.Chests.push(
                new Chest(
                    i, GetChestLocation(i), multi, this.ctx, this.Status));
            i++;
        } while (i < 9)
    }
    DrawBackGround() {
        this.MainLabel.Render();
        this.Spin.Render();
        this.ctx.drawImage(this.Background, 0, 0, this.config.width, this.config.height);
    }
    DrawAllChest() {
        this.Chests.forEach((b, i) => {
            if (b.isOpen == false) {
                if (this.Status.BoxSelect.filter(c => c == i).length > 0) {
                    b.SetChestOpen(true);
                }
            }
            if (this.Status.GameOver) {
                if (b.isOpen == false) {
                    b.SetChestOpen(true, 0, true);
                }
            }
            if (this.Status.GameWin == true) {
                if (this.Status.WinBoxNumber.filter(c => c == i).length > 0) {
                    b.SetChestOpen(true);
                    b.glowTreasure = true;
                    b.isSpark = true;
                } else {
                    b.SetChestOpen(true, 0, true);
                }
            }
        });
        this.Chests.forEach(b => b.RenderChest());
    }
    StartGame() {
        this.Status.CalculatePerFrame();
        this.DrawAllChest();
        this.DrawBackGround();
    }
}

export class Spiner {
    Background: HTMLImageElement;
    BackgroundSpiner: HTMLImageElement;

}




