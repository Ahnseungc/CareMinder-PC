import { config } from "dotenv";
import { app, BrowserWindow, ipcMain, screen } from "electron";
import { join } from "path";
import { fileURLToPath, format } from "url";
import Store from "electron-store";
import { register, listen } from "push-receiver-v2";
import path from "path";
import sound from "sound-play";
const firebaseConfig = {
  firebase: {
    apiKey: "AIzaSyDr2aG0diglJe-A-lC9VqpfLnoEz1Baj4I",
    appID: "1:264563409584:web:228f2d074c73b057023175",
    projectID: "careminder-e50ae",
  },
  vapidKey:
    "BDOPhFvQMqh6P-qImnWLcs_eCrPP04JOZ3MYUS1aPhdrsxq1HrliVRIaIcC7mMr2Xcw7zYQyVvEtuTD8D3ux1pU", // optional
};

// const __dirname = dirname(fileURLToPath(import.meta.url));
const __filename = fileURLToPath(import.meta.url); // 현재 파일의 경로
const __dirname = path.dirname(__filename); // 현재 디렉토리 경로

config({ path: join(__dirname, "../.env") });
const isDev = process.env.VITE_IS_DEV === "true";
const store = new Store();

async function createWindow() {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  const credentials = await register(firebaseConfig);
  console.log(credentials);
  store.set("fcm_token", credentials.fcm.token); // 데이터 저장
  const savedFcmToken = store.get("fcm_token");
  console.log("Retrieved FCM Token:", savedFcmToken);
  await listen({ ...credentials }, onNotification);

  win.loadURL("https://careflow.co.kr");
  // win.loadURL("http://localhost:5173");
}

let persistentIds = [];

function onNotification({ notification, persistentId }) {
  const newPersistentId = notification.data.data;
  if (persistentIds.includes(newPersistentId)) {
    return; // 중복 알림
  }
  persistentIds.push(newPersistentId);
  displayNotification(notification);
}

// 알림을 화면에 표시하는 함수
let message = "";
function displayNotification(notification) {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  sound.play(path.join(__dirname, "alarm.wav"));
  const notificationWidth = 302;
  const notificationHeight = 118;
  const x = width - notificationWidth - 10;
  const y = height - notificationHeight + 100;
  let notificationWindow = new BrowserWindow({
    width: notificationWidth,
    height: notificationHeight,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    x: x, // x 좌표 설정
    y: y, // y 좌표 설정
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.mjs"),
    },
  });

  notificationWindow.loadURL(path.join("file:", __dirname, "notification.html"));

  message = notification.data.data;

  notificationWindow.webContents.on("did-finish-load", () => {
    notificationWindow.webContents.send("set-message", notification.data.data);
  });

  setTimeout(() => {
    notificationWindow.close();
    notificationWindow = null;
  }, 5500);
}

ipcMain.handle("get-notification", (event, key) => {
  return message;
});

app.whenReady().then(async () => {
  createWindow();
  ipcMain.handle("get-fcm", (event, key) => {
    const value = store.get("fcm_token"); // 데이터 읽기
    console.log(`Data retrieved: ${key} = ${value}`);
    return value;
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
