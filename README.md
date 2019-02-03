Node module to strip PNG chunks to reduce file size.

# Usage

```
const PngStrip = require('png-strip'),
  fs = require('fs')

const buffer = await PngStrip.strip('/path/to/image.png or buffer')
fs.writeFileSync('/path/to/strip.png', buffer)
```

# Chunks kept

```
// Keep core(IHDR, PLTE, IDAT, IEND) and 'tEXt'
const buffer = await PngStrip.strip(src, [PngStrip.types.core, 'tEXt'])
```

To set names of chunks to keep, pass an array or an array of array.

`PngStrip.types` is aliases.

```
const types = {
  core: ['IHDR', 'PLTE', 'IDAT', 'IEND'],
  transparency: ['tRNS'],
  colorSpace: ['gAMA', 'cHRM', 'sRGB', 'iCCP', 'sBIT'],
  textual: ['tEXt', 'zTXt', 'iTXt'],
  misc: ['bKGD', 'pHYs', 'sPLT', 'hIST'],
  time: ['tIME'],
}
```

See http://www.libpng.org/pub/png/spec/iso/index-object.html#11Chunks