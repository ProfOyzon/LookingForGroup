/*
Decoration Menu:
Author: Thomas Martinez
Summary: Creates a horizontal scrolling menu across the bottom of a container.

To install PixiJS UI run: "npm install @pixi/ui" in a terminal
it should be installed in addition to regular PixiJS.
*/

import * as PIXI from "pixi.js";
import { ScrollBox, Button } from "@pixi/ui";

const arrowTexture = await PIXI.Assets.load('images/arrow.png');

let LEFT_RIGHT_MARGINS;
let MENU_WIDTH;
let MENU_HEIGHT;
let ITEM_PADDING;
let FILTER_BAR_HEIGHT;
const BG_COLOR = 0X393E40;
const FORE_COLOR = 0XD9D9D9;
const DISABLED_COLOR = 0X898B8C;

let decorationMenuContainer;
let scrollBox;
let currentItemCount;
let scrollMaxPosition;

let moveTicker;
let buttonEnabledTicker;
// the duration of the movement when arrow is clicked
let BUTTON_MOVE_MS;
// the number of box spaces scrolled by clicking arrow
let SCROLL_COUNT;

let menuOpen = true;

let currentFilter = "All";

export const createDecorationMenu = (container, margins, height, padding, scrollMS, scrollCount) => {
    LEFT_RIGHT_MARGINS = margins;
    MENU_WIDTH = container.width;
    MENU_HEIGHT = height;
    ITEM_PADDING = padding;
    FILTER_BAR_HEIGHT = height * 0.2;
    BUTTON_MOVE_MS = scrollMS;
    SCROLL_COUNT = scrollCount;

    // number of filler items
    currentItemCount = 40;

    // Create moveTicker
    moveTicker = new PIXI.Ticker();
    moveTicker.autoStart = false;
    moveTicker.stop();
    buttonEnabledTicker = new PIXI.Ticker();
    
    decorationMenuContainer = new PIXI.Container({
        x: 0,
        y: container.height - MENU_HEIGHT,
        width: MENU_WIDTH,
        height: MENU_HEIGHT,
    });

    let menuBackground = new PIXI.Graphics().rect(0, 0, MENU_WIDTH, MENU_HEIGHT).fill(BG_COLOR);
    decorationMenuContainer.addChild(menuBackground);

    container.addChild(decorationMenuContainer);

    let scrollBoxContainer = new PIXI.Container({
        x: LEFT_RIGHT_MARGINS,
        width: MENU_WIDTH - LEFT_RIGHT_MARGINS,
        height: MENU_HEIGHT,
    });

    scrollBox = createScrollBox(container);
    loadScrollBoxTextures(scrollBox);

    scrollBoxContainer.addChild(scrollBox);

    decorationMenuContainer.addChild(scrollBoxContainer);

    createButtons();

    createFilterBar();

    createClosePanelButton();
}

const createScrollBox = (container) => {
    return new ScrollBox({
        background: BG_COLOR,
        width: MENU_WIDTH - LEFT_RIGHT_MARGINS*2,
        height: MENU_HEIGHT,
        padding: ITEM_PADDING,
        elementsMargin: ITEM_PADDING,
        type: 'horizontal',
        globalScroll: false,
    });
}

const loadScrollBoxTextures = async (scrollBox) => {
    let textures = [
        await PIXI.Assets.load('images/fire.png'),
        await PIXI.Assets.load('images/plant.png'),
        await PIXI.Assets.load('images/stool.png'),
    ];

    for (let i = 0; i < currentItemCount; i++) {
        addSprite(scrollBox, textures[i % textures.length]);
    }

    scrollMaxPosition = (currentItemCount * MENU_HEIGHT) - scrollBox.width;
    console.log('set scrollMaxPosition: ' + scrollMaxPosition);
}

// adds sprite to a scrollbox
const addSprite = (scrollBox, textureUrl) => {
    let squareSide = MENU_HEIGHT - (ITEM_PADDING * 2);
    let container = new PIXI.Container({
        width: squareSide,
        height: squareSide,
    })

    let background = new PIXI.Graphics().roundRect(0, 0, squareSide, squareSide, ITEM_PADDING * 1.5).fill(FORE_COLOR);
    container.addChild(background);

    let sprite = PIXI.Sprite.from(textureUrl)
    sprite.width = squareSide;
    sprite.height = squareSide;
    container.addChild(sprite);

    scrollBox.addItem(container);
}

