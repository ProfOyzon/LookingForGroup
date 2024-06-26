// Thomas Martinez
import * as PIXI from "pixi.js";
//import { createDecorationMenu } from './decoration-menu-OLD.js';
//import { CreateDecorationMenu } from './scroll-box-prototype.js';
import { DecorationMenu } from './decoration-menu.js';

export let app;

const init = async () => {
    // initialize application
    app = new PIXI.Application();
    await app.init({ backgroundColor: 'white', resizeTo: window });
    document.body.appendChild(app.canvas);

    // create space (container for everything)
    let space = new PIXI.Container();
    app.stage.addChild(space);

    let spaceBG = new PIXI.Graphics().rect(0, 0, app.screen.width * .9, app.screen.height * .9).fill(0X1099BB);
    space.addChild(spaceBG);

    //createDecorationMenu(space, 100, 120, 12, 150, 3);

    //space.addChild(CreateDecorationMenu(app));

    new DecorationMenu({
        app: app,
        parent: space,
        margins: 100,
        height: 120,
        padding: 6,
        scrollMS: 150,
        scrollCount: 6
    });
}

init();