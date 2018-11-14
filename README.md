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
  IDS_PROFILES_DISCONNECT_MANAGED_PROFILE_TEXT 918373042641772655
  IDS_PRODUCT_NAME 7337881442233988129
  IDS_SHORT_PRODUCT_NAME 7337881442233988129
  IDS_SXS_SHORTCUT_NAME 6061155539545534980
  ......
  ```

  Generate translation ids of all message names in chromium_strings.grd

  ```sh
  $ tranid chromium_strings.grd IDS_PRODUCT_NAME IDS_TASK_MANAGER_TITLE IDS_SETTINGS_ABOUT_PROGRAM
  IDS_PRODUCT_NAME 7337881442233988129
  IDS_TASK_MANAGER_TITLE 7223968959479464213
  IDS_SETTINGS_ABOUT_PROGRAM 1185134272377778587 (settings_chromium_strings.grdp)
  IDS_SETTINGS_ABOUT_PROGRAM 7549178288319965365 (settings_chromium_strings.grdp)
  ```

  Generate translation ids of IDS_PRODUCT_NAME, IDS_TASK_MANAGER_TITLE and IDS_SETTINGS_ABOUT_PROGRAM in chromium_strings.grd

  Note: for convenience, tranid also search included grdp files.


### <abbr title="As Nodejs Module Interface">As Nodejs Module</abbr>

```js
const {tranid} = require('tranid')
const FS = require('fs')

FS.readFile('generated_resources.grd', 'utf8', function(err, data) {
  if (err)
    throw err

  // usage: tranid(grd_content, message_names)
  const [list, parts] = tranid(data, ['IDS_PRODUCT_NAME', 'IDS_TASK_MANAGER_TITLE'])
  for (const [name, tid] of list) {
    console.log(`${name} ${tid}`)
  }
  if (parts.length > 0) {
    console.log(`found part files: ${parts}`)
  }
}
```
