const settings = require('electron-settings');

$(document).ready(function() {
  settings.get('font_size').then(val => {
  	document.getElementById('font_size').value = val ;
  });
  settings.get('numbers_letters').then(val => {
  	document.getElementById('letters').value = val ;
  });
});

function saveSettings() {
	settings.set("font_size",document.getElementById('font_size').value).then(() => {
	  settings.set("numbers_letters",document.getElementById('letters').value);
	}); //weird async
}