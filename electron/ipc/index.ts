import { dialog, ipcMain } from 'electron'
import {store} from './setIpcStore'

export function setIpcs() {
  // 打开选择文件夹
  ipcMain.handle('open-directory-dialog', async (e: any, setting: any) => {
    const defaultSetting = { properties: ['openDirectory'] }
    const opt = Object.assign({}, defaultSetting, setting)
    const res = await dialog.showOpenDialog(opt)
    return res
  })

  ipcMain.handle('merge-pdf', async (e: any, setting: any) => {
    const fileName = setting.fileName
    const fileList = await store.get('file-list')
    const savedDir = await store.get('saved-dir')
  })

}
