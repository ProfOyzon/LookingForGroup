import { IsometricGrid } from "./isometricGrid";

export class IsometricWall extends IsometricGrid{
    constructor({size, origin={x:0,y:0}, isLeft}){
        super({size, origin});
        this.isWall = true;
        this.isLeft = isLeft;
    }

    // TODO: Edit to account for wall translation
    mapToScreen = (point) => {
        // Edit point to follow origin
        let screen = {};
        // screen.x = (map.x - map.y) * TILE_WIDTH_HALF;
        // Account for shift in map, due to origin
        screen.x = (point.x - point.y) * this.tileSize.halfWidth;
        screen.x += this.origin.x;
        // screen.y = (map.x + map.y) * TILE_HEIGHT;
        screen.y = (point.x + point.y) * this.tileSize.height;
        screen.y += this.origin.y;
        // console.log(`MapToScreen x: ${screen.x} y: ${screen.y} <-- ${point.x}, ${point.y}`); // --------------------------
        return screen;
    }

    screenToMap = (point) => {
        // Edit point to follow origin
        let screenPoint = {
            x: point.x - this.origin.x,
            y: point.y - this.origin.y
        };
        let map = {};
        // map.x = screen.x / w, w = tile's halfwidth
        map.x = screenPoint.x / this.tileSize.halfWidth;
        if(this.isLeft){
            map.x *= -1;
        }
        map.x = Math.floor(map.x);
        // map.y = screen.y / TILE_HEIGHT - screen.x / TILE_WIDTH;
        map.y = screenPoint.y / this.tileSize.height;
        if(this.isLeft){
            map.y += screenPoint.x/this.tileSize.width;
        }
        else{
            map.y -= screenPoint.x/this.tileSize.width;
        }
        map.y = Math.ceil(map.y) * -1;
        // console.log(`ScreenToMap  ${map.x},${map.y}`); //--------------------------x:${screenPoint.x} y:${screenPoint.y} -->
        return map;
    }
}