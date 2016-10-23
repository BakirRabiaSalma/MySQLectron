const electron = require('electron') // Electron
const nunjucks = require('nunjucks') // Nunjucks
const connectionSettings = require('./app/Controllers/ConnectionSettingsController')
const BrowserWindow = electron.BrowserWindow
const app = electron.app
const Menu = electron.Menu

let win

// This function will create the window of the page, expecting the connection settings in entry
function createWindow (conSettings) {
  win = new BrowserWindow({width: 1600, height: 1200})

  // We create the connection submenu
  let connectionSubMenu = [{
    label: 'Add a new connection',
    accelerator: 'Ctrl+N',
    click: function(){
      // TODO Create a page, with a form to add a connection setting
      connectionSettings.add({name:"localhost", host:"localhost", port:"3306", user:"root"}) // TODO remove
    }
  }]

  // We add one entry in the menu per connection setting
  for(let setting of conSettings) {
    connectionSubMenu[connectionSubMenu.length] = {
      label: setting.name,
      accelerator: '',
      click: function(){
        // TODO redirect to main page for this connection
        console.log(`Opening connection ${setting.name}, ${setting.host}:${setting.port} -u${setting.user}`)
      }
    }
  }

  let template = [{
    label: 'Connections',
    submenu: connectionSubMenu
  }]

  // Build the menu
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)

  // Load the main page
  win.loadURL('data:text/html,' + encodeURIComponent(nunjucks.render('test.njk', {username: "bob"})))

  win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

app.on('ready', function (){
  connectionSettings.list(createWindow)
})

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    connectionSettings.list(createWindow)
  }
})
