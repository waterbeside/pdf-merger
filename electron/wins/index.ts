import { BrowserWindow } from 'electron'
const wins: {
  [key: string]: BrowserWindow | null
} = {
  mainwin: null
}

export default wins