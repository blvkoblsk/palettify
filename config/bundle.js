const fs = require('fs-extra')
const readFile = fs.readFile
const writeFile = fs.writeFile
const relative = require('path').relative
const gzip = require('zlib').gzip
const rollup = require('rollup')
const uglify = require('uglify-js')

module.exports = build

function build (entries) {
  let built = 0
  const total = entries.length
  const next = () => {
    buildEntry(entries[built]).then(() => {
      built++
      if (built < total) {
        next()
      } else {
        finished()
      }
    }).catch(logError)
  }
  next()
}

function buildEntry (config) {
  const isProd = /min\.js$/.test(config.dest)
  return rollup.rollup(config).then(bundle => {
    const code = bundle.generate(config).code
    if (isProd) {
      var minified = (config.banner ? config.banner + '\n' : '') + uglify.minify(code, {
          fromString: true,
          output: {
            screw_ie8: true,
            ascii_only: true
          },
          compress: {
            pure_funcs: ['makeMap']
          }
        }).code
      return write(config.dest, minified).then(zip(config.dest))
    } else {
      return write(config.dest, code)
    }
  })
}

function write (dest, code) {
  return new Promise(function (resolve, reject) {
    writeFile(dest, code, function (err) {
      if (err) { return reject(err) }
      console.log(blue(relative(process.cwd(), dest)) + ' ' + getSize(code))
      resolve()
    })
  })
}

function zip (file) {
  return function () {
    return new Promise(function (resolve, reject) {
      readFile(file, function (err, buf) {
        if (err) { return reject(err) }
        gzip(buf, function (err, buf) {
          if (err) { return reject(err) }
          write(file + '.gz', buf).then(resolve)
        })
      })
    })
  }
}

function getSize (code) {
  return (code.length / 1024).toFixed(2) + 'kb'
}

function logError (e) {
  console.log(e)
}

function blue (str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m'
}

function finished () {
  try {
    fs.copySync(relative(process.cwd(), 'dist/palettify.min.js'), relative(process.cwd(), 'docs/scripts/palettify.min.js'))
    fs.copySync(relative(process.cwd(), 'dist/palettify.styles.min.js'), relative(process.cwd(), 'docs/scripts/palettify.styles.min.js'))
    fs.copySync(relative(process.cwd(), 'dist/palettify.min.css'), relative(process.cwd(), 'docs/styles/palettify.min.css'))
    fs.moveSync(relative(process.cwd(), 'dist/_grid_docs.min.css'), relative(process.cwd(), 'docs/styles/grid.min.css'), {overwrite: true})
  } catch (err) {
    console.error(err)
  }
  console.log('palettify.js moved')
  console.log('palettify styles moved')
}
