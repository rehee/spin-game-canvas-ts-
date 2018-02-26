import { GameStatus } from "../status/gameStatus";
import { stat } from "fs";
import { GameConfig, GameTextKey, GameFontFamily } from "./gameConfig";
import { GameRendetText, GetSizeByMS } from "../../utility/gameUtility";

export class MainLabel {
    private ctx: CanvasRenderingContext2D;
    private status: GameStatus;
    WelcomeMessage: string[] = ['Match a pair symbols for a safe busting multiplier!', ' TOUCH THE DIAL TO SPIN YOUR 4 DIGIT COMBINATION'];
    constructor(ctx: CanvasRenderingContext2D, status: GameStatus) {
        this.ctx = ctx;
        this.status = status;
    }
    Render() {
        if (this.status.GameWin) {
            let s = GetSizeByMS(0, 2, 500);
            if (s > 1) {
                return;
            }
            GameRendetText(`YOU WIN £${this.status.GetReward().toFixed(2)}`, GameTextKey.MainTextCenter, 50, 70, this.ctx);
            return;
        }
        if (this.status.IsSpin) {
            GameRendetText('SPINNING!!', GameTextKey.MainTextCenter, 50, 70, this.ctx)
            return;
        }
        if (this.status.BoxSelect.length == 0) {
            this.WelcomeMessage.forEach((b, i) =>
                GameRendetText(b, GameTextKey.MainText, 50, 50 + 50 * i, this.ctx)
            )
            return;
        }
        GameRendetText(`SAFE ${this.status.BoxSelect[this.status.BoxSelect.length - 1] + 1}`, GameTextKey.MainTextCenter, 50, 70, this.ctx);


    }
}