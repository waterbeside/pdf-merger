import { app, BrowserWindow, shell, ipcMain, Menu } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { setIpcs } from '../ipc'
import { setIpcStore } from '../ipc/setIpcStore'
import { createMainwin, preload } from '../wins/createMainwin'
import wins from '../wins'


// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

app.on('ready', async () => {
  await createMainwin()
  setIpcs()
  setIpcStore()
})

app.on('window-all-closed', () => {
  wins.mainwin = null
  if (process.platform !== 'darwin') app.quit()
})


app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createMainwin()
  }
})


