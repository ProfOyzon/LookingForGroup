// Wilson Xia
import * as PIXI from 'pixi.js';
import { IsometricGrid } from './isometricGrid';
import { Decoration } from './decoration';
import { onDragStart } from './events';

export class World{
    constructor({rows, columns}){
        this.grid;
        this.gridSize = {rows, columns};
        this.decorations = [];
        this.container = new PIXI.Container();
    }

    setUpGrid = (app) => {
        this.grid = new IsometricGrid({ size: { x: this.gridSize.rows, y: this.gridSize.columns }, });
        this.grid.createTiles(this.container);
        // Center grid
        this.container.position.x = app.screen.width / 2;
        this.container.position.y = app.screen.height / 2;
        this.grid.update();
    }

    createDecorations = ({ count = 1, src = 'assets/images/isoTable.png', scale = 1 , size = {x:1,y:1}, anchor = 0.5}) => {
        // Will be removed with the slider to pull out the decorations
        for (let i = 0; i < count; i++) {
            let newDec = new Decoration(src, size);
            newDec.setUpEvents(onDragStart);
            newDec.sprite.scale.set(scale);
            newDec.sprite.anchor.set(anchor,1);
            this.decorations.push(newDec);
            this.container.addChild(newDec.sprite);
        }
    }

    bindExtents = (app) => {
        // Clamps the position of the world container so that the grid is always visible
        if(this.container.x < 0){
            this.container.x = 0;
        }
        else if( this.container.x > app.screen.width){
            this.container.x = app.screen.width;
        }
        if(this.container.y > app.screen.height){
            this.container.y = app.screen.height;
        }
        else if(this.container.y < 0){
            this.container.y = 0;
        }
    }
}