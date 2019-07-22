const Extract = require('png-chunks-extract'),
  Encode = require('png-chunks-encode'),
  Fs = require('fs')

const types = {
  core: ['IHDR', 'PLTE', 'IDAT', 'IEND'],
  transparency: ['tRNS'],
  colorSpace: ['gAMA', 'cHRM', 'sRGB', 'iCCP', 'sBIT'],
  textual: ['tEXt', 'zTXt', 'iTXt'],
  misc: ['bKGD', 'pHYs', 'sPLT', 'hIST'],
  time: ['tIME'],
}

async function toBuffer(png) {
  if (png instanceof Buffer) return png

  return new Promise((resolve, reject) => {
    Fs.readFile(png, (err, buffer) => {
      if (err) return reject(err)
      resolve(buffer)
    })
  })
}

async function analyze(png) {
  const buffer = await toBuffer(png)
  const chunks = Extract(buffer)
  const aggs = chunks.reduce((hash, chunk) => {
    const record = hash[chunk.name] = hash[chunk.name] || { count: 0, size: 0 }
    record.count++
    record.size += chunk.data.length
    return hash
  }, {})

  return aggs
}

async function strip(png, keep=[types.core, types.transparency, types.colorSpace]) {
  const buffer = await toBuffer(png)
  const chunks = Extract(buffer)

  const flatten = keep.reduce((flat, t) => {
    if (t instanceof Array)
      flat = flat.concat(t)
    else
      flat.push(t)
    return flat
  }, [])

  const strip = chunks.filter(chunk => flatten.includes(chunk.name))
  return Buffer.from(Encode(strip))
}

module.exports = {
  types,
  toBuffer,
  analyze,
  strip,
}