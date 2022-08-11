import { PDFDocument } from 'pdf-lib'
import fs from 'fs'

export async function mergePdf(fileList: any[], savedPath: string) {
  const doc = await PDFDocument.create()
  for (const file of fileList) {
    const {path, name} = file
    const pdfBuffer = fs.readFileSync(path)
    const pdf = await PDFDocument.load(pdfBuffer); 
    const copiedPages = await doc.copyPages(pdf, pdf.getPageIndices())
    copiedPages.forEach((page) => {
      doc.addPage(page)
    }); 
  }
  const buf = await doc.save();
  fs.open(savedPath, 'w', function (err, fd) {
      fs.write(fd, buf, 0, buf.length, null, function (err) {
          fs.close(fd, function () {
              console.log('wrote the file successfully')
          })
      })
  })
}