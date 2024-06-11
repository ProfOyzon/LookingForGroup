// Wilson Xia
import * as PIXI from 'pixi.js';
export class Decoration{
    constructor(src, size){
        this.sprite = drawSprite(src);
        this.attachedTiles = [];
        this.size = size;//{x:1,y:1};
        // Attatch this info to the sprite
        this.sprite.decoration = this;
    }

    removeTiles = () => {
        for(let tile of this.attachedTiles){
            tile.removeDecoration();
        }
        this.attachedTiles = [];
    }

    setUpEvents(onDragStart){
        // Events & Interaction
        this.sprite.eventMode = 'static';
        this.sprite.onpointerover = (event) => {
            // Hover
            event.target.tint = `#BBB`; // draws on top of the original darker shade
        }
        this.sprite.onpointerout = (event) => {
            // Hover exit
            event.target.tint = '#ffffff';
        }
        this.sprite.on('pointerdown', onDragStart);
    }
}

const drawSprite = (src) => {
    let sprite = PIXI.Sprite.from(src);
    sprite.anchor.set(0.3, 1);

    // Set up drag
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    return sprite;
}