const createButtons = async () => {

    const rightArrow = new PIXI.Sprite({
        texture: arrowTexture,
        anchor: 0.5,
        width: MENU_HEIGHT / 2,
        height: MENU_HEIGHT / 2,
        x: MENU_WIDTH - LEFT_RIGHT_MARGINS/2,
        y: MENU_HEIGHT / 2,
        tint: FORE_COLOR
    });

    const leftArrow = new PIXI.Sprite({
        texture: arrowTexture,
        anchor: 0.5,
        width: MENU_HEIGHT / 2,
        height: MENU_HEIGHT / 2,
        x: (LEFT_RIGHT_MARGINS/2),
        y: MENU_HEIGHT / 2,
        rotation: Math.PI,
        tint: FORE_COLOR
    });

    const rightButton = new Button( rightArrow );
    const leftButton = new Button( leftArrow );

    rightButton.onPress.connect(() => scroll(-MENU_HEIGHT * SCROLL_COUNT));
    leftButton.onPress.connect(() => scroll(MENU_HEIGHT * SCROLL_COUNT));
    
    decorationMenuContainer.addChild(rightButton.view);
    decorationMenuContainer.addChild(leftButton.view);

    // update button enabled status based on scroll position
    buttonEnabledTicker.add(() => {
        if (scrollBox.scrollX > -ITEM_PADDING) {
            //console.log('LEFT BUTTON DISABLED');
            leftButton.enabled = false;
            leftArrow.tint = DISABLED_COLOR;
        } else {
            //console.log('LEFT BUTTON ENABLED');
            leftButton.enabled = true;
            leftArrow.tint = FORE_COLOR;
        }
        if (scrollBox.scrollX < -scrollMaxPosition) {
            //console.log('RIGHT BUTTON DISABLED');
            rightButton.enabled = false;
            rightArrow.tint = DISABLED_COLOR;
        } else {
            //console.log('RIGHT BUTTON ENABLED');
            rightButton.enabled = true;
            rightArrow.tint = FORE_COLOR;
        }
    });
    buttonEnabledTicker.start();
}

const scroll = (distance) => {
    let scrollDistance = distance;
    let projectedFinalPos = scrollBox.scrollX + distance;

    console.log("start scrollX: " + scrollBox.scrollX);
    console.log("distance: " + distance);
    console.log("projectedFinalPos: " + projectedFinalPos);
    console.log("scrollMaxPosition: " + scrollMaxPosition);

    //console.log("projectedFinalPos > 0: " + (projectedFinalPos > 0));
    console.log('projectedFinalPos < scrollMaxPosition: ' + (projectedFinalPos < scrollMaxPosition));
    if (projectedFinalPos > 0) { // WORKS
        scrollDistance = -scrollBox.scrollX;
    }
    else if (projectedFinalPos < -scrollMaxPosition) { // DOES NOT WORK
        scrollDistance = -scrollMaxPosition - scrollBox.scrollX;
    }
    console.log("moving: " + scrollDistance);

    const moveScrollBar = (deltaTime) =>
    {
        let distancePerTick = (scrollDistance / BUTTON_MOVE_MS) * moveTicker.elapsedMS;
        //console.log(`moved: ${distancePerTick} `);
        scrollBox.scrollX += distancePerTick;
    }

    // start movement
    moveTicker.add(moveScrollBar);
    moveTicker.start();
    //console.log("start moveTicker");

    // stop movement after x milliseconds
    setTimeout(() => {
        moveTicker.stop();
        moveTicker.remove(moveScrollBar);
        //console.log("stop moveTicker");
        console.log("end scrollX: " + scrollBox.scrollX);
        console.log("---------------------------------------------------" );
    }, BUTTON_MOVE_MS); 
}

