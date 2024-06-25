// Wilson Xia
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
    world = new World({ rows: 6, columns: 6 });
    app.stage.addChild(world.container);
    world.setUpGrid(app);
    // world.createDecorations({ count: 3, src: 'assets/images/chest.png', scale: 1.3, size: {x:1,y:2}, anchor: 0.35});
    // world.createDecorations({ count: 1, src: 'fancyTable' });
    // world.createDecorations({ count: 1, src: 'fancyTable', isWall: true});
    let halenScale = 2.5;
    world.createDecorations({ count: 1, src: 'cozyRug',         scale:2.15, size: {x:2,y:2} });
    world.createDecorations({ count: 1, src: 'cozyBookshelf',   scale:2,    size: {x:1,y:2}, anchor: 0.2, offset: 12});
    world.createDecorations({ count: 1, src: 'cozyBlankets',    scale:halenScale, offset: 12});
    world.createDecorations({ count: 1, src: 'cozyChair',       scale:halenScale, offset: 12});
    world.createDecorations({ count: 1, src: 'cozyCouch',       scale:2,    size: {x:1,y:2}, anchor: 0.35});
    world.createDecorations({ count: 1, src: 'cozyTable',       scale:2,    offset: 15});
    world.createDecorations({ count: 1, src: 'cozyLight',       scale:2,    offset: 15});
    // world.createDecorations({ count: 1, src: 'cuteFish', scale:halenScale, offset: 12});
    // world.createDecorations({ count: 1, src: 'cyberArm',            scale: halenScale,});
    // world.createDecorations({ count: 1, src: 'fantasyCauldron',     scale: halenScale, offset: 12});
    // world.createDecorations({ count: 1, src: 'fantasyTelescope',    scale: halenScale, offset: 12});
    // world.createDecorations({ count: 1, src: 'cozyLight',           scale: halenScale, offset: 12});
    // world.createDecorations({ count: 1, src: 'westernRack',         scale: halenScale, offset: 12});
    // world.createDecorations({ count: 1, src: 'cozyPlant',           scale: halenScale, offset: 12});
    
    // Set up stage events
    EVENTS.setUpStageEvents();
    console.log(app.stage);
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
    // Reference: https://pixijs.download/release/docs/assets.Assets.html#addBundle
    PIXI.Assets.addBundle('decorations', [
        { alias: 'fancyTable', src: 'assets/images/fancyTable.png' },
        { alias: 'cuteBear', src: 'assets/images/VS_Cute(Bear).png'},
        { alias: 'cuteFish', src: 'assets/images/VS_Cute(Fish).png'},
        { alias: 'cyberArm', src: 'assets/images/VS_Cyber(Arm).png'},
        { alias: 'fantasyCauldron', src: 'assets/images/VS_Fantasy(Cauldron).png'},
        { alias: 'fantasyTelescope', src: 'assets/images/VS_Fantasy(Telescope).png'},
        { alias: 'westernRack', src: 'assets/images/VS_Western(Rack).png'},
       ]);
    PIXI.Assets.addBundle('cozy', [
        { alias: 'cozyBlankets', src: 'assets/images/cozy/blankets-cozy.png' },
        { alias: 'cozyPlant', src: 'assets/images/cozy/plant-cozy.png'},
        { alias: 'cozyLight', src: 'assets/images/cozy/lamp-cozy-v2.png'},
        { alias: 'cozyBookshelf', src: 'assets/images/cozy/VS_Bookshelf(Cozy).png'},
        { alias: 'cozyChair', src: 'assets/images/cozy/VS_Chair(Cozy).png'},
        { alias: 'cozyCouch', src: 'assets/images/cozy/VS_Couch(Cozy).png'},
        { alias: 'cozyRug', src: 'assets/images/cozy/VS_Rug(Cozy).png'},
        { alias: 'cozyTable', src: 'assets/images/cozy/VS_Table(Cozy).png'},
    ]);
    PIXI.Assets.addBundle('rooms', [
        { alias: 'westernRoom', src: 'assets/images/rooms/VS_Room(Western).png'}
    ]);
    await PIXI.Assets.loadBundle('decorations');
    await PIXI.Assets.loadBundle('cozy');
    await PIXI.Assets.loadBundle('rooms');
    await PIXI.Assets.load('assets/images/isoTable.png');
    await PIXI.Assets.load('assets/images/chest.png');
}

init();