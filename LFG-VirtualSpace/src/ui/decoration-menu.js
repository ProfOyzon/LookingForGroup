// Thomas Martinez
// Menu for accessing decoration items in virtual space

import {Container, Graphics, Assets, Sprite, Text, TextStyle, Ticker} from "pixi.js";
import { HorizontalScrollBox } from "./scroll-box.js";
import { DecorationMenuItem } from "./decoration-menu-item.js";
import { Button } from "@pixi/ui";

const arrowTexture = await Assets.load('assets/images/ui/arrow.png');
const trashcanTexture = await Assets.load('assets/images/ui/trashcan.png');

const colors = {
    BG_COLOR: 0X393E40,
    FORE_COLOR: 0XD9D9D9,
    DISABLED_COLOR: 0X898B8C,
};

const categories = ["All", "Floor", "Ceiling", "Wall"];

export class DecorationMenu {
    constructor({app, parent, margins, height, padding, scrollMS, scrollCount}) {
        this.parent = parent;
        this.LEFT_RIGHT_MARGINS = margins;
        this.FILTER_BAR_TEXT_SIZE = 2;
        this.FILTER_BAR_HEIGHT = height * 0.3;
        this.MENU_WIDTH = app.screen.width; //parent.width;
        this.MENU_HEIGHT = height + this.FILTER_BAR_HEIGHT;
        this.SCROLL_BOX_WIDTH = this.MENU_WIDTH - (2 * this.LEFT_RIGHT_MARGINS);
        this.SCROLL_BOX_HEIGHT = height;
        this.ITEM_PADDING = padding;
        this.BUTTON_MOVE_MS = scrollMS;
        this.SCROLL_COUNT = scrollCount;

        this.inSlider = false;

        // Create this.animationTicker
        this.animationTicker = new Ticker();
        this.animationTicker.autoStart = false;
        this.animationTicker.stop();
        this.buttonEnabledTicker = new Ticker();

        // display settings
        this.menuOpen = true;
        this.currentFilter = "All";

        // container to hold this menu
        this.decorationMenuContainer = new Container({
            x: 0, // TODO: Make it work for any container, refer to world hierarchy
            y: app.screen.height - this.MENU_HEIGHT, // parent.height
            width: this.MENU_WIDTH,
            height: this.MENU_HEIGHT,
            eventMode: 'static'
        });

        // background for entire menu
        let menuBackground = new Graphics().rect(0, 0, this.MENU_WIDTH, this.MENU_HEIGHT).fill(colors.BG_COLOR);
        this.decorationMenuContainer.addChild(menuBackground);
        this.decorationMenuContainer.on('mouseover', ()=>{
            // console.log('inside');
            this.inSlider = true;
        });
        this.decorationMenuContainer.on('mouseout', ()=>{
            // console.log('out');
            this.inSlider = false;
        });

    
        this.scrollBox = new HorizontalScrollBox({
            app: app,
            parent: this.decorationMenuContainer,
            x: this.LEFT_RIGHT_MARGINS,
            y: this.FILTER_BAR_HEIGHT,
            width: this.SCROLL_BOX_WIDTH,
            height: this.SCROLL_BOX_HEIGHT,
            item_padding: this.ITEM_PADDING,
            colors: colors,
        });

        // populate scrollBox
        //loadScrollBoxTextures(scrollBox);

        this.createButtons();
    
        this.createFilterBar();
    
        this.createClosePanelButton();

        this.loadScrollBoxTextures();

        this.createDeleteUI();

        parent.addChild(this.decorationMenuContainer);
    }

