// Wilson Xia
import { app, world, decorationMenu } from '../main';
import { isScrolling } from '../ui/scroll-box-events';

const mouseCoords = { x: 0, y: 0 };
let dragTarget = null;
let panMode = true;
let isPanning = false;
let offsetX, offsetY, startPanX, startPanY = 0;

export const setUpStageEvents = () => {
    // Set up for drag
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    // Keep track of mouse position
    app.stage.on('mousemove', (event) => {
        mouseCoords.x = event.global.x;
        mouseCoords.y = event.global.y;
        // console.log(mouseCoords);
    });
    // app.stage.on('click', ()=>console.log(`mouse: ${mouseCoords.x}, ${mouseCoords.y}`));
    app.stage.on('pointerdown', () => {
        for (let dec of world.decorations) {
            // Reset Changes
            dec.sprite.alpha = 1;
            dec.sprite.tint = "#ffffff";
        }
        // Check to see if we are outside the decoration menu slider
        if(!decorationMenu.inSlider){ 
            onPanStart();
        }
    });
    app.stage.on('pointermove', onPanMove);
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
const onPanStart = () => {
    world.selectedGrid.update();
    if (panMode && !dragTarget) {
        startPanX = mouseCoords.x;
        startPanY = mouseCoords.y;
        isPanning = true;
    }
}

const onPanMove = () => {
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
    // Clean up the reference
    if (dragTarget.decoration.attachedTiles.length > 0) {
        // Remove it from its attached tiles
        dragTarget.decoration.removeTiles();
    }
    bringToFront(dragTarget); // Bring it back to the front of the screen
    dragTarget.parent.toLocal(event.global, null, dragTarget.position); // Set it back to screen position, not world position
    // Decide which grid to use
    if(dragTarget.decoration.isWall){
        // TODO: Base which wall to use on rotation
        world.selectGrid('right');
    }
    else{
        world.selectGrid('floor');
    }
    // Procede to Move handling
    app.stage.on('pointermove', onDragMove);
}

const onDragMove = (event) => {
    if (dragTarget) {
        // Sets drag target to the location of the mouse
        // Takes the parent (its container) and moves it along the mouse
        dragTarget.parent.toLocal(event.global, null, dragTarget.position); // https://pixijs.download/v4.8.9/docs/PIXI.Container.html#toLocal
    }
}

const onDragEnd = () => {
    // Check if there is a drag target
    if (dragTarget) {
        // Turn off
        app.stage.off('pointermove', onDragMove);
        // Check if on grid
        if (world.selectedGrid.isInMap(mouseCoords)) {
            // Check if the current position can fit the decoration by checking the extended coordinates.
            // This is based on the decoration's size (2x2, 3x4)
            if (checkIfDecorationFits()) {
                // Get a list of all the tiles
                let emptyTiles = obtainEmptyTiles(dragTarget);
                // There must be enough empty tiles to fit the decoration
                if (emptyTiles.length == dragTarget.decoration.size.x * dragTarget.decoration.size.y) {
                    // attach all the tiles in the list to that decoration
                    for (let i = 0; i < emptyTiles.length; i++) {
                        let tile = emptyTiles[i];
                        tile.addDecoration(dragTarget);
                    } // ends with the first tile, so the decoration gets drawn on that tile
                    emptyTiles[0].repositionChild();

                    // hide tiles for visual effect
                    // unhides when the decoration is dragged else where
                    if(emptyTiles.length > 1){
                        for(let i = 0; i < emptyTiles.length - 1; i++){
                            // skip the first tile
                            let tile = emptyTiles[i];
                            tile.container.visible = false;
                        }
                    }
                }
                // If not, then don't do anything
            }
        }
        // Get rid of drag target
        dragTarget = null;
    }
}

// Zoom
const onZoom = (e) => {
    // Take the world container and scale it
    let direction = e.deltaY > 0 ? 1 : -1;
    let newScale = world.container.scale.x + direction * -0.1; // smoothing + inverse direction
    newScale = Math.min(Math.max(0.5, newScale), 4); // Boundaries
    world.container.scale.set(newScale);
    // Bind Extents
    world.bindExtents(app);
    world.selectedGrid.update();
}

// Utility
const bringToFront = (sprite) => {
    // Remove the sprite from its original parent and re-add it
    world.container.removeChild(sprite);
    world.container.addChild(sprite);
}

const checkIfDecorationFits = () => {
    // TODO: Change the offset by looking at the dragTarget's rotation or size
    // TODO: Change so it matches the algorithm in obtainEmptyTiles
    // Finds the last tile the decoration would be attached to and checks if its on the map
    let lastMouseX = mouseCoords.x + (dragTarget.decoration.size.x - 1) * world.selectedGrid.tileSize.halfWidth;
    let lastMouseY = mouseCoords.y - (dragTarget.decoration.size.y - 1) * world.selectedGrid.tileSize.halfHeight;
    return world.selectedGrid.isInMap({ x: lastMouseX, y: lastMouseY });
}

const obtainEmptyTiles = (dragTarget) => {
    // Currently, checks the first tile and then the tiles behind it, up-right
    // TODO: Change the offset by looking at the dragTarget's rotation or size
    let tileList = [];
    let tempPos = world.selectedGrid.screenToMap(mouseCoords);
    // Check if each tile is empty
    for (let j = 0; j < dragTarget.decoration.size.y; j++) {
        // Y
        for (let i = 0; i < dragTarget.decoration.size.x; i++) {
            // X
            let currentTile = world.selectedGrid.getTileByID(tempPos);
            // Only add empty tiles
            if (currentTile && currentTile.child == null) {
                tileList.push(currentTile);
            }
            // Change in x
            tempPos.x--;
        }
        // Change in y
        tempPos.y--;
        tempPos.x += dragTarget.decoration.size.x;
    }
    // console.log(tileList);
    return tileList;
}