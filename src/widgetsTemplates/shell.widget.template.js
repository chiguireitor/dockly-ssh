'use strict'

const baseWidget = require('../../src/baseWidget')
const path = require('path')
const fs = require('fs')

const cfg = require('../../config.json')

class ShellWidgetTemplate extends baseWidget() {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {} }) {
    super()
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid
    this.label = this.getLabel()
    this.shell = ''
    this.args = []
    this.shellOpen = false
    this.containerName = '?'

    this.toggleVisibility = 0
  }

  getCurrentContainerName() {
    if (this.widgetsRepo) {
      return this.containerName
    } else {
      return '?'
    }
  }

  init () {
    if (!this.widgetsRepo.has('toolbar')) {
      return null
    }

    const toolbar = this.widgetsRepo.get('toolbar')
    toolbar.on('key', (keyString) => {
      if (keyString === 'l') {
        this.toggleVisibility = !this.toggleVisibility
        if (this.toggleVisibility) {
          // show the widget and focus on it,
          const dockerRunScriptPath = `${__dirname}/../../dockerRunScript.sh`
          const list = this.widgetsRepo.get('containerList')
          let containerId = list.getSelectedContainer()
          this.containerName = list.getSelectedContainerName()

          let containerIdFile = '~/.containerId' //path.join(__dirname, '/../../containerId.txt')

          //fs.writeFile(containerIdFile, containerId, 'utf8', (err) => {
            //if (!err) {
            this.label = 'Docker shell (sh) - ' + this.containerName
              this.shell = dockerRunScriptPath
              this.args = [containerId, this.containerName]
              this.widget = this.getWidget()
              this.screen.append(this.widget)
              this.update(this.getWidgetContents())
              this.screen.render()
              this.widget.focus()

              this.shellOpen = true

              this.widget.on('exit', () => {
                this.screen.remove(this.widget)
                this.shellOpen = false
                this.toggleVisibility = false
              })
            /*} else {
              throw new Error('Cannot write container ID')
            }*/
          //})
        } else {
          this.screen.remove(this.widget)
          this.shellOpen = false
        }
      }
    })
  }

  getSelectedItemId () {
    throw new Error('need to implement getSelectedItemId')
  }

  getItemById (itemId, cb) {
    throw new Error('need to implement getItemById')
  }

  getWidget () {
    return this.blessed.terminal({
      shell: this.shell,
      args: this.args,
      parent: this.screen,
      label: this.label,
      filter: (x) => {
        cfg.prohibitedWords.forEach(word => {
          x = x.replace(new RegExp(word, 'gi'), new Array(word.length).fill('*').join(''))
        })
        return x
      },
      scrollable: true,
      alwaysScroll: true,
      keys: true,
      style: {
        selected: {
          bg: 'green'
        }
      },
      border: {
        type: 'line'
      },
      hover: {
        bg: 'blue'
      },
      scrollbar: {
        fg: 'blue',
        ch: '|'
      },
      align: 'left',
      width: '100%',
      height: '100%',
      top: 'center',
      left: 'center',
      content: 'Loading...'
    })
  }

  getWidgetContents () {
    return ``
  }

  renderWidget () {
    return null
  }

  getLabel () {
    return 'Shell - ' + this.containerName
  }

  update (data) {
    this.widget.setContent(data)
    this.screen.render()
  }
}

module.exports = ShellWidgetTemplate
