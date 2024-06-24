import {Container, Graphics, Sprite} from "pixi.js";
import { Button } from "@pixi/ui";

export class DecorationMenuItem {
    constructor({textureUrl, sideLength, padding, colors}) {
        let squareSide = sideLength - (padding * 2);
        let container = new Container({
            width: squareSide,
            height: squareSide,
        })

        let background = new Graphics().roundRect(padding, padding, squareSide, squareSide, padding * 1.5).fill(colors.FORE_COLOR);
        container.addChild(background);

        let sprite = new Sprite({
            texture: textureUrl,
            x: padding,
            y: padding,
            width: squareSide,
            height: squareSide,
        });
        container.addChild(sprite);

        this.menuItem = container;
    }
}