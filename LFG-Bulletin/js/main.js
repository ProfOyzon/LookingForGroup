// We will use `strict mode`, which helps us by having the browser catch many common JS mistakes
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode
"use strict";
const app = new PIXI.Application({
    width: 1200,
    height: 800,
    backgroundColor: 0xC7B99E
});
document.body.appendChild(app.view);

app.loader.add(["images/post1.png", "images/post2.png", "images/post3.png", "images/button.png", "images/trash.png"]);

// constants
const sceneWidth = app.view.width;
const sceneHeight = app.view.height;

//aliases
let stage;
let dragTarget = null;
let postTextures = [new PIXI.Texture(PIXI.BaseTexture.from("images/post1.png")), new PIXI.Texture(PIXI.BaseTexture.from("images/post2.png")), new PIXI.Texture(PIXI.BaseTexture.from("images/post3.png"))];
let buttonTexture = new PIXI.Texture(PIXI.BaseTexture.from("images/button.png"));
let trashTexture = new PIXI.Texture(PIXI.BaseTexture.from("images/trash.png"));
let trash;
let postButton;
let textStyle = new PIXI.TextStyle(    
{
    font: '12px Arial',
    fill: 0x000000,
    height: 7,
    width: 10,
    wordWrap: true,
    wordWrapWidth: 200
    //maxWidth: 200
});

//game variables
let posts = [];
let postGrabbed = false;

//Sets up the game by making all of the scenes, making the buttons, and starting the loop
function setup()
{
    stage = app.stage;
    //Create the labels
    createLabelsAndButtons();

    for(let p of posts)
    {
        stage.addChild(p);
    }

    //Set up the trash can
    trash = new PIXI.Sprite(trashTexture);
    stage.addChild(trash);
    trash.x = 1110;
    trash.y = 690;

    //Set the game loop
    app.ticker.add(gameLoop);


    //test
    //editText();
}

//The primary loop of the game
function gameLoop()
{
    //Have the player succumb to gravity
    let dt = 1/app.ticker.FPS;
    if (dt > 1/12) dt=1/12;
}

//Makes the labels and buttons that will be used on the start, win, and loss screens
function createLabelsAndButtons()
{

    let buttonStyle = new PIXI.TextStyle({
        fill: 0xFF0000,
        fontSize: 48,
        fontFamily: "Arial"
    });
    postButton = new PIXI.Text("Make a Post");
    postButton.style = buttonStyle;
    postButton.x = 910;
    postButton.y = 0;
    postButton.interactive = true;
    postButton.buttonMode = true;
    postButton.on("pointerup", makePost); //startGame is a funtion reference
    postButton.on('pointerover', e => e.target.alpha = 0.7);
    postButton.on('pointerout', e => e.currentTarget.alpha = 1.0);
    stage.addChild(postButton);
}

//Makes a post
function makePost()
{
    const post = new PIXI.Sprite(postTextures[Math.floor(Math.random() * 3)]);
    post.x = 100;
    post.y = 100;
    post.interactive = true;
    post.buttonMode = true;
    post.eventMode = 'static';
    post.cursor = 'pointer';
    post.anchor.set(0.5);
    post
    .on('pointerdown', onDragStart, post)
    .on('pointerup', onDragEnd)
    .on('pointerupoutside', onDragEnd)
    .on('pointermove', onDragMove);
    let text = new PIXI.Text('Click to edit...', textStyle);
    text.anchor.set(0.5);
    text.scale.set(.75);
    text.interactive = true;
    text.buttonMode = true;
    text.eventMode = 'static';
    text.cursor = 'pointer';
    text.on('pointerdown', editText);
    post.addChild(text);
    posts.push(post);
    stage.addChild(post);
}

function editText()
{
    //Make a text input at the bottom of the screen
    let text = this;
    let mousePosition = app.renderer.plugins.interaction.mouse.global;

    var input = document.createElement("input");
    input.style.position = "absolute";
    input.style.left = (mousePosition.x - 75).toString() + "px";
    input.style.top = mousePosition.y.toString() + "px";
    input.type = "text";
    input.value = text.text;
    document.body.appendChild(input);
    //Disable interaction
    for(let p of posts){
        p.interactive = false;
        p.buttonMode = false;
        p.interactiveChildren = false;
    }
    postButton.interactive = false;
    postButton.buttonMode = false;
    //Make a confirmation button
    let button = new PIXI.Sprite(buttonTexture);
    button.alpha = 0.5;
    button.interactive = true;
    button.buttonMode = true;
    button.eventMode = 'static';
    button.cursor = 'pointer';
    //When the button is clicked, change the text value and reenable interaction
    button.on('pointerdown', function(e) { 
        text.text = input.value;
        text.style = textStyle;
        stage.removeChild(this);
        input.remove();
        for(let p of posts){
            p.interactive = true;
            p.buttonMode = true;
            p.interactiveChildren = true;
        }
        postButton.interactive = true;
        postButton.buttonMode = true;
    });
    stage.addChild(button);
}

function change(postText, inputText)
{
    postText = inputText;
}

app.stage.eventMode = 'static';
app.stage.hitArea = app.screen;
app.stage.on('pointerup', onDragEnd);
app.stage.on('pointerupoutside', onDragEnd);

function onDragMove(event)
{
    if (dragTarget)
    {
        let mousePosition = app.renderer.plugins.interaction.mouse.global;
        dragTarget.position = mousePosition;
    }
}

function onDragStart()
{
    dragTarget = this;
    this.alpha = 0.5;
    stage.on('pointermove', onDragMove);
}

function onDragEnd()
{
    if (dragTarget)
    {
        stage.off('pointermove', onDragMove);
        dragTarget.alpha = 1;
        if(rectsIntersect(dragTarget, trash)){
            stage.removeChild(dragTarget);
        }
        dragTarget = null;
    }
}

app.loader.onProgress.add(e => { console.log(`progress=${e.progress}`) });
app.loader.onComplete.add(setup);
app.loader.load();