// Wilson Xia
import { Container } from 'pixi.js';
import { Tile } from './tile';

export class IsometricGrid {
    // Diagonally right = x
    // Diagonally left = y
    constructor({size, origin={x:0,y:0}}) {
        this.isWall = false;
        this.originalOrigin = {...origin};
        this.origin = origin;
        this.size = size; // x, y = row and columns
        this.tiles = [];
        this.container = new Container();
        this.originalWidth = 128;
        this.tileSize = {
            width: this.originalWidth,
            halfWidth: this.originalWidth/2,
            height: this.originalWidth/2,
            halfHeight: this.originalWidth/4
        };
        // this.container.pivot.set(0, this.tileSize.halfHeight * this.size.y); // Places in the center of the floor
    }

    update = () => {
        let parentScale = this.container.parent.scale;
        this.updateOrigin();
        this.updateTileSize(parentScale.x);
    }

    updateTileSize = (scale) => {
        // For scaling
        let w = this.originalWidth * scale;
        this.tileSize = {
            width: w,
            halfWidth: w/2,
            height: w/2,
            halfHeight: w/4
        }
    }

    updateOrigin = () =>{ 
        let firstTilePos = this.tiles[0].container.getGlobalPosition();
        this.origin.x = this.originalOrigin.x + firstTilePos.x;
        this.origin.y = this.originalOrigin.y + firstTilePos.y;
    }

    createTiles = (parent) => {
        // generation params
        let startX = this.origin.x;
        let startY = this.origin.y;
        let x = startX;
        let y = startY;
        for (let j = 0; j < this.size.y; j++) {
            // Y
            for (let i = 0; i < this.size.x; i++) {
                // X
                let newTile = new Tile({ x, y, i, j, width: this.tileSize.width });
                this.tiles.push(newTile);
                // Change on X axis
                x += this.tileSize.halfWidth;  //  \
                y += this.tileSize.halfHeight; //   V
            }
            // Change on Y axis
            if(!this.isWall){
                startX -= this.tileSize.halfWidth;  //   /
                startY += this.tileSize.halfHeight; //  V 
            }
            else{
                startY -= this.tileSize.height;
            }
            x = startX;
            y = startY;
        }
        if(this.isLeft){
            this.container.scale.x = -1;
        }
        this.drawTiles(parent);
    }

    drawTiles = (parent) => {
        // Draws all tiles in its list
        this.container.sortableChildren = true; // Allows for z-index to be utilized, draws the tiles from back to front
        for (let tile of this.tiles) {
            tile.draw(this);
            this.container.addChild(tile.container);
        }
        this.container.sortChildren();
        parent.addChild(this.container);
    }

    getTile = (point) => {
        // Takes in a screen coordinate and converts it into a map coordinate
        // Uses math to find the id of the tile in the tiles array
        let mapPoint = this.screenToMap(point);
        return this.getTileByID(mapPoint);
    }

    getTileByID = (id) => {
        // id: {x,y}
        if(id.x < 0 || id.y < 0){
            return null;
        }
        return this.tiles[id.x + id.y * this.size.y];
    }

    isInMap = (point) => {
        // Checks if a point can exist in the grid based on the grid's size
        // Converts the point into a map point (id)
        let mapPoint = this.screenToMap(point);
        if(mapPoint.x < 0 || mapPoint.x >= this.size.x){
            return false;
        }
        else if(mapPoint.y < 0 || mapPoint.y >= this.size.y){
            return false;
        }
        return true;
    }

    mapToScreen = (point) => {
        // Edit point to follow origin
        let screen = {};
        // screen.x = (map.x - map.y) * TILE_WIDTH_HALF;
        // Account for shift in map, due to origin
        screen.x = (point.x - point.y) * this.tileSize.halfWidth;
        screen.x += this.origin.x;
        // screen.y = (map.x + map.y) * TILE_HEIGHT_HALF;
        screen.y = (point.x + point.y) * this.tileSize.halfHeight;
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
        // map.x = screen.x / TILE_WIDTH + screen.y / TILE_HEIGHT;
        map.x = screenPoint.x / this.tileSize.width + screenPoint.y / this.tileSize.height;
        map.x = Math.floor(map.x);
        // map.y = screen.y / TILE_HEIGHT - screen.x / TILE_WIDTH;
        map.y = screenPoint.y / this.tileSize.height - screenPoint.x / this.tileSize.width;
        map.y = Math.floor(map.y);
        // console.log(`ScreenToMap  ${map.x},${map.y}`); //--------------------------x:${screenPoint.x} y:${screenPoint.y} -->
        return map;
    }
}