import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import wins from '../wins'

export async function mergePdf(fileList: any[], savedPath: string) {
  if (fileList.length === 0) throw new Error('No file to merge')
  const doc = await PDFDocument.create()

  const pr = (94 / fileList.length) >> 0
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i]
    const {path, name} = file
    const pdfBuffer = fs.readFileSync(path)
    const pdf = await PDFDocument.load(pdfBuffer); 
    const copiedPages = await doc.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => {
      doc.addPage(page)
    }); 
    setMainWinProgressBar(pr * (i + 1))
  }
  const buf = await doc.save();
  fs.writeFile(savedPath, buf, {flag: 'w'}, err => {
    console.log('wrote the file successfully')
  })
  // fs.open(savedPath, 'w', function (err, fd) {
  //     fs.write(fd, buf, 0, buf.length, null, function (err) {
  //         fs.close(fd, function () {
  //             console.log('wrote the file successfully')
  //         })
  //     })
  // })
}

export function setMainWinProgressBar(p: number = 0) {
  if (wins.mainwin) {
    wins.mainwin.setProgressBar(p)
  }
}