    createButtons = async () => {
        const rightArrow = new Sprite({
            texture: arrowTexture,
            anchor: 0.5,
            width: this.SCROLL_BOX_HEIGHT / 2,
            height: this.SCROLL_BOX_HEIGHT / 2,
            x: this.MENU_WIDTH - this.LEFT_RIGHT_MARGINS/2,
            y: this.SCROLL_BOX_HEIGHT / 2 + this.FILTER_BAR_HEIGHT,
            tint: colors.FORE_COLOR
        });
    
        const leftArrow = new Sprite({
            texture: arrowTexture,
            anchor: 0.5,
            width: this.SCROLL_BOX_HEIGHT / 2,
            height: this.SCROLL_BOX_HEIGHT / 2,
            x: (this.LEFT_RIGHT_MARGINS/2),
            y: this.SCROLL_BOX_HEIGHT / 2 + this.FILTER_BAR_HEIGHT,
            rotation: Math.PI,
            tint: colors.FORE_COLOR
        });

        const rightButton = new Button( rightArrow );
        const leftButton = new Button( leftArrow );

        rightButton.onPress.connect(() => this.scroll(-this.MENU_HEIGHT * this.SCROLL_COUNT));
        leftButton.onPress.connect(() => this.scroll(this.MENU_HEIGHT * this.SCROLL_COUNT));

        this.decorationMenuContainer.addChild(rightArrow);
        this.decorationMenuContainer.addChild(leftArrow);

        // update button enabled status based on scroll position
        this.buttonEnabledTicker.add(() => {
            // left button
            if (this.scrollBox.itemsContainer.position.x === 0) {
                //console.log('LEFT BUTTON DISABLED');
                leftButton.enabled = false;
                leftArrow.tint = colors.DISABLED_COLOR;
            } else {
                //console.log('LEFT BUTTON ENABLED');
                leftButton.enabled = true;
                leftArrow.tint = colors.FORE_COLOR;
            }
            // right button
            if (this.scrollBox.itemsContainer.position.x < -this.scrollBox.maxDistance + this.ITEM_PADDING) {
                //console.log('RIGHT BUTTON DISABLED');
                rightButton.enabled = false;
                rightArrow.tint = colors.DISABLED_COLOR;
            } else {
                //console.log('RIGHT BUTTON ENABLED');
                rightButton.enabled = true;
                rightArrow.tint = colors.FORE_COLOR;
            }
        });
        this.buttonEnabledTicker.start();
    }

    scroll = (scrollDistance) => {
        console.log(`scrolling: ${Math.abs(scrollDistance)} ${scrollDistance > 0 ? "left" : "right"}`);
    
        const moveScrollBar = (deltaTime) =>
        {
            let distancePerTick = (scrollDistance / this.BUTTON_MOVE_MS) * this.animationTicker.elapsedMS;
            //console.log(`moved: ${distancePerTick} `);
            this.scrollBox.scroll(distancePerTick);
        }
    
        // start movement
        this.animationTicker.add(moveScrollBar);
        this.animationTicker.start();
        //console.log("start this.animationTicker");
    
        // stop movement after x milliseconds
        setTimeout(() => {
            this.animationTicker.stop();
            this.animationTicker.remove(moveScrollBar);
        }, this.BUTTON_MOVE_MS); 
    }

    // FILTER BAR
    createFilterBar = () => {
        // create container
        let filterBarContainer = new Container({
            width: this.MENU_WIDTH,
            height: this.FILTER_BAR_HEIGHT,
        });
    
        // create filter buttons
    
        let distance = 0;
        for (let i = 0; i < categories.length; i++) {
    
            let color = (this.currentFilter === categories[i]) ? colors.FORE_COLOR : colors.DISABLED_COLOR;
            const style = new TextStyle({
                fill: { color }
            });
    
            // create text
            let text = new Text({
                text: categories[i],
                x: (this.ITEM_PADDING * 2 * (i+1)) + distance,
                y: 0,
                style
            });
    
            distance += text.width;
    
            // create button
            const button = new Button(text);
            button.onPress.connect(() => this.changeFilter(filterBarContainer, categories[i]));
    
            // add button to bar
            filterBarContainer.addChild(text);
        }
    
        // add filter to interface
        this.decorationMenuContainer.addChild(filterBarContainer);
    }
    
    changeFilter = (filterBar, newFilter) => {
        if (this.currentFilter !== newFilter) {
            this.currentFilter = newFilter;
            while(filterBar.children[0]) { 
                filterBar.removeChild(filterBar.children[0]);
            }
            this.createFilterBar();
        }
    }

    createClosePanelButton = () => {
        const btnWid = 100;
        const btnHgt = 30;
    
        // Create a container for the button
        let openCloseButtonContainer = new Container({
            width: btnWid,
            height: btnHgt,
            x: this.LEFT_RIGHT_MARGINS / 4, //(this.MENU_WIDTH) / 2,
            y: -btnHgt,
        });
    
        // Create the background for the button
        let buttonPadding = this.ITEM_PADDING * 2;
        let openCloseButtonContainerBG = new Graphics()
            .moveTo(buttonPadding, 0)
            .lineTo(btnWid - (2*buttonPadding), 0)
            .arcTo(btnWid, 0, btnWid, btnHgt, buttonPadding)
            .lineTo(btnWid,btnHgt)
            .lineTo(0,btnHgt)
            .arcTo(0, 0, buttonPadding, 0, buttonPadding)
            .fill(colors.BG_COLOR);
        openCloseButtonContainer.addChild(openCloseButtonContainerBG);
    
        // Create the arrow sprite
        const arrow = new Sprite({
            texture: arrowTexture,
            anchor: (0.5),
            width: btnHgt,
            height: btnHgt,
            x: btnWid / 2,
            y: btnHgt / 2,
            rotation: Math.PI / 2, // Rotate the arrow 270 degrees
            tint: colors.FORE_COLOR,
        })
    
        openCloseButtonContainer.addChild(arrow);
    
        // Create the button
        const openCloseButton = new Button(openCloseButtonContainer);
        openCloseButton.onPress.connect(() => this.toggleMenu(arrow));
    
        this.decorationMenuContainer.addChild(openCloseButtonContainer);
    };
    
