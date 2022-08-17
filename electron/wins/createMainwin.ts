import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { menu } from '../main/menu'
import { join } from 'path'
import wins from './index'
import { BACKGROUND_COLOR, WIN_WIDTH, WIN_HEIGHT } from '../const'


export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

export const preload = join(__dirname, '../preload/index.js')
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin
const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`
const indexHtml = join(ROOT_PATH.dist, 'index.html')

export async function createMainwin() {
  wins.mainwin = new BrowserWindow({
    width: WIN_WIDTH,
    height: WIN_HEIGHT,
    minWidth: 600,
    minHeight: WIN_HEIGHT,
    title: 'PDF-MERGER',
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    backgroundColor: BACKGROUND_COLOR,
    // resizable: false,
    // titleBarStyle: "hidden",
    frame: false,
    titleBarOverlay: {
        color: BACKGROUND_COLOR,
        symbolColor: "#fff",
    },
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (app.isPackaged) {
    wins.mainwin.loadFile(indexHtml)
  } else {
    wins.mainwin.loadURL(url)
    // Open devTool if the app is not packaged
    wins.mainwin.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  wins.mainwin.webContents.on('did-finish-load', () => {
    wins.mainwin?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  wins.mainwin.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  wins.mainwin.setMenu(menu)
}
