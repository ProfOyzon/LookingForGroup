// Wilson Xia
import * as PIXI from 'pixi.js';

export class Tile {
    constructor({ x, y, width, i, j}) {
        this.container = new PIXI.Container();
        this.drawMethod;
        this.position = {x, y}; // For Drawing sprites
        this.id = {x:i, y:j}; // Acts as a position in a grid
        this.width = width;
        this.height = width / 2;
        this.child = null;
        this.sprite = null;
        this.useStroke = false;

        this.text;
    }

    draw = (parent) => {
        // Draws an isometric tile
        this.sprite = new PIXI.Graphics();
        if(!parent.isWall){
            this.drawMethod = drawTile;
        }
        else{
            this.drawMethod = drawWallTile;
        }
        this.drawMethod(this);
        this.container.addChild(this.sprite);
        // Text
        this.text = new PIXI.Text({
            text: 'Test',
            align: 'center'
        });
        this.text.anchor.set(0.5,0);
        this.text.x = this.position.x;
        this.text.y = this.position.y;
        this.setZIndex(this.id.x);
        this.container.addChild(this.text);
        // Events
        this.setUpEvents();
    }

    setZIndex = (zIndex) => {
         // Rendering Order
         this.container.zIndex = zIndex;//this.position.y / this.height * 2; // For rendering, so things in the back get drawn first, then get overlapped by things in the front
         // this.container.zIndex += this.position.x / this.width; // For rendering, so things side by side are drawn from left to right
         this.text.text = this.container.zIndex; //this.id.x + (this.id.y * parent.size.y)
    }

    setUpEvents = () => { // TODO: Get rid of events, and change to a constant update for hovering
        // Events & Interaction
        this.sprite.eventMode = 'static';
        this.sprite.onpointerover = (event) => {
            // Hover
            event.target.tint = '#BBB'; // draws on top of the original darker shade
        }
        this.sprite.onpointerout = (event) => {
            // Hover exit
            event.target.tint = '#FFF';
        }
    }

    repositionChild = () => {
        // Move d to this.position, assuming they share the same anchor point
        this.child.position = this.position;
        this.child.position.y += this.height - this.child.decoration.offset;
    }

    addDecoration = (d) => {
        // Adds a decoration and re-draws the decoration into the center of this tile
        this.child = d;
        this.child.decoration.attachedTiles.push(this);
        this.container.addChild(this.child);
        this.drawMethod(this, '#4c4c4c');
    }

    removeDecoration = () => {
        // removes a decoration
        this.child = null;
        this.drawMethod(this);
    }

    colorTile = (color) => {
        this.drawMethod(this, color);
    }
}

const drawTile = (tile, color='rgba(255, 255, 255, 0)') => {
    // Starting point
    tile.sprite.save();
    tile.sprite.clear();
    tile.sprite.moveTo(tile.position.x, tile.position.y);
    // Draw edges
    tile.sprite.lineTo(tile.position.x + tile.width/2, tile.position.y + tile.height/2);
    tile.sprite.lineTo(tile.position.x, tile.position.y + tile.height);
    tile.sprite.lineTo(tile.position.x - tile.width/2, tile.position.y + tile.height/2);
    tile.sprite.lineTo(tile.position.x, tile.position.y);
    // Stroke
    tile.sprite.fill({color});
    if(tile.useStroke){
        tile.sprite.stroke({ color: 'red', width: 2 });
    }
    tile.sprite.restore();

    tile.sprite.tile = tile;
}

const drawWallTile = (tile, color='rgba(255, 255, 255, 0)') => {
    // Starting point
    tile.sprite.save();
    tile.sprite.clear();
    tile.sprite.moveTo(tile.position.x, tile.position.y);
    // Draw edges
    tile.sprite.lineTo(tile.position.x + tile.width/2, tile.position.y + tile.height/2); // bottom right
    tile.sprite.lineTo(tile.position.x + tile.width/2, tile.position.y - tile.height/2); // top right
    tile.sprite.lineTo(tile.position.x, tile.position.y - tile.height); // top left
    tile.sprite.lineTo(tile.position.x, tile.position.y); // home, bottom left
    // Stroke
    tile.sprite.fill({color});
    if(tile.useStroke){
        tile.sprite.stroke({ color: 'red', width: 2 });
    }
    tile.sprite.restore();

    tile.sprite.tile = tile;
}