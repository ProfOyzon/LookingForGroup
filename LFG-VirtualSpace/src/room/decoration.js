// Wilson Xia
import * as PIXI from 'pixi.js';
export class Decoration {
    constructor(src, size) {
        this.sprite = drawSprite(src);
        this.attachedTiles = [];
        this.isWall = false;
        // Display Properties
        this.size = size; // {x:1,y:1};
        this.offset = 0;
        // Attatch this info to the sprite
        this.sprite.decoration = this;
    }

    removeTiles = () => {
        for (let tile of this.attachedTiles) {
            tile.container.visible = true;
            tile.removeDecoration();
        }
        this.attachedTiles = [];
    }

    setUpEvents(onDragStart) {
        // Events & Interaction
        this.sprite.eventMode = 'static';
        this.sprite.onpointerover = (event) => {
            // Hover
            event.target.tint = `#BBB`; // draws on top of the original darker shade
        }
        this.sprite.onpointerout = (event) => {
            // Hover exit
            event.target.tint = '#fff';
        }
        this.sprite.onpointerdown = (e) => {
            onDragStart(e);
            // console.log(this.sprite.position.y);
        };
    }
}

const drawSprite = (src) => {
    let sprite = PIXI.Sprite.from(src);
    // Set up drag
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    return sprite;
}