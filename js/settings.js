const settings = require('electron-settings');
// get the user settings
$(document).ready(function() {
  settings.get('font_size').then(val => {
  	document.getElementById('font_size').value = val ;
  });
  settings.get('numbers_letters').then(val => {
  	document.getElementById('letters').value = val ;
  });
});

// save the user settings
function saveSettings() {
  settings.set("numbers_letters",document.getElementById('letters').value);
  settings.set("language",document.getElementById('language').options[document.getElementById('language').selectedIndex].value);
}