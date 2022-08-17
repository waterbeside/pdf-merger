import { Menu, shell, ipcMain } from 'electron'
import wins from '../wins'

const template = [
  {
    label: '帮助',
    submenu: [
      {
        label: '关于',
        click: () => {
          if (wins.mainwin) wins.mainwin.webContents.send('show-about')
        }
      }
    ]
  }
]

export const menu = Menu.buildFromTemplate(template)

