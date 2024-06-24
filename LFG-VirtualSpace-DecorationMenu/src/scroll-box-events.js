import { app } from './index.js';

let dragTarget = null;
let localMouseStart;
let scrollPosStart;
let maxDistance;

export const setUpScrollBoxEvents = () => {
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    app.stage.on('pointerup', onDragEnd);
    app.stage.on('pointerupoutside', onDragEnd);
}

export const onDragStart = (event) => {
    //console.log('entering onDragStart');
    // Store a reference to the data
    // * The reason for this is because of multitouch *
    // * We want to track the movement of this particular touch *
    dragTarget = event.target;

    localMouseStart = dragTarget.parent.toLocal(event.global, null);
    scrollPosStart = { x: dragTarget.position.x, y: dragTarget.position.y };
    maxDistance = dragTarget.width - dragTarget.parent.width;

    app.stage.on('pointermove', onDragMove);
}

const onDragMove = (event) => {
    //console.log('entering onDragMove');
    if (dragTarget)
    {
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