const createFilterBar = () => {

    // create container
    let filterBarContainer = new PIXI.Container({
        width: MENU_WIDTH,
        height: FILTER_BAR_HEIGHT,
        x: 0,
        y: -FILTER_BAR_HEIGHT,
    });

    // add background
    let filterBarBG = new PIXI.Graphics().rect(0, 0, MENU_WIDTH, FILTER_BAR_HEIGHT).fill(BG_COLOR);
    filterBarContainer.addChild(filterBarBG);

    // create filter buttons
    const categories = ["All", "Floor", "Ceiling", "Wall"];

    let distance = 0;
    for (let i = 0; i < categories.length; i++) {

        let color = (currentFilter === categories[i]) ? FORE_COLOR : DISABLED_COLOR;
        const style = new PIXI.TextStyle({
            fill: { color }
        });

        // create text
        let text = new PIXI.Text({
            text: categories[i],
            x: (ITEM_PADDING * 2 * (i+1)) + distance,
            y: 0,
            style
        });

        distance += text.width;

        // create button
        const button = new Button(text);
        button.onPress.connect(() => changeFilter(filterBarContainer, categories[i]));

        // add button to bar
        filterBarContainer.addChild(text);
    }

    // add filter to interface
    decorationMenuContainer.addChild(filterBarContainer);
}

const changeFilter = (filterBar, newFilter) => {
    if (currentFilter !== newFilter) {
        currentFilter = newFilter;
        while(filterBar.children[0]) { 
            filterBar.removeChild(filterBar.children[0]);
        }
        createFilterBar();
    }
}

const createClosePanelButton = () => {
    const btnWid = 100;
    const btnHgt = 30;

    // Create a container for the button
    let openCloseButtonContainer = new PIXI.Container({
        width: btnWid,
        height: btnHgt,
        x: LEFT_RIGHT_MARGINS / 4, //(MENU_WIDTH) / 2,
        y: -(btnHgt + FILTER_BAR_HEIGHT),
    });

    // Create the background for the button
    let buttonPadding = ITEM_PADDING * 2;
    let openCloseButtonContainerBG = new PIXI.Graphics()
        .moveTo(buttonPadding, 0)
        .lineTo(btnWid - (2*buttonPadding), 0)
        .arcTo(btnWid, 0, btnWid, btnHgt, buttonPadding)
        .lineTo(btnWid,btnHgt)
        .lineTo(0,btnHgt)
        .arcTo(0, 0, buttonPadding, 0, buttonPadding)
        .fill(BG_COLOR);
    openCloseButtonContainer.addChild(openCloseButtonContainerBG);

    // Create the arrow sprite
    const arrow = new PIXI.Sprite({
        texture: arrowTexture,
        anchor: (0.5),
        width: btnHgt,
        height: btnHgt,
        x: btnWid / 2,
        y: btnHgt / 2,
        rotation: Math.PI / 2, // Rotate the arrow 270 degrees
        tint: FORE_COLOR,
    })

    openCloseButtonContainer.addChild(arrow);

    // Create the button
    const openCloseButton = new Button(openCloseButtonContainer);
    openCloseButton.onPress.connect(() => toggleMenu(arrow));

    decorationMenuContainer.addChild(openCloseButtonContainer);
};

const toggleMenu = (sprite) => {
    //console.log("toggleMenu: menuOpen = " + menuOpen);

    if (menuOpen) {
        //console.log("Closing Menu");
        //sprite.rotation = Math.PI * 1.5;

        decorationMenuContainer.y += MENU_HEIGHT + FILTER_BAR_HEIGHT;
    }
    else {
        //console.log("Opening Menu");
        //sprite.rotation = Math.PI / 2;

        decorationMenuContainer.y -= MENU_HEIGHT + FILTER_BAR_HEIGHT;
    }

    sprite.rotation += Math.PI;

    /*/ this code for an animated open and closing of the menu works but always puts the menu in a different position.
    It is supposed to run after the above if/else is completed instead of using "decorationMenuContainer.y = ".
    const moveMenuAnimated = (deltaTime) =>
    {
        let distancePerTick = (MENU_HEIGHT / BUTTON_MOVE_MS) * moveTicker.elapsedMS;
        decorationMenuContainer.y += menuOpen ? -distancePerTick : distancePerTick;
    }
    moveTicker.add(moveMenuAnimated);
    moveTicker.start();

    // stop movement after x milliseconds
    setTimeout(() => {
        moveTicker.stop();
        moveTicker.remove(moveMenu);
    }, BUTTON_MOVE_MS); 
    //*/

    menuOpen = !menuOpen;
}