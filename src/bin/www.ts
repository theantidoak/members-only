#!/usr/bin/env node

/**
 * Module dependencies.
 */

import http from 'http';
import debugModule from 'debug';
import browserSync from 'browser-sync';
import { app } from '../app';
import dotenv from 'dotenv';
dotenv.config();

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', () => {
  if (process.env.NODE_ENV === 'development') {
    initializeBrowserSync();
  } else {
    onListening();
  }
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
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

function onError(error: any) {
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
  const debug = debugModule('members-only:server');
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr?.port;
  debug('Listening on ' + bind);
}

function initializeBrowserSync() {
  browserSync.init({
    proxy: "localhost:3000",
    files: ["src/", "public/"],
    open: "local",
    port: 8085,
    startPath: "/messages"
  }, () => {
    onListening();
  });
}