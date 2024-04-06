/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/client/index.ts":
/*!*****************************!*\
  !*** ./src/client/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\n__webpack_require__(/*! ./messages */ \"./src/client/messages.ts\");\n\n\n//# sourceURL=webpack://members-only/./src/client/index.ts?");

/***/ }),

/***/ "./src/client/messages.ts":
/*!********************************!*\
  !*** ./src/client/messages.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst shortcodes_1 = __webpack_require__(/*! ../utils/shortcodes */ \"./src/utils/shortcodes.ts\");\ndocument.addEventListener('DOMContentLoaded', () => {\n    const createMessageBtn = document.querySelector('.messages__create-btn');\n    createMessageBtn === null || createMessageBtn === void 0 ? void 0 : createMessageBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {\n        try {\n            const sectionFetch = yield fetch('/messages/create');\n            const section = yield sectionFetch.text();\n            console.log((0, shortcodes_1.convertToDomNode)(section));\n        }\n        catch (error) {\n            console.error('Error loading create message form: ', error);\n        }\n    }));\n});\n\n\n//# sourceURL=webpack://members-only/./src/client/messages.ts?");

/***/ }),

/***/ "./src/utils/shortcodes.ts":
/*!*********************************!*\
  !*** ./src/utils/shortcodes.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports) => {

eval("\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nexports.convertToDomNode = void 0;\nfunction convertToDomNode(htmlTemplate) {\n    const parser = new DOMParser();\n    const doc = parser.parseFromString(htmlTemplate, 'text/html');\n    const content = doc.body.firstChild;\n    return content;\n}\nexports.convertToDomNode = convertToDomNode;\n\n\n//# sourceURL=webpack://members-only/./src/utils/shortcodes.ts?");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/client/index.ts");
/******/ 	
/******/ })()
;