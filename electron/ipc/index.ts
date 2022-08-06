import { dialog, ipcMain } from 'electron'


export function setIpcs() {
  // 打开选择文件夹
  ipcMain.handle('open-directory-dialog', async (e: any, setting: any) => {
    const defaultSetting = { properties: ['openDirectory'] }
    const opt = Object.assign({}, defaultSetting, setting)
    const res = await dialog.showOpenDialog(opt)
    return res
  })


}
