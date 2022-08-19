import { ipcRenderer } from 'electron'

interface IpcStoreReturn {
  get: <T = any>() => Promise<T>
  set: (value?: any) => any
  del: () => any
}

function ipcStore(key: string): IpcStoreReturn {
  if (!ipcRenderer) {
    return {
      get: <T = any>() => Promise.reject<T>(false),
      set: () => false,
      del: () => false
    }
  }
  return {
    get() {
      return new Promise((resolve, reject) => {
        ipcRenderer
          .invoke('store:get', key)
          .then((res: any) => {
            resolve(res)
          })
          .catch((error: any) => {
            reject(error)
          })
      })
    },
    set(value: any) {
      return ipcRenderer.send('store:set', { key, value })
    },
    del() {
      ipcRenderer.send('store:delete', 'foo')
    }
  }
}


export default ipcStore
