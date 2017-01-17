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

function countSilabas(line) {
    var almost_done = line.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"").split(" ") ;
    var silabas_counter = 0 ;
    var list_consoantes =  Array.from("bcdfghjklmnpqrstvwxyzBCDFGHJKLMNPQRSTVWXYZ")
    var list_vogais = Array.from("aeiouAEIOUõã") ;
    var list_acentuadas = Array.from("àáâäåæèéêëæìíîïòóôöøùúûü");
    var f_v = false ;
    var p_c = false ;
    console.log(almost_done) ;

    for (var i = 0 ; i <  almost_done.length; i++) {
      for (var y = 0; y < almost_done[i].length ;y++) {
        if (list_acentuadas.indexOf(almost_done[i][y]) > -1) {
          console.log("ac ->"+almost_done[i][y]) ;
          silabas_counter += 1 ;  
          f_v = false ;
        } else {
          if (list_vogais.indexOf(almost_done[i][y]) > -1) {
            f_v = true;
            if (y == almost_done[i].length-1) {
              var tf = true ;
              for ( var k = 0 ; k < almost_done[i].length ; k++ ) {
                if (list_consoantes.indexOf(almost_done[i][k]) > -1 ) {
                  tf = false ;
                  break ;
                }
              }
              if ( tf && i != 0 ) {
                if (list_vogais.indexOf(almost_done[i-1][almost_done[i].length-1]) > -1) {
                  f_v = false ;
                  continue ;
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
    if (silabas_counter > 2) {
      silabas_counter -= 1 ;
    }

    return silabas_counter ;
}

function textarea_silabas() {
  var textarea = document.getElementById('main_text').value ;
  var lines = textarea.split("\n") ;
  var new_lines = "" ;
  for (var i = 0 ; i < lines.length ; i++ ) {
    new_lines += countSilabas(lines[i]).toString()+" | \n"
  }
  document.getElementById('counter').value = new_lines;
  console.log(new_lines) ;
}

function closeNav() {
    document.getElementById("rime_sidebar").style.width = "0";
}