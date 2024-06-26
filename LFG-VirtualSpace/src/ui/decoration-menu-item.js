import {Container, Graphics, Sprite} from "pixi.js";
import { Button } from "@pixi/ui";

export class DecorationMenuItem {
    constructor({textureUrl, sideLength, padding, colors}) {
        this.colors = colors;
        this.texture = textureUrl;

        let squareSide = sideLength - (padding * 2);
        let container = new Container({
            width: squareSide,
            height: squareSide,
            eventMode: 'static',
            name: "item_button",
        })

        this.background = new Graphics().roundRect(padding, padding, squareSide, squareSide, padding * 1.5).fill(colors.FORE_COLOR);
        container.addChild(this.background);

        let sprite = new Sprite({
            texture: this.texture,
            x: padding,
            y: padding,
            width: squareSide,
            height: squareSide,
        });
        container.addChild(sprite);

        container.on('click', this.onClick);
        container.on('mouseenter', this.hover);
        container.on('mouseleave', this.endHover);

        this.menuItem = container;
    }

    onClick = (e) => {
        console.log(this.texture);
    }

    hover = () => {
        this.background.tint = this.colors.DISABLED_COLOR;
    }

    endHover = () => {
        this.background.tint = 0XFFFFFF;
    }
}