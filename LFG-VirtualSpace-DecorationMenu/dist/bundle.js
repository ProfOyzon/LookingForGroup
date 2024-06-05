/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/decoration-menu.js":
/*!********************************!*\
  !*** ./src/decoration-menu.js ***!
  \********************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   createDecorationMenu: () => (/* binding */ createDecorationMenu)\n/* harmony export */ });\n/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ \"./node_modules/pixi.js/lib/index.mjs\");\n/* harmony import */ var _pixi_ui__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @pixi/ui */ \"./node_modules/@pixi/ui/lib/index.mjs\");\n/*\r\nDecoration Menu:\r\nAuthor: Thomas Martinez\r\nSummary: Creates a horizontal scrolling menu across the bottom of a container.\r\n\r\nTo install PixiJS UI run: \"npm install @pixi/ui\" in a terminal\r\nit should be installed in addition to regular PixiJS.\r\n*/\r\n\r\n\r\n\r\n\r\nconst arrowTexture = await pixi_js__WEBPACK_IMPORTED_MODULE_0__.Assets.load('images/arrow.png');\r\n\r\nlet LEFT_RIGHT_MARGINS;\r\nlet MENU_WIDTH;\r\nlet MENU_HEIGHT;\r\nlet ITEM_PADDING;\r\nlet FILTER_BAR_HEIGHT;\r\nconst BG_COLOR = 0X393E40;\r\nconst FORE_COLOR = 0XD9D9D9;\r\nconst DISABLED_COLOR = 0X898B8C;\r\n\r\nlet decorationMenuContainer;\r\nlet scrollBox;\r\nlet currentItemCount;\r\nlet scrollMaxPosition;\r\n\r\nlet moveTicker;\r\nlet buttonEnabledTicker;\r\n// the duration of the movement when arrow is clicked\r\nlet BUTTON_MOVE_MS;\r\n// the number of box spaces scrolled by clicking arrow\r\nlet SCROLL_COUNT;\r\n\r\nlet menuOpen = true;\r\n\r\nlet currentFilter = \"All\";\r\n\r\nconst createDecorationMenu = (container, margins, height, padding, scrollMS, scrollCount) => {\r\n    LEFT_RIGHT_MARGINS = margins;\r\n    MENU_WIDTH = container.width;\r\n    MENU_HEIGHT = height;\r\n    ITEM_PADDING = padding;\r\n    FILTER_BAR_HEIGHT = height * 0.2;\r\n    BUTTON_MOVE_MS = scrollMS;\r\n    SCROLL_COUNT = scrollCount;\r\n\r\n    // number of filler items\r\n    currentItemCount = 40;\r\n\r\n    // Create moveTicker\r\n    moveTicker = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Ticker();\r\n    moveTicker.autoStart = false;\r\n    moveTicker.stop();\r\n    buttonEnabledTicker = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Ticker();\r\n    \r\n    decorationMenuContainer = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container({\r\n        x: 0,\r\n        y: container.height - MENU_HEIGHT,\r\n        width: MENU_WIDTH,\r\n        height: MENU_HEIGHT,\r\n    });\r\n\r\n    let menuBackground = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics().rect(0, 0, MENU_WIDTH, MENU_HEIGHT).fill(BG_COLOR);\r\n    decorationMenuContainer.addChild(menuBackground);\r\n\r\n    container.addChild(decorationMenuContainer);\r\n\r\n    let scrollBoxContainer = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container({\r\n        x: LEFT_RIGHT_MARGINS,\r\n        width: MENU_WIDTH - LEFT_RIGHT_MARGINS,\r\n        height: MENU_HEIGHT,\r\n    });\r\n\r\n    scrollBox = createScrollBox(container);\r\n    loadScrollBoxTextures(scrollBox);\r\n\r\n    scrollBoxContainer.addChild(scrollBox);\r\n\r\n    decorationMenuContainer.addChild(scrollBoxContainer);\r\n\r\n    createButtons();\r\n\r\n    createFilterBar();\r\n\r\n    createClosePanelButton();\r\n}\r\n\r\nconst createScrollBox = (container) => {\r\n    return new _pixi_ui__WEBPACK_IMPORTED_MODULE_1__.ScrollBox({\r\n        background: BG_COLOR,\r\n        width: MENU_WIDTH - LEFT_RIGHT_MARGINS*2,\r\n        height: MENU_HEIGHT,\r\n        padding: ITEM_PADDING,\r\n        elementsMargin: ITEM_PADDING,\r\n        type: 'horizontal',\r\n        globalScroll: false,\r\n    });\r\n}\r\n\r\nconst loadScrollBoxTextures = async (scrollBox) => {\r\n    let textures = [\r\n        await pixi_js__WEBPACK_IMPORTED_MODULE_0__.Assets.load('images/fire.png'),\r\n        await pixi_js__WEBPACK_IMPORTED_MODULE_0__.Assets.load('images/plant.png'),\r\n        await pixi_js__WEBPACK_IMPORTED_MODULE_0__.Assets.load('images/stool.png'),\r\n    ];\r\n\r\n    for (let i = 0; i < currentItemCount; i++) {\r\n        addSprite(scrollBox, textures[i % textures.length]);\r\n    }\r\n\r\n    scrollMaxPosition = (currentItemCount * MENU_HEIGHT) - scrollBox.width;\r\n}\r\n\r\n// adds sprite to a scrollbox\r\nconst addSprite = (scrollBox, textureUrl) => {\r\n    let squareSide = MENU_HEIGHT - (ITEM_PADDING * 2);\r\n    let container = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container({\r\n        width: squareSide,\r\n        height: squareSide,\r\n    })\r\n\r\n    let background = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics().roundRect(0, 0, squareSide, squareSide, ITEM_PADDING * 1.5).fill(FORE_COLOR);\r\n    container.addChild(background);\r\n\r\n    let sprite = pixi_js__WEBPACK_IMPORTED_MODULE_0__.Sprite.from(textureUrl)\r\n    sprite.width = squareSide;\r\n    sprite.height = squareSide;\r\n    container.addChild(sprite);\r\n\r\n    scrollBox.addItem(container);\r\n}\r\n\r\nconst createButtons = async () => {\r\n\r\n    const rightArrow = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Sprite({\r\n        texture: arrowTexture,\r\n        anchor: 0.5,\r\n        width: MENU_HEIGHT / 2,\r\n        height: MENU_HEIGHT / 2,\r\n        x: MENU_WIDTH - LEFT_RIGHT_MARGINS/2,\r\n        y: MENU_HEIGHT / 2,\r\n        tint: FORE_COLOR\r\n    });\r\n\r\n    const leftArrow = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Sprite({\r\n        texture: arrowTexture,\r\n        anchor: 0.5,\r\n        width: MENU_HEIGHT / 2,\r\n        height: MENU_HEIGHT / 2,\r\n        x: (LEFT_RIGHT_MARGINS/2),\r\n        y: MENU_HEIGHT / 2,\r\n        rotation: Math.PI,\r\n        tint: FORE_COLOR\r\n    });\r\n\r\n    const rightButton = new _pixi_ui__WEBPACK_IMPORTED_MODULE_1__.Button( rightArrow );\r\n    const leftButton = new _pixi_ui__WEBPACK_IMPORTED_MODULE_1__.Button( leftArrow );\r\n\r\n    rightButton.onPress.connect(() => scroll(-MENU_HEIGHT * SCROLL_COUNT));\r\n    leftButton.onPress.connect(() => scroll(MENU_HEIGHT * SCROLL_COUNT));\r\n    \r\n    decorationMenuContainer.addChild(rightButton.view);\r\n    decorationMenuContainer.addChild(leftButton.view);\r\n\r\n    // update button enabled status based on scroll position\r\n    buttonEnabledTicker.add(() => {\r\n        if (scrollBox.scrollX > -ITEM_PADDING) {\r\n            //console.log('LEFT BUTTON DISABLED');\r\n            leftButton.enabled = false;\r\n            leftArrow.tint = DISABLED_COLOR;\r\n        } else {\r\n            //console.log('LEFT BUTTON ENABLED');\r\n            leftButton.enabled = true;\r\n            leftArrow.tint = FORE_COLOR;\r\n        }\r\n        if (scrollBox.scrollX < -scrollMaxPosition) {\r\n            //console.log('RIGHT BUTTON DISABLED');\r\n            rightButton.enabled = false;\r\n            rightArrow.tint = DISABLED_COLOR;\r\n        } else {\r\n            //console.log('RIGHT BUTTON ENABLED');\r\n            rightButton.enabled = true;\r\n            rightArrow.tint = FORE_COLOR;\r\n        }\r\n    });\r\n    buttonEnabledTicker.start();\r\n}\r\n\r\nconst scroll = (distance) => {\r\n    let scrollDistance = distance;\r\n    let projectedFinalPos = scrollBox.scrollX + distance;\r\n\r\n    console.log(\"start scrollX: \" + scrollBox.scrollX);\r\n    console.log(\"distance: \" + distance);\r\n    console.log(\"projectedFinalPos: \" + projectedFinalPos);\r\n    console.log(\"scrollMaxPosition: \" + scrollMaxPosition);\r\n\r\n    //console.log(\"projectedFinalPos > 0: \" + (projectedFinalPos > 0));\r\n    console.log('projectedFinalPos < scrollMaxPosition: ' + (projectedFinalPos < scrollMaxPosition));\r\n    if (projectedFinalPos > 0) { // WORKS\r\n        scrollDistance = -scrollBox.scrollX;\r\n    }\r\n    else if (projectedFinalPos < -scrollMaxPosition) { // DOES NOT WORK\r\n        scrollDistance = -scrollMaxPosition - scrollBox.scrollX;\r\n    }\r\n    console.log(\"moving: \" + scrollDistance);\r\n\r\n    const moveScrollBar = (deltaTime) =>\r\n    {\r\n        let distancePerTick = (scrollDistance / BUTTON_MOVE_MS) * moveTicker.elapsedMS;\r\n        //console.log(`moved: ${distancePerTick} `);\r\n        scrollBox.scrollX += distancePerTick;\r\n    }\r\n\r\n    // start movement\r\n    moveTicker.add(moveScrollBar);\r\n    moveTicker.start();\r\n    //console.log(\"start moveTicker\");\r\n\r\n    // stop movement after x milliseconds\r\n    setTimeout(() => {\r\n        moveTicker.stop();\r\n        moveTicker.remove(moveScrollBar);\r\n        //console.log(\"stop moveTicker\");\r\n        console.log(\"end scrollX: \" + scrollBox.scrollX);\r\n        console.log(\"---------------------------------------------------\" );\r\n    }, BUTTON_MOVE_MS); \r\n}\r\n\r\nconst createFilterBar = () => {\r\n\r\n    // create container\r\n    let filterBarContainer = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container({\r\n        width: MENU_WIDTH,\r\n        height: FILTER_BAR_HEIGHT,\r\n        x: 0,\r\n        y: -FILTER_BAR_HEIGHT,\r\n    });\r\n\r\n    // add background\r\n    let filterBarBG = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics().rect(0, 0, MENU_WIDTH, FILTER_BAR_HEIGHT).fill(BG_COLOR);\r\n    filterBarContainer.addChild(filterBarBG);\r\n\r\n    // create filter buttons\r\n    const categories = [\"All\", \"Floor\", \"Ceiling\", \"Wall\"];\r\n\r\n    let distance = 0;\r\n    for (let i = 0; i < categories.length; i++) {\r\n\r\n        let color = (currentFilter === categories[i]) ? FORE_COLOR : DISABLED_COLOR;\r\n        const style = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.TextStyle({\r\n            fill: { color }\r\n        });\r\n\r\n        // create text\r\n        let text = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Text({\r\n            text: categories[i],\r\n            x: (ITEM_PADDING * 2 * (i+1)) + distance,\r\n            y: 0,\r\n            style\r\n        });\r\n\r\n        distance += text.width;\r\n\r\n        // create button\r\n        const button = new _pixi_ui__WEBPACK_IMPORTED_MODULE_1__.Button(text);\r\n        button.onPress.connect(() => changeFilter(filterBarContainer, categories[i]));\r\n\r\n        // add button to bar\r\n        filterBarContainer.addChild(text);\r\n    }\r\n\r\n    // add filter to interface\r\n    decorationMenuContainer.addChild(filterBarContainer);\r\n}\r\n\r\nconst changeFilter = (filterBar, newFilter) => {\r\n    if (currentFilter !== newFilter) {\r\n        currentFilter = newFilter;\r\n        while(filterBar.children[0]) { \r\n            filterBar.removeChild(filterBar.children[0]);\r\n        }\r\n        createFilterBar();\r\n    }\r\n}\r\n\r\nconst createClosePanelButton = () => {\r\n    const btnWid = 100;\r\n    const btnHgt = 30;\r\n\r\n    // Create a container for the button\r\n    let openCloseButtonContainer = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container({\r\n        width: btnWid,\r\n        height: btnHgt,\r\n        x: LEFT_RIGHT_MARGINS / 4, //(MENU_WIDTH) / 2,\r\n        y: -(btnHgt + FILTER_BAR_HEIGHT),\r\n    });\r\n\r\n    // Create the background for the button\r\n    let buttonPadding = ITEM_PADDING * 2;\r\n    let openCloseButtonContainerBG = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics()\r\n        .moveTo(buttonPadding, 0)\r\n        .lineTo(btnWid - (2*buttonPadding), 0)\r\n        .arcTo(btnWid, 0, btnWid, btnHgt, buttonPadding)\r\n        .lineTo(btnWid,btnHgt)\r\n        .lineTo(0,btnHgt)\r\n        .arcTo(0, 0, buttonPadding, 0, buttonPadding)\r\n        .fill(BG_COLOR);\r\n    openCloseButtonContainer.addChild(openCloseButtonContainerBG);\r\n\r\n    // Create the arrow sprite\r\n    const arrow = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Sprite({\r\n        texture: arrowTexture,\r\n        anchor: (0.5),\r\n        width: btnHgt,\r\n        height: btnHgt,\r\n        x: btnWid / 2,\r\n        y: btnHgt / 2,\r\n        rotation: Math.PI / 2, // Rotate the arrow 270 degrees\r\n        tint: FORE_COLOR,\r\n    })\r\n\r\n    openCloseButtonContainer.addChild(arrow);\r\n\r\n    // Create the button\r\n    const openCloseButton = new _pixi_ui__WEBPACK_IMPORTED_MODULE_1__.Button(openCloseButtonContainer);\r\n    openCloseButton.onPress.connect(() => toggleMenu(arrow));\r\n\r\n    decorationMenuContainer.addChild(openCloseButtonContainer);\r\n};\r\n\r\nconst toggleMenu = (sprite) => {\r\n    //console.log(\"toggleMenu: menuOpen = \" + menuOpen);\r\n\r\n    if (menuOpen) {\r\n        //console.log(\"Closing Menu\");\r\n        //sprite.rotation = Math.PI * 1.5;\r\n\r\n        decorationMenuContainer.y += MENU_HEIGHT + FILTER_BAR_HEIGHT;\r\n    }\r\n    else {\r\n        //console.log(\"Opening Menu\");\r\n        //sprite.rotation = Math.PI / 2;\r\n\r\n        decorationMenuContainer.y -= MENU_HEIGHT + FILTER_BAR_HEIGHT;\r\n    }\r\n\r\n    sprite.rotation += Math.PI;\r\n\r\n    /*/ this code for an animated open and closing of the menu works but always puts the menu in a different position.\r\n    It is supposed to run after the above if/else is completed instead of using \"decorationMenuContainer.y = \".\r\n    const moveMenuAnimated = (deltaTime) =>\r\n    {\r\n        let distancePerTick = (MENU_HEIGHT / BUTTON_MOVE_MS) * moveTicker.elapsedMS;\r\n        decorationMenuContainer.y += menuOpen ? -distancePerTick : distancePerTick;\r\n    }\r\n    moveTicker.add(moveMenuAnimated);\r\n    moveTicker.start();\r\n\r\n    // stop movement after x milliseconds\r\n    setTimeout(() => {\r\n        moveTicker.stop();\r\n        moveTicker.remove(moveMenu);\r\n    }, BUTTON_MOVE_MS); \r\n    //*/\r\n\r\n    menuOpen = !menuOpen;\r\n}\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } }, 1);\n\n//# sourceURL=webpack://pixi/./src/decoration-menu.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {\n__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var pixi_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! pixi.js */ \"./node_modules/pixi.js/lib/index.mjs\");\n/* harmony import */ var _decoration_menu_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./decoration-menu.js */ \"./src/decoration-menu.js\");\nvar __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([_decoration_menu_js__WEBPACK_IMPORTED_MODULE_1__]);\n_decoration_menu_js__WEBPACK_IMPORTED_MODULE_1__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];\n\r\n\r\n\r\nconst init = async () => {\r\n    // initialize application\r\n    const app = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Application();\r\n    await app.init({ backgroundColor: 0XFFFFFF, resizeTo: window });\r\n    document.body.appendChild(app.canvas);\r\n\r\n    // create space (container for everything)\r\n    let space = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Container();\r\n\r\n    let spaceBG = new pixi_js__WEBPACK_IMPORTED_MODULE_0__.Graphics().rect(0, 0, app.screen.width * .9, app.screen.height * .9).fill(0X1099BB);\r\n    space.addChild(spaceBG);\r\n\r\n    (0,_decoration_menu_js__WEBPACK_IMPORTED_MODULE_1__.createDecorationMenu)(space, 100, 120, 12, 150, 3);\r\n\r\n    app.stage.addChild(space);\r\n}\r\n\r\ninit();\n__webpack_async_result__();\n} catch(e) { __webpack_async_result__(e); } });\n\n//# sourceURL=webpack://pixi/./src/index.js?");

