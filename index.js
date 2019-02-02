const Extract = require('png-chunks-extract'),
  Encode = require('png-chunks-encode'),
  Text = require('png-chunk-text'),
  Fs = require('fs')

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

module.exports = {
  analyze,
}