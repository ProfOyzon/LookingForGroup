// Thomas Martinez
// drag events used by scroll box

import { app } from '../main.js';

let dragTarget = null;
let localMouseStart;
let scrollPosStart;
let maxDistance;

let mousedown = false;

export const setUpScrollBoxEvents = () => {
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);
}

export const onMouseUp = () => {
    mousedown = false;
    // console.log("mouse down = false");
    // console.log("-------------------------------------------");
} 

export const onDragStart = (event) => {
    //console.log('entering onDragStart');
    // Store a reference to the data
    // * The reason for this is because of multitouch *
    // * We want to track the movement of this particular touch *
    //dragTarget = event.target;

    // NOTE FOR TOMORROW TRY A SET TIMOUT TO DISTINGUISH BETWEEN CLICK AND DRAG

    // console.log('mouse down = true');
    mousedown = true;

    dragTarget = event.target;

    setTimeout(() => {
        if (mousedown) {
            // console.log("dragging: " + dragTarget.name);
            if (dragTarget.name != "items_container") {
                dragTarget = dragTarget.parent;
                // console.log("switching target: item to container");
            }
    
            localMouseStart = dragTarget.parent.toLocal(event.global, null);
            scrollPosStart = { x: dragTarget.position.x, y: dragTarget.position.y };
            maxDistance = dragTarget.width - dragTarget.parent.width;

            app.stage.on('pointermove', onDragMove);
        }
        // else {
        //     // console.log("click");
        // }
    }, 50); 
}

const onDragMove = (event) => {
    //console.log('entering onDragMove');
    if (dragTarget)
    {
        // console.log(dragTarget.width);
        const localMouseCurrent = dragTarget.parent.toLocal(event.global, null);
        const mouseDeltaX = -(localMouseStart.x - localMouseCurrent.x);

        dragTarget.position.x = scrollPosStart.x + mouseDeltaX;
        dragTarget.position.y = 0;

        //console.log(`dragTarget.position.x: ${dragTarget.position.x}, maxDistance: ${-maxDistance},  ${dragTarget.position.x > -maxDistance}`);
        dragTarget.position.x = Math.max(dragTarget.position.x, -maxDistance);
        dragTarget.position.x = Math.min(dragTarget.position.x, 0);
    }
}

const onDragEnd = () => {
    //console.log("entering onDragEnd");
    if (dragTarget)
    {
        app.stage.off('pointermove', onDragMove);
        dragTarget = null;
    }
}