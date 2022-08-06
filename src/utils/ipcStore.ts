import { ipcRenderer } from 'electron'

interface IpcStoreReturn {
  get: () => Promise<any>
  set: (value?: any) => any
  del: () => any
}

function ipcStore(key: string): IpcStoreReturn {
  if (!ipcRenderer) {
    console.log('no ipcRenderer')
    return {
      get: () => Promise.reject(false),
      set: () => false,
      del: () => false
    }
  }
  return {
    get() {
      console.log('test get', key)
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
