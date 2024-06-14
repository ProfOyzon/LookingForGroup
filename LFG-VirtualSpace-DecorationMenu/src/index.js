import * as PIXI from "pixi.js";
import { createDecorationMenu } from './decoration-menu-OLD.js';
import { CreateDecorationMenu } from './decoration-menu-2.0.js';

const init = async () => {
    // initialize application
    const app = new PIXI.Application();
    await app.init({ backgroundColor: 0XFFFFFF, resizeTo: window });
    document.body.appendChild(app.canvas);

    // create space (container for everything)
    let space = new PIXI.Container();

    let spaceBG = new PIXI.Graphics().rect(0, 0, app.screen.width * .9, app.screen.height * .9).fill(0X1099BB);
    space.addChild(spaceBG);

    //createDecorationMenu(space, 100, 120, 12, 150, 3);

    let menu = CreateDecorationMenu(app);
    space.addChild(menu);

    app.stage.addChild(space);
}

init();