
import { ImageKey } from './imageKey';
import { TreasureType } from './treasureType';
export class GameAssets {
    static BasicImagePath = '../../../assets/img/game/';
    static GetGameImageAssetPath(key: number): any {
        return this.ImagePath[key];
    };
    static GetTreasureByMultiple(multiple: Number): TreasureType {
        switch (multiple) {
            case 15:
                return TreasureType.Coin;
            case 16:
                return TreasureType.Diamond;
            case 17:
                return TreasureType.Gold;
            case 18:
                return TreasureType.Note;
            case 19:
                return TreasureType.Ring;
            default:
                return TreasureType.Coin;
        }
    }
    static GetTreasureImageAssetPath(type: TreasureType): any {
        let key = 0;
        switch (type) {
            case TreasureType.Coin:
                key = Number(ImageKey.Coins);
                break;
            case TreasureType.Diamond:
                key = Number(ImageKey.Diamond);
                break;
            case TreasureType.Gold:
                key = Number(ImageKey.Gold);
                break;
            case TreasureType.Note:
                key = Number(ImageKey.Notes);
                break;
            case TreasureType.Ring:
                key = Number(ImageKey.Ring);
                break;
        }
        return this.ImagePath[key];
    };

    static ImagePath: { [key: number]: any } = {
        [ImageKey.BackGround]: require('../../../assets/img/game/background_safe_minigame.png'),
        [ImageKey.Coins]: require('../../../assets/img/game/coins.png'),
        [ImageKey.Diamond]: require('../../../assets/img/game/diamond.png'),
        [ImageKey.DisplayPanelBK]: require('../../../assets/img/game/display_panel_background.png'),
        [ImageKey.Gold]: require('../../../assets/img/game/gold.png'),
        [ImageKey.LedsSafeDial]: require('../../../assets/img/game/leds_safe_dial_minigame.png'),
        [ImageKey.Marker]: require('../../../assets/img/game/marker.png'),
        [ImageKey.Notes]: require('../../../assets/img/game/notes.png'),
        [ImageKey.Ring]: require('../../../assets/img/game/ring.png'),
        [ImageKey.SafeDialMiniGame]: require('../../../assets/img/game/safe_dial_minigame.png'),
        [ImageKey.SafeMini]: require('../../../assets/img/game/safe_minigame.png'),
        [ImageKey.SafeOpenMini]: require('../../../assets/img/game/safe_open_minigame.png'),
        [ImageKey.ScreenSafeBk]: require('../../../assets/img/game/screen_safe_background.png'),
        [ImageKey.ScreenSafeMini]: require('../../../assets/img/game/screen_safe_minigame.png'),
        [ImageKey.ScreenSafeWin]: require('../../../assets/img/game/screen_safe_win.png'),
        [ImageKey.SparkSafe]: require('../../../assets/img/game/spark_safe.png'),
        [ImageKey.StarGreen]: require('../../../assets/img/game/star_green.png'),
        [ImageKey.Star]: require('../../../assets/img/game/star.png'),
        [ImageKey.SupportSafeDial]: require('../../../assets/img/game/support_safe_dial_minigame.png'),
        [ImageKey.SpinTextSafe]: require('../../../assets/img/game/text_spin_safe_dial_minigame.png'),
    }

};