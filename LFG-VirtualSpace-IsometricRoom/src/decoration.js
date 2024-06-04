import * as PIXI from 'pixi.js';
export class Decoration{
    constructor(src){
        this.sprite = drawSprite(src);
        this.attachedTile = null;
        // Attatch this info to the sprite
        this.sprite.decoration = this;
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
    sprite.anchor.set(0.5, 0.5);
    sprite.scale.set(2.5);
    sprite.position.x = 300;
    sprite.position.y = 200;

    // Set up drag
    sprite.eventMode = 'static';
    sprite.cursor = 'pointer';
    return sprite;
}