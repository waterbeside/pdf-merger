import { ipcMain } from 'electron'
import Store from 'electron-store'

export const store = new Store()

export function setIpcStore() {
  ipcMain.on('store:set', async (e, args) => {
    store.set(args.key, args.value)
  })
  ipcMain.handle('store:get', async (e, args) => {
    const value = await store.get(args)
    return value
  })
  ipcMain.on('store:delete', async (e, args) => {
    store.delete(args)
  })
}
