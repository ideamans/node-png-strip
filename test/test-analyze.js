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
  });
})

test('Analyze dices.png from buffer', async t => {
  const buffer = Fs.readFileSync(Path.join(__dirname, 'data/dices.png'))
  const result = await PngStrip.analyze(buffer)
  t.deepEqual(result, {
    IDAT: { count: 1, size: 383532 },
    IEND: { count: 1, size: 0 },
    IHDR: { count: 1, size: 13 }
  });
})