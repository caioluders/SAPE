const {dialog} = require('electron').remote ;
var remote = require('electron').remote;
var path = require('path');
const settings = require('electron-settings');
var buildEditorContextMenu = remote.require('electron-editor-context-menu');
const fs = require('fs');
var SQL = require('sql.js') ;
var file = fs.readFileSync(__dirname+'/js/words.db') ;
var db = new SQL.Database(file);
const ipcRenderer = require('electron').ipcRenderer;
var file_path = '';

//those are self explenatory
ipcRenderer.on('open-file', function() {
  openFile() ;
});

ipcRenderer.on('get-rime', function() {
  getRimes() ;
});

ipcRenderer.on('save-file', function() {
  console.log(file_path)
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
  if (!e.target.closest('textarea, input, [contenteditable="true"]')) return;
  
  var menu = buildEditorContextMenu();
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
    dialog.showSaveDialog(function(file) {
        fs.writeFile(file, text, function(err) {
            file_path = file ;
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
  document.getElementById("rime_sidebar").style.width = "12em"; // open sidebar
  var word = window.getSelection().toString() ;
  document.getElementById('rime_list').innerHTML = "" ;
  settings.get('numbers_letters').then(val => { // god I don't know how to async
    var letters_number = val ;
    settings.get('language').then(lan => { // I REALLY DON'T KNOW HOW TO ASYNC
      // uses substr to get the last x letters_number
      var language = lan ;
      var query = "SELECT * from words_"+lan+" where substr(word,-"+letters_number.toString()+") == '"+word.substr(-letters_number)+"'" ;
      console.log(lan) ;
      var rimes = db.exec(query) ; // sql injection, lols
      console.log(rimes[0]);
      for (var i = 0 ; i < rimes[0].values.length ; i++) {
        var li = document.createElement('li') ;
        li.appendChild(document.createTextNode(rimes[0].values[i])) ;
        document.getElementById('rime_list').appendChild(li) ;
      }
    });
  });
 
}