/***/ }),

/***/ "./node_modules/@pixi/ui/lib/index.mjs":
/*!*********************************************!*\
  !*** ./node_modules/@pixi/ui/lib/index.mjs ***!
  \*********************************************/
/***/ (() => {

eval("throw new Error(\"Module build failed: Error: ENOENT: no such file or directory, open 'C:\\\\Users\\\\tjm12\\\\LookingForGroup\\\\LFG-VirtualSpace-DecorationMenu\\\\node_modules\\\\@pixi\\\\ui\\\\lib\\\\index.mjs'\");\n\n//# sourceURL=webpack://pixi/./node_modules/@pixi/ui/lib/index.mjs?");

/***/ }),

/***/ "./node_modules/pixi.js/lib/index.mjs":
/*!********************************************!*\
  !*** ./node_modules/pixi.js/lib/index.mjs ***!
  \********************************************/
/***/ (() => {

eval("throw new Error(\"Module build failed: Error: ENOENT: no such file or directory, open 'C:\\\\Users\\\\tjm12\\\\LookingForGroup\\\\LFG-VirtualSpace-DecorationMenu\\\\node_modules\\\\pixi.js\\\\lib\\\\index.mjs'\");\n\n//# sourceURL=webpack://pixi/./node_modules/pixi.js/lib/index.mjs?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/async module */
/******/ 	(() => {
/******/ 		var webpackQueues = typeof Symbol === "function" ? Symbol("webpack queues") : "__webpack_queues__";
/******/ 		var webpackExports = typeof Symbol === "function" ? Symbol("webpack exports") : "__webpack_exports__";
/******/ 		var webpackError = typeof Symbol === "function" ? Symbol("webpack error") : "__webpack_error__";
/******/ 		var resolveQueue = (queue) => {
/******/ 			if(queue && queue.d < 1) {
/******/ 				queue.d = 1;
/******/ 				queue.forEach((fn) => (fn.r--));
/******/ 				queue.forEach((fn) => (fn.r-- ? fn.r++ : fn()));
/******/ 			}
/******/ 		}
/******/ 		var wrapDeps = (deps) => (deps.map((dep) => {
/******/ 			if(dep !== null && typeof dep === "object") {
/******/ 				if(dep[webpackQueues]) return dep;
/******/ 				if(dep.then) {
/******/ 					var queue = [];
/******/ 					queue.d = 0;
/******/ 					dep.then((r) => {
/******/ 						obj[webpackExports] = r;
/******/ 						resolveQueue(queue);
/******/ 					}, (e) => {
/******/ 						obj[webpackError] = e;
/******/ 						resolveQueue(queue);
/******/ 					});
/******/ 					var obj = {};
/******/ 					obj[webpackQueues] = (fn) => (fn(queue));
/******/ 					return obj;
/******/ 				}
/******/ 			}
/******/ 			var ret = {};
/******/ 			ret[webpackQueues] = x => {};
/******/ 			ret[webpackExports] = dep;
/******/ 			return ret;
/******/ 		}));
/******/ 		__webpack_require__.a = (module, body, hasAwait) => {
/******/ 			var queue;
/******/ 			hasAwait && ((queue = []).d = -1);
/******/ 			var depQueues = new Set();
/******/ 			var exports = module.exports;
/******/ 			var currentDeps;
/******/ 			var outerResolve;
/******/ 			var reject;
/******/ 			var promise = new Promise((resolve, rej) => {
/******/ 				reject = rej;
/******/ 				outerResolve = resolve;
/******/ 			});
/******/ 			promise[webpackExports] = exports;
/******/ 			promise[webpackQueues] = (fn) => (queue && fn(queue), depQueues.forEach(fn), promise["catch"](x => {}));
/******/ 			module.exports = promise;
/******/ 			body((deps) => {
/******/ 				currentDeps = wrapDeps(deps);
/******/ 				var fn;
/******/ 				var getResult = () => (currentDeps.map((d) => {
/******/ 					if(d[webpackError]) throw d[webpackError];
/******/ 					return d[webpackExports];
/******/ 				}))
/******/ 				var promise = new Promise((resolve) => {
/******/ 					fn = () => (resolve(getResult));
/******/ 					fn.r = 0;
/******/ 					var fnQueue = (q) => (q !== queue && !depQueues.has(q) && (depQueues.add(q), q && !q.d && (fn.r++, q.push(fn))));
/******/ 					currentDeps.map((dep) => (dep[webpackQueues](fnQueue)));
/******/ 				});
/******/ 				return fn.r ? promise : getResult();
/******/ 			}, (err) => ((err ? reject(promise[webpackError] = err) : outerResolve(exports)), resolveQueue(queue)));
/******/ 			queue && queue.d < 0 && (queue.d = 0);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;