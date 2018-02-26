import { GetSpinAngle, GetNumberInFullArc, GetFullMS } from "../../utility/gameUtility";

export class GameStatus {
    MultiRange: number[] = [];
    LabelText: string[] = ['-', '-', '-', '-'];
    BoxSelect: number[] = [];
    MultiMin: number = 15;
    MultiMax: number = 20;
    MultiCount: number = 3;
    ChestMulti: number[] = [];
    GameOver: boolean = false;
    GameWin: boolean = false;
    WinBoxNumber: number[] = [];
    GameDeposit: number = 10;
    GameMulti: number = 0;
    MaxSpinForce = 100;
    ForceReducePerFrame = 0.5;
    ForwardForce: number = 0;
    BackForce: number = 0;

    BaseMsPerSpinMin = 1000;
    BaseMsPerSpinMax = 10000;
    IsSpin: boolean = false;
    LastSpinFinish: number = 0;
    DialAngle: number = 0;
    GetSpinSpeed(spinForce: number) {
        if (spinForce == 0) {
            return -1;
        }
        return this.BaseMsPerSpinMax - (this.BaseMsPerSpinMax - this.BaseMsPerSpinMin) * (spinForce / this.MaxSpinForce);
    }

    constructor() {
        do {
            let thisMulti = Math.floor(Math.random() * 19);
            if (this.MultiRange.filter(b => b == thisMulti).length > 0 || !(thisMulti >= this.MultiMin && thisMulti <= this.MultiMax)) {
                continue;
            }
            this.MultiRange.push(thisMulti);

        } while (this.MultiRange.length < this.MultiCount + 1);

        GetNumberInFullArc(this.DialAngle);
    }

    SelectBox(input: number) {
        if (this.GameOver) {
            return;
        }
        if (this.BoxSelect.length >= 4) {
            return;
        }
        if (this.BoxSelect.filter(b => b == input).length >= 1) {
            return;
        }
        this.BoxSelect.push(input);
        for (let i = 0; i < this.LabelText.length; i++) {
            this.LabelText[i] = i < this.BoxSelect.length ? String(this.BoxSelect[i] + 1) : "-";
        }
        this.GameWin = this.IsGameWin();
        if (this.GameWin) {
            this.GameOver = true;
            this.ForwardForce = 100;
            this.ForceReducePerFrame = 0;
        }
        if (this.BoxSelect.length >= 4) {
            this.GameOver = true;
        }
    }

    IsGameWin(): boolean {
        let list = this.BoxSelect.map(b => new ChestMultiMap(b, this.ChestMulti[b]));
        for (let i = 0; i < list.length; i++) {
            let sameMulti = list.filter(b => b.Multi == list[i].Multi);
            if (sameMulti.length > 1) {
                this.WinBoxNumber = sameMulti.map(b => b.ChestIndex);
                this.GameMulti = list[i].Multi * 2;
                return true;
            }
        }
        return false;
    }

    GetReward() {
        return this.GameDeposit * this.GameMulti;
    }

    RandomSpinForce() {
        if (this.BackForce > 0 || this.ForwardForce > 0 || this.GameOver) {
            return;
        }
        this.BackForce = Math.random() * this.MaxSpinForce;
        this.ForwardForce = Math.random() * this.MaxSpinForce;
        this.IsSpin = true;
    }

    DoSpin() {
        if (this.BackForce > 0) {
            let force = this.BackForce - this.ForceReducePerFrame;
            if (force > 0) {
                this.BackForce = force;
                this.DialAngle = GetSpinAngle(this.DialAngle, -this.GetSpinSpeed(this.BackForce));
            } else {
                this.BackForce = 0;
            }
            return;
        }
        if (this.ForwardForce > 0) {
            let force = this.ForwardForce - this.ForceReducePerFrame;
            if (force > 0) {
                this.ForwardForce = force;
                this.DialAngle = GetSpinAngle(this.DialAngle, this.GetSpinSpeed(this.ForwardForce));
            } else {
                this.ForwardForce = 0;
            }
            return;
        }
        if (this.IsSpin) {
            let index = GetNumberInFullArc(this.DialAngle);
            this.SelectBox(index);
            this.IsSpin = false;
            this.LastSpinFinish = GetFullMS();
        }

    }


}

export class ChestMultiMap {
    ChestIndex: number;
    Multi: number;
    constructor(index, multi) {
        this.ChestIndex = index;
        this.Multi = multi;
    }
}