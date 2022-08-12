import { Menu, shell, ipcMain } from 'electron'
import { win } from './index'

const template = [
  {
    label: '帮助',
    submenu: [
      {
        label: '关于',
        click: () => {
          if (win) win.webContents.send('show-about')
        }
      }
    ]
  }
]

export const menu = Menu.buildFromTemplate(template)

