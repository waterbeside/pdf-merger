import { dialog, ipcMain } from 'electron'
import { store } from './setIpcStore'
import { mergePdf, setMainWinProgressBar } from '../utils'
import wins from '../wins'
import path from 'path'
import { WIN_WIDTH, WIN_HEIGHT } from '../const'
import fs from 'fs'

export function setIpcs() {
  
  // 打开选择文件夹
  ipcMain.handle('open-directory-dialog', async (e: any, setting: any) => {
    const defaultSetting = { properties: ['openDirectory'] }
    const opt = Object.assign({}, defaultSetting, setting)
    const res = await dialog.showOpenDialog(opt)
    return res
  })

  // 合并pdf文件
  ipcMain.handle('merge-pdf', async (e: any, setting: any) => { 
    setMainWinProgressBar(0.3)
    const fileName = setting.fileName
    const fileList = await <StoredFileListItem[]>store.get('file-list')
    const savedDir = await <string>store.get('saved-dir')
    const savedPath = path.join(savedDir, fileName)
    if (fs.existsSync(savedPath)) {
      const btnIdx = dialog.showMessageBoxSync({
        type: 'warning',
        buttons: ['是', '取消'],
        message: `${fileName}已存在，是否覆盖？`
      })
      if (btnIdx === 1) {
        return {
          status: 'cancel'
        }
      }
    }
    try {
      await mergePdf(fileList, savedPath)
      setMainWinProgressBar(-1)
      return {
        status: 'success',
        savedPath
      }
    } catch (err: any) {
      setMainWinProgressBar(-1)
      return {
        status: 'error',
        savedPath,
        msg: err.message
      }
    }
  })

  // blue win
  ipcMain.on('mainwin-size', async (e: any, setting: any) => {
    if (!wins.mainwin || !setting) return
    if (setting.action === 'hide') wins.mainwin.hide()
    else if (setting.action === 'show') wins.mainwin.show()
    else if (setting.action === 'maximize') wins.mainwin.maximize()
    else if (setting.action === 'unmaximize') wins.mainwin.unmaximize()
    else if (setting.action === 'minimize') wins.mainwin.minimize()
    else if (setting.action === 'restore') wins.mainwin.restore()
    else if (setting.action === 'close') wins.mainwin.close()
    else if (setting.action === 'blur') wins.mainwin.blur()
    else if (setting.action === 'focus') wins.mainwin.focus()
  })

  ipcMain.on('mainwin-isMaximized', async (e: any, setting: any) => {
    if (!wins.mainwin) {
      e.returnValue = false
    } else {
      e.returnValue = wins.mainwin.isMaximized()
    }
  })

  ipcMain.on('mainwin-move', async (e: any, setting: any) => {
    // wins.mainwin && wins.mainwin.setPosition(setting.x, setting.y)
    const bounds = {
      x: setting.x,
      y: setting.y,
      width: WIN_WIDTH,
      height: WIN_HEIGHT
    }
    wins.mainwin && wins.mainwin.setBounds(bounds)
  })
}
