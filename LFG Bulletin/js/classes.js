class Post extends PIXI.Sprite{
    constructor(x = 0, y = 0){
        super(app.loader.resources["images/post.png"].texture);
        this.anchor.set(.5,.5)
        this.x = x;
        this.y = y;
    }
}