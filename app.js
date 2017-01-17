const {dialog} = require('electron').remote ;
var remote = require('electron').remote;
var path = require('path');
const settings = require('electron-settings');
var buildEditorContextMenu = remote.require('electron-editor-context-menu');
const fs = require('fs');
var SQL = require('sql.js') ;
var file = fs.readFileSync(__dirname+'/js/ptbr_words.db') ;
var db = new SQL.Database(file);
const ipcRenderer = require('electron').ipcRenderer;
var file_path = ''

ipcRenderer.on('open-file', function() {
  openFile() ;
});

ipcRenderer.on('get-rime', function() {
  getRimes() ;
});

ipcRenderer.on('save-file', function() {
	if (file_path === "") {
		saveAs() ;
	} else {
		saveFile() ;
	}
});

ipcRenderer.on('new-file', function() {
  newFile() ;
});




window.addEventListener('contextmenu', function(e) {
  // Only show the context menu in text editors.
  if (!e.target.closest('textarea, input, [contenteditable="true"]')) return;
  
  var menu = buildEditorContextMenu();

  // The 'contextmenu' event is emitted after 'selectionchange' has fired but possibly before the
  // visible selection has changed. Try to wait to show the menu until after that, otherwise the
  // visible selection will update after the menu dismisses and look weird.
  setTimeout(function() {
    menu.popup(remote.getCurrentWindow());
  }, 30);
});

function newFile() {
	const remote = require('electron').remote;
    const BrowserWindow = remote.BrowserWindow;
    var win = new BrowserWindow({ width: 800, height: 600 });
}

function saveFile() {
    let text = document.getElementById('main_text').value;
    fs.writeFile(file_path, text, function(err) {
        if(err) {
            return console.log(err);
        }
    });

};

function saveAs() {
    let text = document.getElementById('main_text').value;
    dialog.showSaveDialog(function(file_path) {
        fs.writeFile(file_path, text, function(err) {
            if(err) {
                return console.log(err);
            }
        });
    })
};


function openFile() {
    file_path = dialog.showOpenDialog({properties: ['openFile']})[0];
    fs.readFile(file_path, function(err,data){
        if(err) throw err;
        fileString  = data.toString();
        document.getElementById('main_text').value = fileString;
    });
};

function getRimes() {
  document.getElementById("rime_sidebar").style.width = "12em";
  var word = window.getSelection().toString() ;
  document.getElementById('rime_list').innerHTML = "" ;
  var rimes = db.exec("SELECT * from word where substr(word.word,-4) == '"+word.substr(-4)+"'") ; // sql injection lols
  for (var i = 0 ; i < rimes[0].values.length ; i++) {
    var li = document.createElement('li') ;
    li.appendChild(document.createTextNode(rimes[0].values[i][1])) ;
    document.getElementById('rime_list').appendChild(li) ;
  }
}
