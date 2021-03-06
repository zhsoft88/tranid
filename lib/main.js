/**
 * tranid: Node.js based chromium devtools for generating translation id.
 *
 * @see https://github.com/zhsoft88/tranid
 *
 * @author zhsoft88 <zhsoft88@icloud.com> (https://github.com/zhsoft88)
 * @copyright © 2018 zhuatang.com
 * @license MIT
 */

const FS = require('fs')
const PATH = require('path')
const {tranid} = require('./tranid.js')

function error(mesg) {
  console.error(`Error: ${mesg}`)
}

function warn(mesg) {
  console.error(`Warning: ${mesg}`)
}

function error_exit(mesg) {
  error(mesg)
  process.exit(1)
}

function parse_args() {
  const result =  {
    help: false,
    version: false,
    trailings: [],
  }
  let i = 2
  while (i < process.argv.length) {
    const arg = process.argv[i]
    if (arg == '--help' || arg == '-h') {
      result.help = true
    } else if (arg == '--version' || arg == '-v') {
      result.version = true
    } else {
      // take all trailing arguments
      for (;i < process.argv.length; i++) {
        const path = process.argv[i]
        result.trailings.push(path)
      }
      break
    }
    i++
  }
  return result
}

function usage() {
  console.log(
`Node.js based chromium devtools for generating translation id

Usage:
  tranid [OPTIONS] grd_or_grdp_file [message_name... or translation_id...]

Options:
  -h, --help: Help
  -v, --version : Version

Arguments:
  grd_or_grdp_file: grd file or grdp file or - (stands for STDIN)
  message_name...: zero or more message names (for generating translation ids)
  or
  translation_id...: zero or more translation ids (for finding corresponding message names)
`)
}

function help_exit() {
  usage()
  process.exit(0)
}

function do_work(args) {
  let grd_content
  const file = args.trailings[0]
  if (file == '-') {
    grd_content = args.stdin_data
  } else {
    try {
      grd_content = FS.readFileSync(file, 'utf8')
    } catch (e) {
      error_exit(`read failed, file: ${file}`)
    }
  }
  function output(result, suffix='') {
    for (const [key, value] of result) {
      console.log(`${key} ${value}${suffix}`)
    }
  }

  const message_names = args.trailings.slice(1)
  let [result, parts] = tranid(grd_content, message_names)
  output(result)

  // zhsoft88: also check grdp files
  if (parts.length > 0 && file != '-') {
    function resolve_parts(file, parts) {
      const dir = PATH.dirname(file)
      for (let i = 0; i < parts.length; i++) {
        const item = parts[i]
        parts[i] = PATH.isAbsolute(item) ? item : PATH.join(dir, item)
      }
    }
    resolve_parts(file, parts)
    while (parts.length > 0) {
      const path = parts[0]
      try {
        grd_content = FS.readFileSync(path, 'utf8')
        let [result, subparts] = tranid(grd_content, message_names)
        if (result.length > 0) {
          const partname = PATH.basename(path)
          output(result, ` (${partname})`)
        }
        if (subparts.length > 0) {
          resolve_parts(path, subparts)
          parts.concat(subparts)
        }
      } catch (e) {
        error(`read failed, file: ${path}`)
      }
      parts.splice(0, 1)
    }
  }
}

function run() {
  const args = parse_args()
  if (args.help) {
    help_exit()
  }

  if (args.version) {
    const pjson = require('../package.json')
    console.log(pjson.version)
    process.exit(0)
  }

  if (args.trailings.length == 0) {
    usage()
    error('no grd file found')
    process.exit(1)
  }

  if (args.trailings[0] == '-') {
    // read stdin first
    process.stdin.resume()
    process.stdin.setEncoding('utf8')

    var stdin_data = ''
    process.stdin.on('data', function(chunk) {
      stdin_data += chunk
    })
    process.stdin.on('end', function() {
      args.stdin_data = stdin_data
      do_work(args)
    })
  } else {
    do_work(args)
  }
}

module.exports.run = run
