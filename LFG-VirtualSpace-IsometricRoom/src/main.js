import * as PIXI from 'pixi.js';
import { World } from './world';
import * as EVENTS from './events';

// DRAG RESOURCE
//https://pixijs.com/8.x/examples/events/dragging
export let app;
export let world;

const init = async () => {
    await loadPixiCanvas();
    // Set up the textures
    await loadTextures();

    // Create new world
    world = new World({rows: 6, columns: 6});
    app.stage.addChild(world.container);
    world.setUpGrid(app);
    world.createDecorations({ count: 3 });
    world.createDecorations({ count: 2, src: 'assets/images/fancyTable.png' });
    
    // Set up stage events
    EVENTS.setUpStageEvents();
    // // Update loop
    // app.ticker.add((time) => {
    //     const delta = time.deltaTime;
    //     // console.log(delta);
    //     // grid.container.position.y += delta;
    // });
}

const loadPixiCanvas = async () => {
    // Create a PixiJS application.
    app = new PIXI.Application();

    // Intialize the application.
    await app.init({ background: '#2943AD', resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);
}
const loadTextures = async () => {
    // load the texture
    await PIXI.Assets.load('assets/images/isoTable.png');
    await PIXI.Assets.load('assets/images/fancyTable.png');
}

init();