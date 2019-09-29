/**
 * tranid: Node.js based chromium devtools for generating translation id.
 *
 * @see https://github.com/zhsoft88/tranid
 *
 * @author zhsoft88 <zhsoft88@icloud.com> (https://github.com/zhsoft88)
 * @copyright © 2018 zhsoft88
 * @license MIT
 */

const { JSDOM } = require('jsdom')
const Long = require('long')
const md5 = require('md5')

function tranid(grd_content, message_names) {
  function string_for_element(element) {
    let string = ''
    for (const node of element.childNodes) {
      if (node.nodeType == 1) {
        string += node.getAttribute('name')
      } else {
        string += node.textContent
      }
    }
    return string.trim()
  }

  function tranid_for_element(element) {
    const string = string_for_element(element)
    const md5str = md5(string)
    const first = md5str.substr(0, 16)
    let fp = Long.fromString(first, true, 16)
    // interpret fingerprint as signed longs
    if (fp.gte(Long.fromString("8000000000000000", false, 16))) {
      fp = Long.fromInt(0, false).sub(fp.not().and(Long.fromString("FFFFFFFFFFFFFFFF", false, 16)).add(1))
    }
    fp = fp.and(Long.fromString("7fffffffffffffff", false, 16))
    return fp.toString()
  }

  function make_tranid(list, result) {
    for (const element of list) {
      const tid = tranid_for_element(element)
      result.push([element.getAttribute('name'), tid])
    }
  }

  const result = []
  const dom = new JSDOM(grd_content, {contentType: 'text/xml'})
  if (message_names.length > 0) {
    const ch = message_names[0][0]
    if (ch >= '0' && ch <= '9') {
      // translation ids
      const list = dom.window.document.querySelectorAll('message')
      const temp = []
      make_tranid(list, temp)
      for (const [name, tid] of temp) {
        if (message_names.includes(tid)) {
          result.push([name, tid])
        }
      }
    } else {
      // message names
      for (const name of message_names) {
        const list = dom.window.document.querySelectorAll(`message[name="${name}"]`)
        make_tranid(list, result)
      }
    }
  } else {
    const list = dom.window.document.querySelectorAll('message')
    make_tranid(list, result)
  }
  const parts = []
  {
    const list = dom.window.document.querySelectorAll('part')
    for (const element of list) {
      const file = element.getAttribute('file')
      parts.push(file)
    }
  }
  return [result, parts]
}

module.exports.tranid = tranid
