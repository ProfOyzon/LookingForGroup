// Thomas Martinez
// Scroll Box used by decoration menu

import {Container, Graphics} from "pixi.js";
import * as Events from "./scroll-box-events.js";

export class HorizontalScrollBox {
    constructor({app, parent, x, y, width, height, item_padding, colors}) {
        // set up events
        this.app = app;
        Events.setUpScrollBoxEvents();

        // visual settings
        this.parent = parent;
        this.width = width;
        this.height = height;
        this.item_padding = item_padding;
        this.colors = colors;

        this.parent = parent;
        this.container = new Container({x: x, y: y});
        //let bg = new Graphics().rect(0, 0, width, height).fill(this.colors.FORE_COLOR);
        //this.container.addChild(bg);

        this.items = [];

        let mask = new Graphics().rect(0,0,width,height).fill(0xffffff);
        // Add container that will hold our masked content
        this.maskContainer = new Container();
        // Set the mask to use our graphics object from above
        this.maskContainer.mask = mask;
        // Add the mask as a child, so that the mask is positioned relative to its parent
        this.maskContainer.addChild(mask);
        // And add the container to the window
        this.container.addChild(this.maskContainer);

        this.itemsContainer = new Container({
            height: this.height,
            width: 0,
            eventMode: 'static'
        });
        this.itemsContainer.on('pointerdown', Events.onDragStart, this.itemsContainer);

        this.resetScrollMenu();

        this.maskContainer.addChild(this.itemsContainer);

        this.parent.addChild(this.container);
    }

    addItem = (item) => {
        item.position.x = this.items.length * this.height;//(this.height + this.item_padding);
        this.items.push(item);
        this.itemsContainer.addChild(item);
        this.scrollBG.width = this.itemsContainer.width;
    }

    resetScrollMenu = () => {
        // clear all children
        this.itemsContainer.children = [];
        this.items = [];
        // this background allows the user to drag the itemsContainer even if hey click inside the padding/margins. 
        this.scrollBG = new Graphics().rect(0, 0, this.itemsContainer.width, this.height).fill(this.colors.BG_COLOR);
        this.scrollBG.zIndex = -1;
        this.itemsContainer.addChild(this.scrollBG);
    }

    scrollToPosition = () => {
        // this backdrop allows the itemsContainer to be dragged when it is clicked in between each item
    }

    scroll = (distance) => {
        this.maxDistance = this.itemsContainer.width - this.width;

        //console.log(`x: ${this.itemsContainer.position.x}, distance: ${distance}`);
        let projectedFinalPos = this.itemsContainer.position.x + distance;

        // i do not know why i cant get this wont work the same way as in the drag event but this is still simple enough and works
        //console.log(`distance: ${distance}, projectedFinalPos: ${projectedFinalPos}, maxDistance: ${maxDistance},  ${this.itemsContainer.position.x < -maxDistance}`);
        let startX = this.itemsContainer.position.x;

        this.itemsContainer.position.x = Math.max(projectedFinalPos, -this.maxDistance);
        this.itemsContainer.position.x = Math.min(this.itemsContainer.position.x, 0);

        console.log(`start x: ${startX}, end x: ${this.itemsContainer.position.x}, maxDistance: ${this.maxDistance}`);
    }
}
