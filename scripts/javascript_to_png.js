console.log('import:javascript_to_png.js');

/*
youtube resolutions
4320p (8k): 7680x4320
2160p (4K): 3840x2160
1440p (2k): 2560x1440
1080p (HD): 1920x1080
720p (HD): 1280x720
480p (SD): 854x480
360p (SD): 640x360
240p (SD): 426x240

youtube short max 60 seconds
max resolution 1080x1920 
aspect resolution is 9:16
*/

// Don't Touch Starts Here You should only modify within next frame

var resolution_width = 3840;
var resolution_height = 2160;

var frame_max = 1;
var frame_current = 1;

var text_area_id = 'id_textarea';

  async function download_frames(record_id, record_width, record_height) {
    console.log('download_frames:record_id:' + record_id);
    
    if (record_width != null && record_width != 'undefined' && record_height != null && record_height != 'undefined') {
      resolution_width = record_width;
      resolution_height = record_height;
    } else {
      console.log('resolution not defined: using default:width:' + resolution_width + ":height:" + resolution_height);
    }
  
    document.documentElement.style.setProperty('--pixels-width', (resolution_width + 'px'));
    document.documentElement.style.setProperty('--pixels-height', (resolution_height + 'px'));
    document.documentElement.style.setProperty('--grid-width', resolution_width);
    document.documentElement.style.setProperty('--grid-height', resolution_height);

    for (let i = 0; i < frame_max; i++) {
      await download_frame(record_id);
      await next_frame(frame_current);
    }
    
    frame_current = 0;
  }
  function download_frame(record_id) {
    console.log('download_frame:' + frame_current);
    console.log('width:' + resolution_width + ':height:' + resolution_height);
  
    let element = document.getElementById(record_id);

    get_all_words(text_area_id);
  
    element.width = resolution_width;
    element.height = resolution_height;
  
    window.innerWidth = resolution_width;
    window.innerHeight = resolution_height;
  
    window.dispatchEvent(new Event('resize'));
  
    console.log("resolution:width:" + resolution_width + ":resolution_height:" + resolution_height);
  
    return new Promise((resolve) => {
      html2canvas(element).then(function (canvas) {
        let link = document.createElement('a');
        link.href = canvas.toDataURL();
    
        let frame_name = '';
        if (frame_current < 10) {
          frame_name = 'frame_0000' + frame_current + '.png';
        } else if (frame_current < 100) {
          frame_name = 'frame_000' + frame_current + '.png';
        } else if (frame_current < 1000) {
          frame_name = 'frame_00' + frame_current + '.png';
        } else if (frame_current < 10000) {
          frame_name = 'frame_0' + frame_current + '.png';
        } else {
          frame_name = 'frame_' + frame_current + '.png';
        }
    
        link.download = frame_name;
        link.click();
    
        resolve(); // Resolve the promise once the download is complete
      });
    });
  }

  // Don't Touch Ends Here

  function next_frame(frame_number) {
    return new Promise((resolve) => {
      frame_current = frame_current + 1;
      console.log('next_frame:' + frame_number);
  
      // Your Code Starts Here
      get_all_words('id_textarea'); 
      // Your Code Ends Here

      resolve();
    });
}
function get_all_words(id_field){

  console.log('get_all_words');

// get input from textarea
let textarea = document.getElementById(id_field);

// Get the text content from the textarea
let text = textarea.value;

// Convert the text into an array of characters
let char_array = Array.from(text);

console.log( 'character_array:size:' + char_array.length );

// get determine which language
let language_current = get_detected_language( char_array );

console.log('language:' + language_current );

// get languages relavant details
let language_special_characters = get_special_characters(language_current);
let language_leading_words = get_leading_words(language_current);
let language_reserved_words = get_reserved_words(language_current);
let language_variables = get_variable_words(language_current); 
let language_functions = get_function_breaks( language_current );

//debug code to see results
console.log( 'language_special_characters:' + language_reserved_words  );
console.log( 'language_leading_words:' + language_reserved_words  );
console.log( 'language_reserved_words:' + language_reserved_words  );
console.log( 'language_variables:' + language_reserved_words  );
console.log( 'language_functions:' + language_reserved_words  );

// variables for loop needs them
let word_array = [];
let temp_word = '';
let temp_char = '';
let count_line = 0;
let count_characters = 0;

let array_characters = [];

// loop to break char array into word_array
// also apraises line count and line length
// for dynamic text adjustments
// sorry for dirty code
for(let i = 0; i < char_array.length; i++){

temp_char = '' + char_array[i];

if( temp_char === '\n' ){
  count_line++;
  array_characters.push( count_characters );
  count_characters = -1;
}
 count_characters++;
  if( check_whitespace( temp_char ) ){

    if(temp_word.length > 0){
      word_array.push( temp_word );
      temp_word = '';
      word_array.push( temp_char );
    } else {
      word_array.push( temp_char );
    }
  } else if( language_special_characters.includes( temp_char ) ){
    if(temp_word.length > 0){
      word_array.push( temp_word );
      temp_word = '';
      word_array.push( temp_char );
    } else {
      word_array.push( temp_char );
    }
  } else {
    temp_word = temp_word + temp_char;
  }
}

//bug fix for improperly closed values
if(temp_word.length > 0){
  word_array.push( temp_word );
}
if( count_characters > 0){
array_characters.push(count_characters);
}

//this code displays each word for debugging
// this code is helpful for addition of new languages
for( let i = 0; i < word_array.length; i++ ){
  console.log('word[' + i + ']' + word_array[i] );
}

// <pre> tag ensures blank spaces counted correctly
let screen_print = '<pre>';

// evaluates line length and # of lines
// this is used to dynamically adjust text size to fit
let longest = 0;
for(let i = 0; i < array_characters.length; i++ ){
  if(array_characters[i] > longest ){
    longest = array_characters[i];
  }
}

// debug code & text size fix call
console.log('lines:' + count_line + ':characters:' + longest);
let em_size = get_text_size(longest, count_line );
document.documentElement.style.setProperty('--text-size-current', em_size);

// reused values for loop to inser color classes
let code_start = '<code class=\'';
let code_middle = '\'>';
let code_end = '</code>';

let class_function = 'class_function';
let class_reserved = 'class_reserved';
let class_leading = 'class_leading';
let class_variable = 'class_variable';
let class_comment = 'class_comment';
let class_string = 'class_string';
let count_variable = 0;
let comment_star = false;
let comment_slash = false;
let quote_single = false;
let quote_double = false;

// loop to tag code elements by type
// lots of acceptions for code specific tagging
// sorry for the dirty code
for(let i = 0; i < word_array.length; i++){
  
  // comment or string exceptions check....sigh
  if(comment_star === false &&
     comment_slash === false &&
     quote_single === false && 
     quote_double === false){

      // bug fix \' character not reading correctly use "'"
      if(word_array[i] === "'" ){
        quote_single = true;
        temp_word = code_start + class_string + code_middle + word_array[i];
        word_array[i] = temp_word;
      // bug fix \" character not reading correctly use '"'
      } else if ( word_array[i] === '"'){
          quote_double = true;
          temp_word = code_start + class_string + code_middle + word_array[i];
          word_array[i] = temp_word;
      } else if( word_array[i] === '/' ){
          if( ( i + 1) < word_array.length ){
              if( word_array[i+1] === '/'){
                comment_slash = true;
                temp_word = code_start + class_comment + code_middle + word_array[i];
                word_array[i] = temp_word;
              }else if( word_array[i+1] === '*' ){
                comment_star = true;
                temp_word = code_start + class_comment + code_middle + word_array[i];
                word_array[i] = temp_word;
              }
          }
      } else {
  // leading words such at let change value of following word
  // loop must move up the list until it finds non-whitespace words...sigh
  if( language_leading_words.includes( word_array[i] )  ){
    console.log( 'found:leading:' + word_array[i] );
    temp_word = code_start + class_leading + code_middle + word_array[i] + code_end;
    word_array[i] = temp_word;
    if( ( i + 1 ) < word_array.length  ){
      count_variable = i + 1;
      while( check_whitespace( word_array[count_variable] )  ){
        count_variable++;
      }
      language_variables.push( word_array[count_variable]  );
      count_variable = 0;
    }
  }
  // variables are dynamically added by above leading words code
  // some default values such as console or document are already included
  if( language_variables.includes( word_array[i] )  ){
    console.log( 'found:variable:' + word_array[i] );
    temp_word = code_start + class_variable + code_middle + word_array[i] + code_end;
    word_array[i] = temp_word;
  }
  // for more about reserved javascript words see https://www.w3schools.com/js/js_reserved.asp
  if( language_reserved_words.includes( word_array[i] )  ){
    console.log( 'found:reserved:' + word_array[i] );
    temp_word = code_start + class_reserved + code_middle + word_array[i] + code_end;
    word_array[i] = temp_word;
  }
  // functions are determined by following . or ( it must retroactivly highlight
  // unable to predetermine values as incomplete code base must be assumed
  if( language_functions.includes( word_array[i] )  ){
    console.log( 'found:functions:' + word_array[i] );
    if( (i -1 ) > 0 ){
      temp_word = code_start + class_function + code_middle + word_array[i-1] + code_end;
      word_array[ i-1 ] = temp_word;
    }
  }
}
// code to close comment or code exceptions...double sigh
// there should never be more than one open/true at a time
  } else {
      if(comment_slash){
        if( word_array[i] === '\n' ){
          temp_word = word_array[i] + code_end;
          word_array[i] = temp_word;
          comment_slash = false;
        }
      } else if(comment_star ){
          if( word_array[i] === '*' ){
            if( ( i+1 ) < word_array.length ){
              if( word_array[i+1] === '/'  ){
                temp_word = word_array[i+1] + code_end;
                word_array[i+1] = temp_word;
                comment_star = false;
              }
            }
          }
      } else if( quote_single ){
        if( word_array[i] === "'" ){
          // special condition to check for escape character \
          if( i > 0 ){
            if( word_array[i-1] != '\\' ){
              temp_word = word_array[i] + code_end;
              word_array[i] = temp_word;
              quote_single = false;
            }
          } 
        }
      } else if( quote_double ){
          if( word_array[i] === '"' ){
            // special condition to check for escape character \
            if( i > 0 ){
              if( word_array[i-1] != '\\' ){
          temp_word = word_array[i] + code_end;
          word_array[i] = temp_word;
          quote_double = false;
              }
            }
          }
      }
  }
}

// merge all words into unified string
for(let i = 0; i < word_array.length; i++){
screen_print = screen_print + word_array[i];
}

// add closing pre tag for correct html spacing & insert into page
screen_print = screen_print + '</pre>';
document.getElementById('my-terminal').innerHTML = screen_print;
}

