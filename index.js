const fs = require('fs')
const sharp = require('sharp')
const er = require('exif-reader')
const dms2dec = require('dms2dec')

async function doit() {
  const inputJpg = './in.jpg'
  const image = sharp(inputJpg)

  const buffer = await image
    .withMetadata()
    .resize(200, 300, {
      fit: 'contain',
    })
    .jpeg({
      quality: 90,
    })
    .toBuffer()
  fs.writeFileSync('./output.jpg', buffer)
  console.log('finished resizing')

  const metadata = await image.metadata()
  // console.log(metadata)
  const parsedExif = er(metadata.exif)
  console.log(parsedExif.gps)
  const [latDec, lonDec] = dms2dec(
    parsedExif.gps.GPSLatitude,
    parsedExif.gps.GPSLatitudeRef,
    parsedExif.gps.GPSLongitude,
    parsedExif.gps.GPSLongitudeRef,
  )
  console.log(`lat=${latDec}, lng=${lonDec}`)
}

doit()
  .then(() => console.log('done'))
  .catch(console.error)
