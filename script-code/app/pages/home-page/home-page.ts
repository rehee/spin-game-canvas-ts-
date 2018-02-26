import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GameModel } from '../../module/game/gameModel';
import { GameConfig, I2DPosition } from '../../module/game/gameConfig';

var image = require('../../../assets/img/game/coins.png');

@Component({
    selector: 'home-page',
    templateUrl: 'home-page.html'
})
export class HomePage implements OnInit {
    constructor() { }
    date: any;

    @ViewChild('myCanvas') canvasRef: ElementRef;
    SpinClick(event: MouseEvent) {
        let x = event.offsetX;
        let y = event.offsetY;
        let mouseClickPosition: I2DPosition = new I2DPosition(x, y);
        this.game.CheckClicked(mouseClickPosition);
    }
    Draw() {

        var ctx = this.canvasRef.nativeElement.getContext('2d');
        ctx.globalCompositeOperation = 'destination-over';

        ctx.clearRect(0, 0, 916, 623); // clear canvas
        ctx.save(); // save ctx

        this.game.StartGame();
        
        requestAnimationFrame(() => this.Draw());
    };
    game: GameModel;
    config: GameConfig;
    async ngOnInit() {
        var ctx = this.canvasRef.nativeElement.getContext('2d');
        ctx.globalCompositeOperation = 'destination-over';
        this.config = new GameConfig();
        this.config.width = 916;
        this.config.height = 623;

        this.config.deposit = 10;
        
        this.game = new GameModel(ctx, this.config);
        this.Draw();
    }
}