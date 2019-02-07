'use strict'
const path = require('path')
const fs = require('fs')
const baseWidget = require('../src/baseWidget')
const TerminalLauncher = require('opn-shell')

const { spawn } = require('child_process')

class hook extends baseWidget() {
  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      // on refresh keypress, update all containers and images information
      if (keyString === 'l') {
        this.openShell()
      }
    })
  }

  openShell () {
    throw new Error(dockerRunScriptPath)
    
    const localExecution = false
    const dockerRunScriptPath = `${__dirname}/../dockerRunScript.sh`
    let containerId = this.widgetsRepo.get('containerList').getSelectedContainer()

    throw new Error(dockerRunScriptPath)

    if (containerId) {
      let containerIdFile = path.join(__dirname, '/../containerId.txt')
      fs.writeFile(containerIdFile, containerId, 'utf8', (err) => {
        if (!err) {
          if (localExecution) {
            TerminalLauncher.launchTerminal({ path: dockerRunScriptPath }).catch((err) => {
              console.log(err)
              const actionStatus = this.widgetsRepo.get('actionStatus')

              const title = 'Shell login to container'
              const message = 'Failed opening shell login for container: ' + containerId + ' - ' + err

              actionStatus.emit('message', {
                title: title,
                message: message
              })
            })
          } else {
            let shellWidget = this.widgetsRepo.get('shell')
            if (!shellWidget) {
              throw new Error('shell widget doesnt exists')
            }
            shellWidget.show(dockerRunScriptPath)
            /*const trm = spawn(dockerRunScriptPath, [], {
              stdio: 'inherit'
            })*/

            /*trm.stdout.pipe(process.stdout)
            trm.stderr.pipe(process.stderr)
            //process.stdin.pipe(trm.stdin)

            trm.on('close', (code) => {
              //
            })*/
          }
        }
      })
    }
  }
}

module.exports = hook
