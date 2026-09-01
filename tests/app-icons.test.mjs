import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const readPngSize = (path) => {
  const png = readFileSync(new URL(path, import.meta.url))
  return [png.readUInt32BE(16), png.readUInt32BE(20)]
}

test('Safari 主畫面圖示會依一般站與忠班切換', () => {
  const index = readFileSync(new URL('../index.html', import.meta.url), 'utf8')

  assert.match(index, /apple-touch-icon/)
  assert.match(index, /myclass\.kiddorpg\.cc/)
  assert.match(index, /#\\\/class\\\/vwej3/)
  assert.match(index, /manifest-class\.webmanifest/)
  assert.match(index, /manifest-common\.webmanifest/)
})

for (const [site, expectedName, expectedStartUrl] of [
  ['class', '一忠', '/#/class/vwej3'],
  ['common', '小鈴鐺', '/#/'],
]) {
  test(`${site} manifest 設定正確`, () => {
    const manifest = JSON.parse(
      readFileSync(new URL(`../public/manifest-${site}.webmanifest`, import.meta.url), 'utf8'),
    )

    assert.equal(manifest.short_name, expectedName)
    assert.equal(manifest.start_url, expectedStartUrl)
    assert.deepEqual(manifest.icons.map(({ sizes }) => sizes), ['192x192', '512x512'])
  })
}

for (const icon of ['class-loyalty', 'common-bell']) {
  for (const size of [180, 192, 512]) {
    test(`${icon}-${size}.png 尺寸正確`, () => {
      assert.deepEqual(readPngSize(`../public/icons/${icon}-${size}.png`), [size, size])
    })
  }
}
