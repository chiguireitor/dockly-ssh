'use strict'

const ShellWidgetTemplate = require('../src/widgetsTemplates/shell.widget.template')

class ShellWidget extends ShellWidgetTemplate {
  getLabel () {
    //const list = ShellWidgetTemplate.widgetsRepo.get('containerList')
    let containerName = this.getCurrentContainerName()
    return 'Dockly Shell - ' + containerName
  }
}

module.exports = ShellWidget
