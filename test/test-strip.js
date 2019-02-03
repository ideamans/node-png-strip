import test from 'ava'
import PngStrip from '../'
import Path from 'path'
import Extract from 'png-chunks-extract'
import Encode from 'png-chunks-encode'

function utilSortedChunkNameSet(buffer) {
  const chunks = Extract(buffer)
  const set = new Set(chunks.map(c => c.name).sort())
  return set
}

test.beforeEach(async t => {
  const dices8 = await PngStrip.toBuffer(Path.join(__dirname, 'data/dices8.png'))
  const chunks = Extract(dices8)

  // Insert dummy chunks
  const types = ['cHRM', 'tEXt', 'zTXt', 'iTXt', 'bKGD', 'pHYs', 'sBIT', 'hIST', 'tIME', 'dMMy'];
  for (let t of types) {
    const c = { name: t, data: new Uint8Array([]) }
    chunks.splice(-1, 0, c)
  }

  t.context.withAllChunks = new Buffer(Encode(chunks))
})

test('Default Keeps core, transparency and colorSpace', async t => {
  const buffer = await PngStrip.strip(t.context.withAllChunks)
  const set = utilSortedChunkNameSet(buffer)
  t.deepEqual(set, new Set(['IDAT', 'IEND', 'IHDR', 'PLTE', 'cHRM', 'gAMA', 'sBIT', 'sRGB', 'tRNS']))
})

test('Keep only core', async t => {
  const buffer = await PngStrip.strip(t.context.withAllChunks, PngStrip.types.core)
  const set = utilSortedChunkNameSet(buffer)
  t.deepEqual(set, new Set(['IDAT', 'IEND', 'IHDR', 'PLTE']))
})

test('Keep only core and misc', async t => {
  const buffer = await PngStrip.strip(t.context.withAllChunks, [PngStrip.types.core, PngStrip.types.misc])
  const set = utilSortedChunkNameSet(buffer)
  t.deepEqual(set, new Set(['IDAT', 'IEND', 'IHDR', 'PLTE', 'bKGD', 'hIST', 'pHYs']))
})

test('Keep only core and dummy', async t => {
  const buffer = await PngStrip.strip(t.context.withAllChunks, [PngStrip.types.core, 'dMMy'])
  const set = utilSortedChunkNameSet(buffer)
  t.deepEqual(set, new Set(['IDAT', 'IEND', 'IHDR', 'PLTE', 'dMMy']))
})
