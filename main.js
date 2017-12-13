const electron = require('electron')
// Module to control application life.
const app = electron.app
const { Menu } = require('electron')
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const {dialog} = require('electron')
const path = require('path')
const targz = require('targz')
const url = require('url')
const fs = require('fs')
const settings = require('electron-settings');

let mainWindow

settings.setAll({
  font_size: 23,
  numbers_letters: 2,
  dark_mode: 1
});

function createWindow () {
  // Create the browser window.title
  mainWindow = new BrowserWindow({width: 1300, height: 800,backgroundColor: '#000',titleBarStyle:'hiddenInset'})

  // Check if the word database exists , decompress it if not
  // 100mb is tooooo much
  if ( !fs.existsSync(__dirname+"/js/words.db") ) {
    targz.decompress({
      src:__dirname+'/js/words.tar.gz',
      dest:__dirname+'/js/'
    }, function(err){
      if(err){
        console.log(err);
      } else {
        console.log("Extracted database") ;
        fs.unlink(__dirname+"/js/words.tar.gz",(err)=>{
          if (err) throw err ;
          console.log("Deleted words.tar.gz") ;
        }) ;
      }
    }
    );
  }

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.loadURL("file://" + __dirname + "/index.html");

  mainWindow.webContents.executeJavaScript(`
    var path = require('path');
    module.paths.push(path.resolve('node_modules'));
    module.paths.push(path.resolve('../node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
    path = undefined;
  `);

   var template = [{
        label: "Application",
        submenu: [
            { label: "About Application", selector: "orderFrontStandardAboutPanel:" },
            { type: "separator" },
            { label: "Settings", accelerator: "", click: function() { openSettings(); }},
            { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
        ]}, {
          label: "File",
          submenu: [
            { label: "New", accelerator:"CmdOrCtrl+n",click:function() {
                createWindow() ;
            } },
            { label: "Open", accelerator:"CmdOrCtrl+o",click:function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('open-file');
            } },
            { label: "Save", accelerator:"CmdOrCtrl+s",click:function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('save-file');
            } }
          ]}, {
        label: "Edit",
        submenu: [
            { label: "Rime", accelerator:"CmdOrCtrl+r",click:function() {
                var focusedWindow = BrowserWindow.getFocusedWindow();
                focusedWindow.webContents.send('get-rime');
            } },
            { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
            { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
            { type: "separator" },
            { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
            { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
            { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
            { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
        ]}
    ];


  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
  
  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

function openSettings () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 250, height: 200,backgroundColor: '#000',titleBarStyle:'hidden'})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'settings.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.loadURL("file://" + __dirname + "/settings.html");

  mainWindow.webContents.openDevTools()

  mainWindow.webContents.executeJavaScript(`
    var path = require('path');
    module.paths.push(path.resolve('node_modules'));
    module.paths.push(path.resolve('../node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'electron.asar', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app', 'node_modules'));
    module.paths.push(path.resolve(__dirname, '..', '..', 'app.asar', 'node_modules'));
    path = undefined;
  `);



  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
