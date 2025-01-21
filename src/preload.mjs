import { contextBridge, ipcRenderer } from "electron";

// 렌더러 프로세스에서 사용할 안전한 API 제공
contextBridge.exposeInMainWorld("electron", {
  getDirname: () => ipcRenderer.invoke("get-dirname"),
  getFcmData: key => ipcRenderer.invoke("get-fcm", key),
  getNotification: () => ipcRenderer.invoke("get-notification"),
});
