import test from 'ava'
import PngStrip from '../'
import Path from 'path'
import Fs from 'fs'

test('Analyze dices.png from path', async t => {
  const result = await PngStrip.analyze(Path.join(__dirname, 'data/dices.png'))
  t.deepEqual(result, {
    IDAT: { count: 1, size: 383532 },
    IEND: { count: 1, size: 0 },
    IHDR: { count: 1, size: 13 }
  })
})

test('Analyze dices.png from buffer', async t => {
  const buffer = Fs.readFileSync(Path.join(__dirname, 'data/dices.png'))
  const result = await PngStrip.analyze(buffer)
  t.deepEqual(result, {
    IDAT: { count: 1, size: 383532 },
    IEND: { count: 1, size: 0 },
    IHDR: { count: 1, size: 13 }
  })
})

test('Analyze dices8.png from buffer', async t => {
  const buffer = Fs.readFileSync(Path.join(__dirname, 'data/dices8.png'))
  const result = await PngStrip.analyze(buffer)
  t.deepEqual(result, {
    IHDR: { count: 1, size: 13 },
    gAMA: { count: 1, size: 4 },
    sRGB: { count: 1, size: 1 },
    PLTE: { count: 1, size: 768 },
    tRNS: { count: 1, size: 247 },
    IDAT: { count: 8, size: 60299 },
    IEND: { count: 1, size: 0 }
  })
})