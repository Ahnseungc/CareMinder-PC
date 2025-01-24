// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  receive: (channel, callback) => ipcRenderer.on(channel, (event, ...args) => callback(...args)),
});

contextBridge.exposeInMainWorld("electronStore", {
  set: (key, value) => ipcRenderer.invoke("store:set", key, value),
  get: key => ipcRenderer.invoke("store:get", key),
  delete: key => ipcRenderer.invoke("store:delete", key),
});

contextBridge.exposeInMainWorld("Fcm", {
  getFcmData: key => ipcRenderer.invoke(key),
});

contextBridge.exposeInMainWorld("tokenAPI", {
  getTokens: async () => await ipcRenderer.invoke("get-tokens"), // 토큰 가져오기
});
