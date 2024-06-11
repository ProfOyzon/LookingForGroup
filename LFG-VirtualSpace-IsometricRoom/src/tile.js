// Wilson Xia
import * as PIXI from 'pixi.js';

export class Tile {
    constructor({ x, y, width, i, j}) {
        this.container = new PIXI.Container();
        this.position = {x, y};
        this.id = {x:i, y:j};
        this.width = width;
        this.height = width / 2;
        this.child = null;
        this.sprite = null;
        // Attatch this info to the sprite
    }

    draw = () => {
        // Draws an isometric tile
        this.sprite = new PIXI.Graphics();
        drawTile(this);
        this.container.addChild(this.sprite);
        this.container.zIndex = this.position.y / this.height * 2; // For rendering, so things in the back get drawn first, then get overlapped by things in the front
        this.container.zIndex += this.position.x / this.width; // For rendering, so things side by side are drawn from left to right
        this.setUpEvents();
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
        this.sprite.onclick = (event) => {
            console.log(event.target.toGlobal(event.target.position)); 
        }
    }

    repositionChild = () => {
        // Move d to this.position, assuming they share the same anchor point
        this.child.position = this.position;
        this.child.position.y += this.height;
    }

    addDecoration = (d) => {
        // Adds a decoration and re-draws the decoration into the center of this tile
        this.child = d;
        this.child.decoration.attachedTiles.push(this);
        this.container.addChild(this.child); // TODO: Change so that the decoration adds itself to the correct container
        drawTile(this, '#4c4c4c');
    }

    removeDecoration = () => {
        // removes a decoration
        this.child = null;
        drawTile(this);
    }
}

const drawTile = (tile, color='#FFFFFF') => {
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
    tile.sprite.stroke({ color: 'black', width: 3 });
    tile.sprite.restore();

    tile.sprite.tile = tile;
}