// languange reserved word by language only javascript completed
// words list source https://www.w3schools.com/js/js_reserved.asp
  function get_reserved_words(chosen_language){

    let reserved_words = [];

    switch(chosen_language){
      case 'javascript' : reserved_words =
      [ 'abstract', 'arguments', 'boolean',
        'break', 'byte', 'case',	'catch',
        'char', 'const', 'continue',
        'debugger',	'default', 'delete', 'do',
        'double', 'else',	'eval',	'false', 'final',
        'finally', 'float',	'for', 'function',
        'goto',	'if', 'implements',
        'in', 'instanceof',	'int', 'interface',
        'long', 'native',	'new',
        'null', 'package', 'private', 'protected',
        'public', 'return',	'short', 'static',
        'switch', 'synchronized',	'this',
        'throw', 'throws',	'transient', 'true',
        'try', 'typeof', 'void',
        'volatile',	'while', 'with', 'yield'
      ]; break;
    }
    return reserved_words;
  }
  // leading words add following words to variables color list
  function get_leading_words(chosen_language){
    let reserved_words = [];
    switch(chosen_language){
      case 'javascript' : reserved_words =
      [ 'await', 'class',	'enum','export',
      	'extends','import', 'let', 'super',
        'switch',	'var'
      ]; break;
    }
    return reserved_words;
  }
  // special characters should be made their own words
  function get_special_characters(chosen_language){
    let special_characters = [];
    switch(chosen_language){
      case 'javascript': special_characters = [
      ';', '+', '-', '<', '>', '(', ')', '{', 
      '}', '.', ':', '!',  '=', '[', ']', '*',
      '%', '/', '|', ',', "'", '"' ];
      break;
    }
    return special_characters;
  }
  // these follow function calls and denote color chage of preceeding word
  function get_function_breaks(chosen_language){
    let special_characters = [];
    switch(chosen_language){
      case 'javascript': special_characters = [
        '.', '(' ];
      break;
    }
    return special_characters;
  }
  // variables colors this only includes defaults
  // more values will be added as code is evaluated
  function get_variable_words(chosen_language){
    let my_variables = [];
    switch(chosen_language){
      case 'javascript': my_variable = [
        'console', 'document', 'Math', 'Date', 'Object',
        'Array', 'Number', 'String', 'isNAN',  'parseFloat',
        'parseInt', 'setInterval', 'setTimeout', 'prompt',
        'confirm', 'alert'];
      break;
    }
    return my_variables;
  }
  function check_whitespace(my_word){
    if(my_word === ' ' || my_word === '\t' || my_word === '\n'){
      return true;
    }
    return false;
  }
  function get_detected_language( array_characters ){
    //pending work for more languages defaults to javascript as only valild answer
    // code will otherwise word, but without color corrections
    return 'javascript';
  }
  function get_text_size(characters_long, lines_deep ){

    console.log("get_text_size:characters_long:" + characters_long + ":lines_deep:" + lines_deep );

// reference values for text size based on quick messurements
// measurements are assuming a 4K: 3820x2160 resolution

/* 36em max horizontal characters 10, max vertical lines 2 */
/* 30em max horizontal characters 12, max vertical lines 3 */
/* 28em max horizontal characters 13, max vertical lines 3 */
/* 24em max horizontal characters 15, max vertical lines 4 */
/* 19em max horizontal characters 19, max vertical lines 5 */
/* 18em max horizontal characters 20, max vertical lines 5 */
/* 17em max horizontal characters 21, max vertical lines 5 */
/* 16em max horizontal characters 22, max vertical lines 6 */
/* 15em max horizontal characters 24, max vertical lines 6 */
/* 14em max horizontal characters 25, max vertical lines 6 */
/* 13em max horizontal characters 27, max vertical lines 7 */
/* 12em max horizontal characters 30, max vertical lines 7 */
/* 11em max horizontal characters 32, max vertical lines 8 */
/* 10em max horizontal characters 36, max vertical lines 9 */
/* 9em max horizontal characters 40, max vertical lines 10 */
/* 8em max horizontal characters 45, max vertical lines 11 */
/* 7em max horizontal characters 51, max vertical lines 13 */
/* 6em max horizontal characters 60, max vertical lines 15 */
/* 5em max horizontal characters 72, max vertical lines 19 */
/* 4em max horizontal characters 90, max vertical lines 24 */
/* 3em max horizontal characters 120, max vertical lines 41 */
/* 2em max horizontal characters 120, max vertical lines 58 */

    if( characters_long < 11 && lines_deep < 3 ){
      return '36em';
    } else if( characters_long < 13 && lines_deep < 4 ){
      return '30em';
    } else if( characters_long < 14 && lines_deep < 4 ){
      return '28em';
    } else if( characters_long < 16 && lines_deep < 5 ){
      return '24em';
    } else if( characters_long < 20 && lines_deep < 6 ){
      return '19em';
    } else if( characters_long < 21 && lines_deep < 6 ){
      return '18em';
    } else if( characters_long < 22 && lines_deep < 6 ){
      return '17em';
    } else if( characters_long < 23 && lines_deep < 7 ){
      return '16em';
    } else if( characters_long < 25 && lines_deep < 7 ){
      return '15em';
    } else if( characters_long < 26 && lines_deep < 7 ){
      return '14em';
    } else if( characters_long < 28 && lines_deep < 8 ){
      return '13em';
    } else if( characters_long < 31 && lines_deep < 8 ){
      return '12em';
    } else if( characters_long < 33 && lines_deep < 9 ){
      return '11em';
    } else if( characters_long < 37 && lines_deep < 10 ){
      return '10em';
    } else if( characters_long < 41 && lines_deep < 11 ){
      return '9em';
    } else if( characters_long < 46 && lines_deep < 12 ){
      return '8em';
    } else if( characters_long < 52 && lines_deep < 14 ){
      return '7em';
    } else if( characters_long < 61 && lines_deep < 16 ){
      return '6em';
    } else if( characters_long < 73 && lines_deep < 20 ){
      return '5em';
    } else if( characters_long < 91 && lines_deep < 25 ){
      return '4em';
    } else if( characters_long < 91 && lines_deep < 120 ){
      return '3em';
    } else if( characters_long < 52 && lines_deep < 14 ){
      return '2em';
    } else {
      return '1em';
    }
  }