import { config } from "dotenv";
import { app, BrowserWindow, ipcMain, screen, session, protocol } from "electron";
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

function createSplashWindow() {
  const splashWindow = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false, // 기본 윈도우 프레임 숨기기
    transparent: true, // 배경 투명화 (스플래시 화면에 적합)
    alwaysOnTop: true, // 항상 위에 표시
    webPreferences: {
      allowRunningInsecureContent: true,
      nodeIntegration: true, // 노드 통합을 사용하여 HTML에서 노드 기능을 사용할 수 있게 함
    },
  });
  splashWindow.loadFile(path.join(__dirname, "loading.html"));
  return splashWindow;
}

async function createWindow() {
  const splashWindow = createSplashWindow(); // 스플래시 윈도우 생성 및 참조
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      allowRunningInsecureContent: true,
      // preload: path.join("file:", __dirname, "preload.mjs"),
      preload: path.resolve(__dirname, "preload.js"),
    },
  });

  console.log("HTML File Path:", path.resolve(__dirname, "../dist/index.html"));

  const credentials = await register(firebaseConfig);
  console.log(credentials);
  store.set("fcm_token", credentials.fcm.token); // 데이터 저장
  const savedFcmToken = store.get("fcm_token");
  console.log("Retrieved FCM Token:", savedFcmToken);
  await listen({ ...credentials }, onNotification);

  // win.loadURL("http://localhost:5173");
  const filePath = path.resolve(__dirname, "../dist/index.html");
  win.loadFile(filePath);

  win.webContents.on("did-finish-load", () => {
    console.log("Main window has finished loading.");
    if (splashWindow && !splashWindow.isDestroyed()) {
      splashWindow.destroy(); // close() 대신 destroy() 사용
    }
    win.show();
  });
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
      allowRunningInsecureContent: true,
      preload: path.join(__dirname, "preload.js"),
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
    console.log("접근");
    const value = store.get("fcm_token"); // 데이터 읽기
    console.log(`Data retrieved: ${key} = ${value}`);
    return value;
  });
  ipcMain.handle("store:set", async (event, key, value) => {
    store.set(key, value);
    console.log(key, store.get(key));
    return true;
  });
  ipcMain.handle("store:get", (event, key) => {
    return store.get(key);
  });

  ipcMain.handle("store:delete", (event, key) => {
    store.delete(key);
    return true;
  });
  ipcMain.handle("get-tokens", () => {
    const accessToken = store.get("accessTokenWard");
    const refreshToken = store.get("refreshTokenWard");
    return { accessToken, refreshToken };
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
