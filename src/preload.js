// preload.js
const { contextBridge, ipcRenderer } = require("electron");

// Main <-> Renderer 간 안전한 통신 설정
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});
