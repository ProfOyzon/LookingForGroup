import * as PIXI from "pixi.js";
import { createDecorationMenu } from './decoration-menu.js';

const init = async () => {
    // initialize application
    const app = new PIXI.Application();
    await app.init({ backgroundColor: 0XFFFFFF, resizeTo: window });
    document.body.appendChild(app.canvas);

    // create space (container for everything)
    let space = new PIXI.Container();

    let spaceBG = new PIXI.Graphics().rect(0, 0, app.screen.width * .9, app.screen.height * .9).fill(0X1099BB);
    space.addChild(spaceBG);

    createDecorationMenu(space, 100, 120, 12, 150, 3);

    app.stage.addChild(space);
}

init();