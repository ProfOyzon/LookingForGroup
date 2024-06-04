import * as PIXI from 'pixi.js';
import { IsometricGrid } from './isometricGrid';
import { Decoration } from './decoration';

// DRAG RESOURCE
//https://pixijs.com/8.x/examples/events/dragging
let app;
let grid;
let decorations;
let worldContainer;
let viewContainer;

let panMode = false;
let isPanning = false;
let offsetX, offsetY, startPanX, startPanY = 0;

const gridSize = { rows: 6, columns: 6 };
const mouseCoords = { x: 0, y: 0 };
let dragTarget = null;

const loadPixiCanvas = async () => {
    // Create a PixiJS application.
    app = new PIXI.Application();

    // Intialize the application.
    await app.init({ background: '#2943AD', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    // Set up the textures
    await loadTextures();

    worldContainer = new PIXI.Container();
    viewContainer = new PIXI.Container();
    viewContainer.addChild(worldContainer);

    setUpGrid();

    decorations = [];
    createDecorations({ count: 3 });
    createDecorations({ count: 2, src: 'assets/images/fancyTable.png' });

    setUpStageEvents();
    app.stage.addChild(viewContainer);
    // console.log(app.stage);

    // // Update loop
    // app.ticker.add((time) => {
    //     const delta = time.deltaTime;
    //     // console.log(delta);
    //     // grid.container.position.y += delta;
    // });
}

const setUpGrid = () => {
    grid = new IsometricGrid(
        {
            size: { x: gridSize.rows, y: gridSize.columns },
            // origin: { x: app.screen.width / 2, y: app.screen.height / 3 }
        });
    grid.createTiles(worldContainer);
    // Center grid
    viewContainer.position.x = app.screen.width / 2;
    viewContainer.position.y = app.screen.height / 3;
    grid.update();
}

const createDecorations = ({ count = 2, src = 'assets/images/isoTable.png', scale = 1 }) => {
    for (let i = 0; i < count; i++) {
        let newDec = new Decoration(src);
        newDec.setUpEvents(onDragStart);
        newDec.sprite.scale.set(scale);
        decorations.push(newDec);
        worldContainer.addChild(newDec.sprite);
    }
}

const setUpStageEvents = () => {
    // Set up for drag
    app.stage.eventMode = 'static';
    app.stage.hitArea = app.screen;
    // Keep track of mouse position
    app.stage.on('mousemove', (event) => {
        mouseCoords.x = event.global.x;
        mouseCoords.y = event.global.y;
        // console.log(event.global);
    });
    app.stage.on('pointerdown', () => {
        for (let dec of decorations) {
            // Reset Changes
            dec.sprite.alpha = 1;
        }
        onPanStart();
    });
    app.stage.on('pointermove', onPanMove)
    app.stage.on('pointerup', () => {
        onDragEnd();
        isPanning = false;
    });
    app.stage.on('pointerupoutside', ()=>{
        onDragEnd();
        isPanning = false;
    });
    app.stage.on('wheel', onZoom);
    app.stage.on('rightclick', () => {
        // viewContainer.position.set(0, 0);
        panMode = !panMode;
        grid.update();
    });

    // viewContainer.eventMode = 'static';
    // viewContainer.on('pointerdown', onPanStart);
    // viewContainer.on('pointermove', onPanMove);
}

const bringToFront = (sprite) => {
    // Remove the sprite from its original parent and re-add it
    worldContainer.removeChild(sprite);
    worldContainer.addChild(sprite);
}


const loadTextures = async () => {
    // load the texture
    await PIXI.Assets.load('assets/images/isoTable.png');
    await PIXI.Assets.load('assets/images/fancyTable.png');
}

// Drag Events
const onDragStart = (event) => {
    // Store a reference to the data
    dragTarget = event.target;
    dragTarget.alpha = 0.5;
    if (dragTarget.decoration.attachedTile) {
        // Remove it from its attached tile
        dragTarget.decoration.attachedTile.removeDecoration();
    }
    // Bring it back to the front
    bringToFront(dragTarget);
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
    // console.log(`onDragEnd - MouseCoords: ${mouseCoords.x} ,${mouseCoords.y}`); // ------------------
    if (dragTarget) {
        // Turn off
        app.stage.off('pointermove', onDragMove);
        // Check if on grid
        if (grid.isInMap(mouseCoords)) {
            // Get the tile it is on
            let tile = grid.getTile(mouseCoords);
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

const onPanStart = (e) => {
    if(panMode){startPanX = mouseCoords.x;
    startPanY = mouseCoords.y;
    isPanning = true;}
}

const onPanMove = (e) => {
    if (isPanning) {
        // Find the offset between mouse and screen
        offsetX = mouseCoords.x - startPanX;
        offsetY = mouseCoords.y - startPanY;
        // Update the position of the view container
        viewContainer.x += offsetX;
        viewContainer.y += offsetY;
        // update start pan
        startPanX = mouseCoords.x;
        startPanY = mouseCoords.y;
    }
}

const onZoom = (e) => {
    console.log(e);
    let padding = 10;
    // Re center the world based on mouse Pos
    // viewContainer.position.x = mouseCoords.x;
    // viewContainer.position.y = mouseCoords.y;
    // Bind Extents
    // if(mouseCoords.x < worldContainer.width/2 + padding){
    //     worldContainer.position.x = worldContainer.width/2 + padding;
    // }
    // if(mouseCoords.x > app.screen.width - worldContainer.width/2 - padding){
    //     worldContainer.position.x = app.screen.width - worldContainer.width/2 - padding;
    // }
    // Take the world container and scale it
    let newScale = worldContainer.scale.x + e.deltaY * -0.001;
    newScale = Math.min(Math.max(0.1, newScale), 2);
    // Bind extents
    worldContainer.scale.x = newScale;
    worldContainer.scale.y = newScale;
    // Update the grid
    // viewContainer.position.set(0,0);
    grid.update();
}

loadPixiCanvas();