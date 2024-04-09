#!/usr/bin/env node
"use strict";
/**
 * Module dependencies.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const debug_1 = __importDefault(require("debug"));
const browser_sync_1 = __importDefault(require("browser-sync"));
const app_1 = require("../app");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app_1.app.set('port', port);
/**
 * Create HTTP server.
 */
const server = http_1.default.createServer(app_1.app);
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', () => {
    if (process.env.NODE_ENV === 'development') {
        initializeBrowserSync();
    }
    else {
        onListening();
    }
});
/**
 * Normalize a port into a number, string, or false.
 */
function normalizePort(val) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}
/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    var bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;
    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}
/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    var addr = server.address();
    const debug = (0, debug_1.default)('members-only:server');
    var bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + (addr === null || addr === void 0 ? void 0 : addr.port);
    debug('Listening on ' + bind);
}
function initializeBrowserSync() {
    browser_sync_1.default.init({
        proxy: "localhost:3000",
        files: ["src/", "public/"],
        open: false,
        port: 8085,
        startPath: "/"
    }, () => {
        onListening();
    });
}
