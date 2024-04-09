"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDomNode = void 0;
function convertToDomNode(htmlTemplate) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlTemplate, 'text/html');
    const content = doc.body.firstChild;
    return content;
}
exports.convertToDomNode = convertToDomNode;
