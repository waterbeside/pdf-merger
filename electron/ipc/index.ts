import { dialog, ipcMain } from 'electron'
import { store } from './setIpcStore'
import { mergePdf, setMainWinProgressBar } from '../utils'

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

}
