import { ChestLocation } from "../module/game/chest";
import { GameTextKey, GameConfig, GameFontFamily, ImageLocationAndSize } from "../module/game/gameConfig";
import { splitNamespace } from "@angular/core/src/view/util";

export function GetSizeByMS(minSize: number = 0.85, maxSize: number = 1, loopMs: number = 500): number {
    let now = GetFullMS();
    if (now > loopMs) {
        now = now % loopMs;
    }
    let persent = now / loopMs;
    return minSize + (maxSize - minSize) * persent;
}

export function GetMS() {
    return Math.floor(performance.now() % 1000);
}
export function GetFullMS() {
    return performance.now();
}

export function GetSpinAngle(startAngle: number = 0, MsPerSpin: number = 1000, frameRenderTime: number = 1000 / 60): number {
    let angle = startAngle + frameRenderTime / MsPerSpin * 2 * Math.PI;
    return angle;
}

export function CentralSpin(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, angle: number, renderFunction: any) {
    var centerX = x + width / 2;
    var centerY = y + height / 2;
    ctx.translate(centerX, centerY);
    ctx.rotate(angle);
    ctx.translate(-centerX, -centerY);
    renderFunction();
    ctx.restore();
}

export function CentralResizeLocation(location: ImageLocationAndSize, size: number = 1): ImageLocationAndSize {
    let flashx = 0;
    let flashy = 0;
    let itemWidth = location.Width * size;
    let itemHeight = location.Height * size;
    flashx = (location.Width - 3 - itemWidth) / 2;
    flashy = (location.Height - 3 - itemHeight) / 2;
    let resunt: ImageLocationAndSize = new ImageLocationAndSize(location.X + flashx, location.Y + flashy, itemWidth, itemHeight);
    return resunt;
}

export function GetChestLocation(input: number, numberPerRow: number = 3): ChestLocation {
    input = input + 1;
    let location = new ChestLocation();
    let x = 0;
    let y = 0;
    if (input <= numberPerRow) {
        x = input - 1;
    } else {
        x = input % numberPerRow === 0 ? 2 : input % numberPerRow - 1;
        y = Math.floor(input / numberPerRow);
        x === 2 ? y = y - 1 : y;
    }
    location.x = x;
    location.y = y;
    return location;
}

export function GetTextFont(key: GameTextKey, fontsize: number = -1): string {
    fontsize = fontsize == -1 ? GameConfig.GameFontSizeMap[key] : fontsize;
    let font = `${String(fontsize)}px ${GameFontFamily[GameConfig.GameFontFamilyMap[key]]}`;
    return font;
}
export function GameRendetText(
    input: string, key: GameTextKey, x: number, y: number, ctx: CanvasRenderingContext2D,
    customFontSize: number = -1
) {
    ctx.font = GetTextFont(key, customFontSize);
    ctx.fillStyle = GameConfig.GameFontColorMap[key];
    ctx.fillText(input, x, y);
    let borderColor = GameConfig.GameFontBorderColorMap[key];
    if (ctx.font != borderColor) {
        ctx.strokeStyle = borderColor;
        ctx.strokeText(input, x, y);
    }
    ctx.stroke();
}

export function GetSpinNumberArray(list: number[], startIndex: number, revert: boolean = true) {
    if (revert) {
        list.reverse();
    }
    return list.slice(list.length - startIndex - 1, list.length).concat(list.slice(0,list.length - startIndex - 1));
}
export function GetNumberInFullArc(
    currentAngle: number, spinList: number[]) {
    let oAngle = currentAngle;
    if (currentAngle < 0) {
        if (currentAngle < -2 * Math.PI) {
            currentAngle = currentAngle % (2 * Math.PI);
        }
        currentAngle = 2 * Math.PI + currentAngle;
    }
    if (currentAngle > 2 * Math.PI) {
        currentAngle = currentAngle % (2 * Math.PI);
    }

    let spinWIdth = Math.PI * 2 / spinList.length;
    let selectIndex = 0;
    if (currentAngle > spinWIdth / 2 && currentAngle < spinWIdth * (spinList.length - 1) + spinWIdth / 2) {
        let checkList: any[] = spinList.map((b, i) => { return { angle: b, index: i }; }).filter((b, i) => {
            if (i == 0) {
                return false;
            }
            let angle = i * spinWIdth;
            let minAngle = angle - spinWIdth / 2;
            let maxAngle = angle + spinWIdth / 2;
            return currentAngle >= minAngle && currentAngle < maxAngle;
        });
        selectIndex = checkList[0].index;
    }
    // console.log(`${oAngle} ${currentAngle} ${selectIndex} ${spinList[selectIndex] + 1}`);
    return spinList[selectIndex];
}

export function pointInCircle(x, y, cx, cy, radius) {
    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;
}

export function GetDomOffset(input: HTMLElement, key: string) {
    let offset = input[key];
    let object: any = input.offsetParent;
    while (object != null) {
        offset = offset + object[key];
        object = object.offsetParent;
    }
    return offset;
}