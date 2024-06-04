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
        // console.log(this.container);
        this.setUpEvents();
    }

    setUpEvents = () => {
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
    }

    addDecoration = (d) => {
        // Adds a decoration and re-draws the decoration into the center of this tile
        this.child = d;
        if(this.child.decoration.attachedTile){
            this.child.decoration.attachedTile.removeDecoration();
        }
        this.child.decoration.attachedTile = this;
        this.container.addChild(this.child);
        this.repositionChild();
        // console.log(`Position: ${this.position.x}, ${this.position.y}`); // --------------------------
        drawTile(this, '#4c4c4c');
    }

    removeDecoration = () => {
        this.child.decoration.attachedTile = null;
        // removes a decoration
        this.child = null;
        // console.log('removed'); // --------------------------
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