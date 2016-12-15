
var delta = 1000;

function log(e) {
  console.log(e);
}

function debounce(fn, delta) {
  var timeoutID = null;
 
  return function() {
    clearTimeout(timeoutID);

    var args = arguments;
    timeoutID = setTimeout(function() {
      fn.apply(null, args);
    }, delta);
  };
}

var debouncedLog = debounce(log, delta);
window.onkeydown = debouncedLog;
window.onkeydown = debouncedLog;
