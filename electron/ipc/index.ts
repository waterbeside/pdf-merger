import { dialog, ipcMain } from 'electron'
import { store } from './setIpcStore'
import { mergePdf, setMainWinProgressBar } from '../utils'
import { win } from '../main'

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
    const savedPath = savedDir + '/' + fileName
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
    if (!win || !setting) return
    if (setting.action === 'hide') win.hide()
    else if (setting.action === 'show') win.show()
    else if (setting.action === 'maximize') win.maximize()
    else if (setting.action === 'unmaximize') win.unmaximize()
    else if (setting.action === 'minimize') win.minimize()
    else if (setting.action === 'restore') win.restore()
    else if (setting.action === 'close') win.close()
    else if (setting.action === 'blur') win.blur()
    else if (setting.action === 'focus') win.focus()
  })
}
