// synchronize the two scrolls
$(document).ready(function() {
  $("#counter").scroll(function () { 
          $("#main_text").scrollTop($("#counter").scrollTop());
          $("#main_text").scrollLeft($("#counter").scrollLeft());
      });
  $("#main_text").scroll(function () { 
          $("#counter").scrollTop($("#main_text").scrollTop());
          $("#counter").scrollLeft($("#main_text").scrollLeft());
      });

});

// count the fonetic syllable for a sentence, tested only in pt/br
function countSilabas(line) {
    var almost_done = line.replace(/[.,\/#$%\^&\*;:{}=\-_`~()]/g,"").split(" ") ; // remove pontuations, but not "!" that changes the metric
    var silabas_counter = 0 ; // main counter
    var list_consoantes =  Array.from("çbcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ") ; // almost forgot the "ç"
    var list_vogais = Array.from("aeiouAEIOUõã") ;
    var list_acentuadas = Array.from("àáâäåæèéêëæìíîïòóôöøùúûü");
    var f_v = false ; // flag to check if the last letter was a vogal
    var p_c = false ;
    console.log(almost_done) ;

    // holy shit that code is ugly , PLZ DONT READ IT , IT WILL MAKE YOUR EYES BURN !!!
    for (var i = 0 ; i <  almost_done.length; i++) { // word
      for (var y = 0; y < almost_done[i].length ;y++) { // letter
        if (list_acentuadas.indexOf(almost_done[i][y]) > -1) { // toda acentuada conta
          console.log("ac ->"+almost_done[i][y]) ;
          silabas_counter += 1 ;  
          f_v = false ; // it's a vogal, but a tonic one
        } else {
          if (list_vogais.indexOf(almost_done[i][y]) > -1) { // if vogal
            f_v = true;
            if (y == almost_done[i].length-1) { // check if last letter of word
              var tf = true ;
              for ( var k = 0 ; k < almost_done[i].length ; k++ ) {
                if (list_consoantes.indexOf(almost_done[i][k]) > -1 ) {
                  tf = false ;
                  break ;
                }
              }
              if ( tf && i != 0 ) { // if last letter is a vogal and isn't the first word
                if (list_vogais.indexOf(almost_done[i-1][almost_done[i].length-1]) > -1) { // if begin of the next word is a vogal
                  f_v = false ;
                  continue ; // goto
                }
              }
              console.log(almost_done[i][y]) ;
              silabas_counter += 1 ;
              f_v = false;
            }
            if (y == 0 && i != 0){
              if (list_vogais.indexOf(almost_done[i-1][almost_done[i-1].length-1]) > -1) {
                f_v = false ;
              }
            }
          } else {
            if ( (list_consoantes.indexOf(almost_done[i][y]) > -1) && f_v ){
                silabas_counter += 1 ;  
                f_v = false ;
                p_c = true ;
                console.log(almost_done[i][y]) ;
            }
          }
        }  
      }
    }
    if (silabas_counter >= 2 && (almost_done[almost_done.length-1][almost_done[almost_done.length-1].length-1] != '!') ) {
      silabas_counter -= 1 ; // BUG FIX
    }

    return silabas_counter ;
}

// called every time the text changes, send each to count and update the left bar
function textarea_silabas() {
  var textarea = document.getElementById('main_text').value ;
  var lines = textarea.split("\n") ;
  var new_lines = "" ;
  for (var i = 0 ; i < lines.length ; i++ ) {
    new_lines += countSilabas(lines[i]).toString()+"\n"
  }
  document.getElementById('counter').value = new_lines;
  console.log(new_lines) ;
}

function closeNav() {
    document.getElementById("rime_sidebar").style.width = "0";
}