/*
Decoration Menu 2.0:
Author: Thomas Martinez
Summary: Creates a horizontal scrolling menu across the bottom of a container.

Reworking of the scroll menu without using the pixi ui library since it's scroll box had some limitations.
I'm seeing what i can come up with from scratch. 
*/

import {Container, Graphics, Assets, Text, Ticker} from "pixi.js";

let app;
let container;
let maskContainer;

export const CreateDecorationMenu = (a) => {
    app = a;

    // EVENTS
    let dragTarget = null;
    let localMouseStart;
    let scrollPosStart;
    let newStartPosition = 0;

    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);

    function onDragStart(event)
    {
        console.log('entering onDragStart');
        // Store a reference to the data
        // * The reason for this is because of multitouch *
        // * We want to track the movement of this particular touch *
        dragTarget = this;

        localMouseStart = dragTarget.parent.toLocal(event.global, null);
        scrollPosStart = { x: dragTarget.position.x, y: dragTarget.position.y };

        app.stage.on('pointermove', onDragMove);
    }

    function onDragMove(event)
    {
        console.log('entering onDragMove');
        if (dragTarget)
        {
            const localMouseCurrent = dragTarget.parent.toLocal(event.global, null);
            const mouseDeltaX = -(localMouseStart.x - localMouseCurrent.x);

            dragTarget.position.x = scrollPosStart.x + mouseDeltaX;
            dragTarget.position.y = 0;

            dragTarget.position.x = Math.max(dragTarget.position.x, container.width - dragTarget.width);
            dragTarget.position.x = Math.min(dragTarget.position.x, 0);
        }
    }

    function onDragEnd()
    {
        if (dragTarget)
        {
            newStartPosition = dragTarget.position.x;
            app.stage.off('pointermove', onDragMove);
            dragTarget = null;
        }
    }

    container = new Container();
    let bg = new Graphics().rect(0,0,700,70).fill(0XFF0000);
    container.addChild(bg);

    // Create a graphics object to define our mask
    let mask = new Graphics()
    // Add the rectangular area to show
    .rect(70,0,560,70)
    .fill(0xffffff);

    // Add container that will hold our masked content
    maskContainer = new Container();
    // Set the mask to use our graphics object from above
    maskContainer.mask = mask;
    // Add the mask as a child, so that the mask is positioned relative to its parent
    maskContainer.addChild(mask);
    // And add the container to the window!
    container.addChild(maskContainer);

    /*
    INSIDE OF MASK CONTAINER
    -container the height of mask but with undefined width
    -dynamically add items to the container horizontally
    -give container horizontal drag
    */
    let itemsContainer = new Container({
        height: 70,
        eventMode: 'static'
    });

    itemsContainer.on('pointerdown', onDragStart, itemsContainer);

    for (let i = 0; i < 40; i++) {
        let box = new Container({x: (i * 80), width: 70, height: 70});
        box.addChild(new Graphics().rect(0,0,70,70).fill(0XFFFFFF / (i+1)));
        itemsContainer.addChild(box); 
    }

    maskContainer.addChild(itemsContainer);

    return container;
}