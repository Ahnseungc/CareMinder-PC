// preload.js
const { contextBridge, ipcRenderer } = require("electron");

console.log("preload.js 실행");
// Main <-> Renderer 간 안전한 통신 설정
contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});

contextBridge.exposeInMainWorld("electronStore", {
  set: (key, value) => ipcRenderer.invoke("store:set", key, value),
  get: key => ipcRenderer.invoke("store:get", key),
  delete: key => ipcRenderer.invoke("store:delete", key),
});
