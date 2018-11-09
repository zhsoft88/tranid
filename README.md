# tranid
Node.js based chromium devtools for generating translation id

## Installation

```sh
$ [sudo] npm install -g tranid
```

## Usage

### <abbr title="Command Line Interface">CLI</abbr>

```
Usage:
  tranid [OPTIONS] grd_or_grdp_file [message_name...]

Options:
  -h, --help: Help
  -v, --version : Version

Arguments:
  grd_or_grdp_file: grd file or grdp file or - (stands for STDIN)
  message_name...: zero or more message names
```

* Generating translation id for used in xtb files:

  ```sh
  $ tranid chromium_strings.grd
  ```

  Generate translation ids of all message names in chromium_strings.grd

  ```sh
  $ tranid chromium_strings.grd IDS_PRODUCT_NAME IDS_TASK_MANAGER_TITLE
  ```

  Generate translation ids of IDS_PRODUCT_NAME and IDS_TASK_MANAGER_TITLE in chromium_strings.grd


### <abbr title="As Nodejs Module Interface">As Nodejs Module</abbr>

```js
const {tranid} = require('tranid')
const FS = require('fs')

FS.readFile('generated_resources.grd', 'utf8', function(err, data) {
  if (err)
    throw err

  // usage: tranid(grd_content, message_names)
  const list = tranid(data, ['IDS_PRODUCT_NAME', 'IDS_TASK_MANAGER_TITLE'])
  for (const [name, tid] of list) {
    console.log(`${name} ${tid}`)
  }
}
```
