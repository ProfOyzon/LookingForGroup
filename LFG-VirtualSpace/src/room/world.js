// Wilson Xia
import * as PIXI from 'pixi.js';
import { IsometricGrid } from './isometricGrid';
import { IsometricWall } from './isometricWall';
import { Decoration } from './decoration';
import { onDragStart } from './events';

export class World{
    // Acts as a world sized container, holding all the components for the room, such as the grids and the decorations.
    // Allows for panning and zooming
    constructor({rows, columns}){
        this.container = new PIXI.Container();
        this.gridSize = {rows, columns};
        this.grid;
        this.leftWall;
        this.rightWall;
        this.selectedGrid;
        this.decorations = [];
    }

    setUpGrid = (app) => {
        // TODO: SEPARATE ROOM TEXTURES
        // Create a room texture
        let sprite = PIXI.Sprite.from('westernRoom');
        sprite.scale.set(2.06);
        sprite.anchor.set(0.5);
        this.container.addChild(sprite);
        // Walls
        // this.rightWall = new IsometricWall({ size: { x: this.gridSize.rows, y: this.gridSize.columns }}); //  { x: this.gridSize.rows, y: this.gridSize.columns }
        // this.rightWall.createTiles(this.container);
        // this.rightWall.update();

        // this.leftWall = new IsometricWall({ size: { x: this.gridSize.rows, y: this.gridSize.columns }}); //  { x: this.gridSize.rows, y: this.gridSize.columns }
        // this.leftWall.isLeft = true;
        // this.leftWall.createTiles(this.container);
        // this.leftWall.update();
        
        // Floor
        this.grid = new IsometricGrid({ size: { x: this.gridSize.rows, y: this.gridSize.columns }}); // { x: this.gridSize.rows, y: this.gridSize.columns }
        this.grid.createTiles(this.container);
        this.grid.update();
        // Select the floor on default
        this.selectedGrid = this.grid; // default = grid
        // Reposition Container
        this.container.position.x = app.screen.width / 2;
        this.container.position.y = app.screen.height / 2;
    }

    selectGrid = (value) => {
        // Deselect the currently selected grid
        for(let tile of this.selectedGrid.tiles){
            tile.useStroke = false;
            tile.drawMethod(tile);
        }
        // For implementing the state change
        const selectTiles = (tiles) => {
            for(let tile of tiles){
                tile.useStroke = true;
                tile.drawMethod(tile);
            }
        }
        
        if(value == 'right'){
            this.selectedGrid = this.rightWall;
            selectTiles(this.rightWall.tiles);
        }
        else if(value == 'left'){
            this.selectedGrid = this.leftWall;
            selectTiles(this.leftWall.tiles);
        }
        else{
            this.selectedGrid = this.grid;
            selectTiles(this.grid.tiles);
        }
        // console.log(value + " selected!");
    }

    createDecorations = ({ count = 1, src = 'assets/images/isoTable.png', scale = 1 , size = {x:1,y:1}, anchor = 0.5, isWall = false, offset = 0}) => {
        // Will be removed with the slider to pull out the decorations
        for (let i = 0; i < count; i++) {
            let newDec = new Decoration(src, size);
            newDec.setUpEvents(onDragStart);
            newDec.sprite.scale.set(scale);
            newDec.sprite.anchor.set(anchor, 1); // Anchor notes: 1 = bottom, 1.2 for Halen's props
            newDec.isWall = isWall;
            newDec.offset = offset;
            this.decorations.push(newDec);
            newDec.sprite.index = this.decorations.length - 1;
            this.container.addChild(newDec.sprite);
        }
    }

    bindExtents = (app) => {
        // Clamps the position of the world container so that the grid is always visible
        if(this.container.x < 0){
            this.container.x = 0;
        }
        else if(this.container.x > app.screen.width){
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