import {app, world} from './main';

export let dragTarget = null;
export const mouseCoords = { x: 0, y: 0 };
export let panMode = true;
export let isPanning = false;
export let offsetX, offsetY, startPanX, startPanY = 0;

export const setUpStageEvents = () => {
    // Set up for drag
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    // Keep track of mouse position
    app.stage.on('mousemove', (event) => {
        mouseCoords.x = event.global.x;
        mouseCoords.y = event.global.y;
    });
    app.stage.on('pointerdown', () => {
        for (let dec of world.decorations) {
            // Reset Changes
            dec.sprite.alpha = 1;
            dec.sprite.tint = "#ffffff";
        }
        onPanStart();
    });
    app.stage.on('pointermove', () => {
        onPanMove();
    });
    app.stage.on('pointerup', () => {
        onDragEnd();
        isPanning = false;
    });
    app.stage.on('pointerupoutside', () => {
        onDragEnd();
        isPanning = false;
    });
    app.stage.on('wheel', onZoom);
}

// Panning
export const onPanStart = () => {
    world.grid.update();
    if (panMode && !dragTarget) {
        startPanX = mouseCoords.x;
        startPanY = mouseCoords.y;
        isPanning = true;
    }
}

export const onPanMove = () => {
    if (isPanning) {
        // Find the offset between mouse and screen
        offsetX = mouseCoords.x - startPanX;
        offsetY = mouseCoords.y - startPanY;
        // Update the position of the view container
        world.container.x += offsetX;
        world.container.y += offsetY;
        // Bind Extents
        world.bindExtents(app);
        // update start pan
        startPanX = mouseCoords.x;
        startPanY = mouseCoords.y;
    }
}

// Drag Events
export const onDragStart = (event) => {
    // Store a reference to the data
    dragTarget = event.target;
    dragTarget.alpha = 0.5;
    if (dragTarget.decoration.attachedTile) {
        // Remove it from its attached tile
        dragTarget.decoration.attachedTile.removeDecoration();
    }
    // Bring it back to the front
    bringToFront(dragTarget);
    dragTarget.parent.toLocal(event.global, null, dragTarget.position); // Set it back to screen position, not world position
    // Procede to Move handling
    app.stage.on('pointermove', onDragMove);
}

export const onDragMove = (event) => {
    if (dragTarget) {
        // Sets drag target to the location of the mouse
        // Takes the parent (its container) and moves it along the mouse
        dragTarget.parent.toLocal(event.global, null, dragTarget.position); // https://pixijs.download/v4.8.9/docs/PIXI.Container.html#toLocal
    }
}

export const onDragEnd = () => {
    // Check if there is a drag target
    // console.log(`onDragEnd - MouseCoords: ${mouseCoords.x} ,${mouseCoords.y}`); // ------------------
    if (dragTarget) {
        // Turn off
        app.stage.off('pointermove', onDragMove);
        // Check if on grid
        if (world.grid.isInMap(mouseCoords)) {
            // Get the tile it is on
            let tile = world.grid.getTile(mouseCoords);
            // Check if that tile doesn't have a child
            if (tile.child == null) {
                // Add the dragTarget to that tile
                tile.addDecoration(dragTarget);
            }
        }
        // Get rid of drag target
        dragTarget = null;
    }
}

// Zoom
export const onZoom = (e) => {
    // Take the world container and scale it
    let direction = e.deltaY > 0 ? 1 : -1;
    let newScale = world.container.scale.x + direction * -0.1; // smoothing + inverse direction
    newScale = Math.min(Math.max(0.5, newScale), 4); // Boundaries
    world.container.scale.set(newScale);
    // Bind Extents
    world.bindExtents(app);
    world.grid.update();
}

const bringToFront = (sprite) => {
    // Remove the sprite from its original parent and re-add it
    world.container.removeChild(sprite);
    world.container.addChild(sprite);
}