    toggleMenu = (sprite) => {
        //console.log("toggleMenu: menuOpen = " + menuOpen);
    
        if (this.menuOpen) {
            //console.log("Closing Menu");
            //sprite.rotation = Math.PI * 1.5;
    
            this.decorationMenuContainer.y += this.MENU_HEIGHT;
        }
        else {
            //console.log("Opening Menu");
            //sprite.rotation = Math.PI / 2;
    
            this.decorationMenuContainer.y -= this.MENU_HEIGHT;
        }
    
        sprite.rotation += Math.PI;
    
        /*/ this code for an animated open and closing of the menu works but always puts the menu in a different position.
        It is supposed to run after the above if/else is completed instead of using "decorationMenuContainer.y = ".
        const moveMenuAnimated = (deltaTime) =>
        {
            let distancePerTick = (MENU_HEIGHT / BUTTON_MOVE_MS) * this.animationTicker.elapsedMS;
            decorationMenuContainer.y += menuOpen ? -distancePerTick : distancePerTick;
        }
        this.animationTicker.add(moveMenuAnimated);
        this.animationTicker.start();
    
        // stop movement after x milliseconds
        setTimeout(() => {
            this.animationTicker.stop();
            this.animationTicker.remove(moveMenu);
        }, BUTTON_MOVE_MS); 
        //*/
    
        this.menuOpen = !this.menuOpen;
    }

    createDeleteUI = () => {
        this.deleteOverlayUI = new Container({
            width: this.MENU_WIDTH,
            height: this.MENU_HEIGHT,
            visible: false
        });
        let bg = new Graphics({alpha: 0.6}).rect(0,0,this.MENU_WIDTH,this.MENU_HEIGHT).fill(0x000000);
        this.deleteOverlayUI.addChild(bg);
        let trashcan = new Sprite({
            texture: trashcanTexture,
            anchor: 0.5,
            x: this.MENU_WIDTH / 2,
            y: this.MENU_HEIGHT / 2,
            width: this.MENU_HEIGHT * 0.64,
            height: this.MENU_HEIGHT * 0.64,
            tint: colors.FORE_COLOR
        });
        this.deleteOverlayUI.addChild(trashcan);
        this.decorationMenuContainer.addChild(this.deleteOverlayUI);
    }

    showDeleteUI = () => {
        this.deleteOverlayUI.visible = true;
        //animateOpacity(0.6, true);
        //this.deleteOverlayUI.alpha = 0.6;
    }

    hideDeleteUI = () => {
        this.deleteOverlayUI.visible = false;
        //animateOpacity(-0.6, false);
        //this.deleteOverlayUI.alpha = 0;
    }

    animateOpacity = (opacityChange, visibility) => {
        this.deleteOverlayUI.visible = false;

        const animateOpacity = (deltaTime) =>
        {
            let opacityPerTick = (opacityChange / this.BUTTON_MOVE_MS) * this.animationTicker.elapsedMS;
            decorationMenuContainer.y += opacityPerTick;
        }
        this.animationTicker.add(animateOpacity);
        this.animationTicker.start();
    
        // stop movement after x milliseconds
        setTimeout(() => {
            this.animationTicker.stop();
            this.animationTicker.remove(animateOpacity);
            this.deleteOverlayUI.visible = visibility;
        }, this.BUTTON_MOVE_MS);
    }

    loadScrollBoxTextures = async () => {
        this.textures = [
            await Assets.load('assets/images/cozy/blankets-cozy.png'),
            await Assets.load('assets/images/cozy/lamp-cozy-v2.png'),
            await Assets.load('assets/images/cozy/plant-cozy.png'),
        ];
    
        for (let i = 0; i < 20; i++) {
            let decorationMenuItem = new DecorationMenuItem({
                textureUrl: this.textures[i % this.textures.length],
                sideLength: this.SCROLL_BOX_HEIGHT,
                padding: this.ITEM_PADDING,
                colors: colors,
            });
            this.scrollBox.addItem(decorationMenuItem.menuItem);
        }
    }
}