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

eval("\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\n    return new (P || (P = Promise))(function (resolve, reject) {\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\n    });\n};\nObject.defineProperty(exports, \"__esModule\", ({ value: true }));\nconst shortcodes_1 = __webpack_require__(/*! ../utils/shortcodes */ \"./src/utils/shortcodes.ts\");\ndocument.addEventListener('DOMContentLoaded', () => {\n    const createMessageBtn = document.querySelector('.messages__create-btn');\n    createMessageBtn === null || createMessageBtn === void 0 ? void 0 : createMessageBtn.addEventListener('click', handleCreateBtn);\n    const editMessageBtns = document.querySelectorAll('.messages__edit-btn');\n    [...editMessageBtns].forEach((editBtn) => {\n        editBtn.addEventListener('click', handleEditBtn);\n    });\n    const deleteMessageBtns = document.querySelectorAll('.message__delete-btn');\n    [...deleteMessageBtns].forEach((deleteBtn) => {\n        deleteBtn.prop = { btn: deleteBtn, error: undefined };\n        deleteBtn.addEventListener('click', handleDeleteBtn);\n    });\n});\nfunction formsExist() {\n    const forms = document.querySelectorAll('form');\n    return forms.length > 0 ? true : false;\n}\nfunction getFetchHeaders() {\n    return {\n        method: 'GET',\n        headers: {\n            'Content-Type': 'application/json',\n            'X-Requested-With': 'XMLHttpRequest'\n        },\n    };\n}\nfunction handleCancelCreateBtn(e) {\n    return __awaiter(this, void 0, void 0, function* () {\n        var _a, _b;\n        const cancelBtn = e.currentTarget;\n        cancelBtn.removeEventListener('click', handleCancelCreateBtn);\n        const section = (_b = (_a = cancelBtn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;\n        section.remove();\n    });\n}\nfunction handleCreateBtn() {\n    return __awaiter(this, void 0, void 0, function* () {\n        try {\n            const main = document.querySelector('main');\n            const formFetch = yield fetch('/messages/create', getFetchHeaders());\n            const form = yield formFetch.text();\n            const formNode = (0, shortcodes_1.convertToDomNode)(form);\n            const section = document.createElement('section');\n            section.appendChild(formNode);\n            main.appendChild(section);\n            const textarea = formNode.querySelector(\"textarea\");\n            textarea.addEventListener('input', handleTextArea);\n            const cancelBtn = formNode.querySelector('.message__cancel-button');\n            cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', handleCancelCreateBtn);\n        }\n        catch (error) {\n            console.error('Error loading create message form: ', error);\n        }\n    });\n}\nfunction handleEditBtn(e) {\n    return __awaiter(this, void 0, void 0, function* () {\n        const editBtn = e.currentTarget;\n        try {\n            const card = editBtn.parentElement;\n            const messageId = card.id;\n            const formFetch = yield fetch(`/messages/update?id=${messageId}`, getFetchHeaders());\n            const form = yield formFetch.text();\n            const formNode = (0, shortcodes_1.convertToDomNode)(form);\n            const listItem = document.createElement('li');\n            listItem.setAttribute('data-id', messageId);\n            listItem.classList.add('messages__item');\n            listItem.appendChild(formNode);\n            editBtn.removeEventListener('click', handleEditBtn);\n            card.replaceWith(listItem);\n            const cancelBtn = formNode.querySelector('.message__cancel-button');\n            cancelBtn === null || cancelBtn === void 0 ? void 0 : cancelBtn.addEventListener('click', handleCancelEditBtn);\n        }\n        catch (error) {\n            console.error('Error loading update message form: ', error);\n        }\n    });\n}\nfunction handleCancelEditBtn(e) {\n    return __awaiter(this, void 0, void 0, function* () {\n        var _a, _b;\n        const cancelBtn = e.currentTarget;\n        const formListItem = (_b = (_a = cancelBtn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.parentElement;\n        try {\n            const listItemFetch = yield fetch(`/messages/message?id=${formListItem.dataset.id}`, getFetchHeaders());\n            const listItem = yield listItemFetch.text();\n            const listItemNode = (0, shortcodes_1.convertToDomNode)(listItem);\n            cancelBtn.removeEventListener('click', handleCancelEditBtn);\n            formListItem.replaceWith(listItemNode);\n            const deleteMessageBtn = document.querySelector('.message__delete-btn');\n            deleteMessageBtn.prop = { btn: deleteMessageBtn, error: undefined };\n            deleteMessageBtn === null || deleteMessageBtn === void 0 ? void 0 : deleteMessageBtn.addEventListener('click', handleDeleteBtn);\n            const editMessageBtn = listItemNode.querySelector('.messages__edit-btn');\n            editMessageBtn === null || editMessageBtn === void 0 ? void 0 : editMessageBtn.addEventListener('click', handleEditBtn);\n        }\n        catch (error) {\n            console.error('Error loading update message form: ', error);\n        }\n    });\n}\nfunction handleCancelDeleteBtn(e) {\n    return __awaiter(this, void 0, void 0, function* () {\n        var _a;\n        const cancelBtn = e.currentTarget;\n        cancelBtn.removeEventListener('click', handleCancelCreateBtn);\n        const section = (_a = cancelBtn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;\n        section.remove();\n    });\n}\nfunction handleDeleteMessageBtn(e) {\n    return __awaiter(this, void 0, void 0, function* () {\n        var _a;\n        const deleteBtn = e.currentTarget;\n        const section = (_a = deleteBtn.parentElement) === null || _a === void 0 ? void 0 : _a.parentElement;\n        const messageId = section.dataset.id;\n        const data = JSON.stringify({ id: messageId });\n        try {\n            const deleteItemFetch = yield fetch('/messages/delete', {\n                method: 'POST',\n                body: data,\n                headers: {\n                    'Accept': 'application/json',\n                    'Content-Type': 'application/json'\n                },\n            });\n            const result = yield deleteItemFetch.json();\n            const listItem = document.querySelector(`li#${messageId}`);\n            const deleteMessageBtn = listItem.querySelector('.message__delete-btn');\n            const prop = { btn: deleteMessageBtn, error: result.message };\n            if (result.success) {\n                listItem.remove();\n            }\n            else {\n                handleDeleteBtn.call({ prop });\n            }\n        }\n        catch (error) {\n            console.error('Error deleting message.', error);\n        }\n        section.remove();\n        deleteBtn.removeEventListener('click', handleDeleteMessageBtn);\n    });\n}\nfunction handleDeleteBtn() {\n    return __awaiter(this, void 0, void 0, function* () {\n        const { btn: deleteBtn, error } = this.prop;\n        try {\n            const main = document.querySelector('main');\n            const card = deleteBtn.parentElement;\n            const messageId = card.id;\n            const deleteItemFetch = yield fetch(`/messages/delete?error=${error}`, getFetchHeaders());\n            const deleteItem = yield deleteItemFetch.text();\n            const deleteItemNode = (0, shortcodes_1.convertToDomNode)(deleteItem);\n            deleteItemNode.setAttribute('data-id', messageId);\n            main.appendChild(deleteItemNode);\n            const cancelMessageBtn = deleteItemNode.querySelector('.messages__cancel-verify-btn');\n            cancelMessageBtn === null || cancelMessageBtn === void 0 ? void 0 : cancelMessageBtn.addEventListener('click', handleCancelDeleteBtn);\n            const deleteMessageBtn = deleteItemNode.querySelector('.messages__delete-verify-btn');\n            deleteMessageBtn === null || deleteMessageBtn === void 0 ? void 0 : deleteMessageBtn.addEventListener('click', (e) => {\n                handleDeleteMessageBtn(e);\n                deleteBtn.removeEventListener('click', handleDeleteBtn);\n            });\n        }\n        catch (error) {\n            console.error('Error loading delete message.', error);\n        }\n    });\n}\nfunction handleTextArea(e) {\n    const textarea = e.currentTarget;\n    const counter = textarea.nextElementSibling;\n    counter.textContent = `${textarea.value.length} / 500 Characters`;\n}\n\n\n//# sourceURL=webpack://members-only/./src/client/messages.ts?");

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