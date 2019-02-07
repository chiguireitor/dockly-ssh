'use strict'

const EventEmitter = require('events')
const baseWidget = require('../src/baseWidget')
const MODES = require('../lib/modes')

class myWidget extends baseWidget(EventEmitter) {
  constructor ({ blessed = {}, contrib = {}, screen = {}, grid = {}, mode }) {
    super()
    this.createWidget = this.createWidget.bind(this)
    this.blessed = blessed
    this.contrib = contrib
    this.screen = screen
    this.grid = grid
    this.mode = mode

    this.label = ''
    this.widget = this.createWidget()
  }

  init () {
    return null
  }

  getWidget () {
    return this.widget
  }

  onShell() {
    const sh = this.widgetsRepo.get('shell')
    return sh.shellOpen
  }

  createWidget () {
    const baseCommands = {
      'refresh': {
        keys: ['='],
        callback: () => { if (!this.onShell()) { this.emit('key', '=') } }
      },
      'info': {
        keys: ['i'],
        callback: () => { if (!this.onShell()) { this.emit('key', 'i') } }
      },
      'logs': {
        keys: ['[RETURN]'],
        callback: () => { if (!this.onShell()) { this.emit('key', '[RETURN]') } }
      }
    }

    const containerCommands = {
      'shell': {
        keys: ['l'],
        callback: () => { if (!this.onShell()) { this.emit('key', 'l') } }
      },
      'restart': {
        keys: ['r'],
        callback: () => { if (!this.onShell()) { this.emit('key', 'r') } }
      },
      'stop': {
        keys: ['s'],
        callback: () => { if (!this.onShell()) { this.emit('key', 's') } }
      },
      'menu': {
        keys: ['m'],
        callback: () => { if (!this.onShell()) { this.emit('key', 'm') } }
      },
      'search': {
        keys: ['/'],
        callback: () => { if (!this.onShell()) { this.emit('key', '/') } }
      }
    }

    const commands = this.mode === MODES.container ? Object.assign({}, baseCommands, containerCommands) : baseCommands

    return this.grid.gridObj.set(...this.grid.gridLayout, this.blessed.listbar, {
      keys: false,
      mouse: true,
      style: {
        prefix: {
          fg: 'yellow'
        },
        bg: 'green',
        item: {
          bg: 'black',
          hover: {
            bg: 'blue'
          },
          focus: {
            bg: 'blue'
          }
        },
        selected: {
          bg: 'blue'
        }
      },
      autoCommandKeys: false,
      commands:
        Object.assign(
          {},
          commands,
          {
            'help': {
              keys: ['h'],
              callback: () => { if (!this.onShell()) { this.emit('key', 'h') } }
            },
            'view mode': {
              keys: ['v'],
              callback: () => { if (!this.onShell()) { this.emit('key', 't') } }
            },
            'disconnect': {
              keys: ['C-q'],
              callback: () => { if (!this.onShell()) { this.emit('key', 'q') } }
            }
          })
    })
  }
}

module.exports = myWidget
