const size = 12;

var width;
var height;

var state;

var canvas;
var context;

var mouseState = false;

var active = true;
var valid = false;

function init() {
  width = Math.floor(window.innerWidth / size);
  height = Math.floor(window.innerHeight / size);
  
  clear();
  
  canvas = document.getElementById("canvas");
  context = canvas.getContext("2d");
  
  canvas.width = width * size;
  canvas.height = height * size;
  
  setInterval(main, 100);
  
  canvas.addEventListener("mousedown", mousedown, false);
  canvas.addEventListener("mousemove", mousemove, false);
  canvas.addEventListener("mouseup", mouseup, false);
  window.addEventListener("keyup", keyup, false);
  window.onwheel = event => event.preventDefault();
}

function clear() {
  var nextState = new Array(height);
  
  for (var y = 0; y < height; y++) {
    var row = new Array(width);
    
    for (var x = 0; x < width; x++) {
      row[x] = Math.random() < 0.2;
    }
    
    nextState[y] = row;
  }
  
  state = nextState;
  valid = false;
}

function main() {
  if (active) {
    update();
  }
  
  if (!valid) {
    valid = true;
    render();
  }
}

function update() {
  var nextState = new Array(height);
  
  for (var y = 0; y < height; y++) {
    var row = new Array(width);
    
    for (var x = 0; x < width; x++) {
      var n = count(x, y);
      var alive = state[y][x];
      row[x] = n == 3 || n == 2 && alive;
    }
    
    nextState[y] = row;
  }
  
  state = nextState;
  valid = false;
}

function count(x, y) {
  var n = -state[y][x];
  
  for (var dy = -1; dy <= 1; dy++) {
    for (var dx = -1; dx <= 1; dx++) {
      var cx = ( x + dx + width ) % width;
      var cy = ( y + dy + height ) % height;
      
      n += state[cy][cx];
    }
  }
  
  return n;
}

function render() {
  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var alive = state[y][x];
      
      context.fillStyle = alive ? "#0C0" : "#000";
      context.fillRect(x * size, y * size, size, size);
    }
  }
}

function mousedown(event) {
  mouseState = true;
  
  var mx = Math.floor(event.clientX / size);
  var my = Math.floor(event.clientY / size);
  
  state[my][mx] = true;
  valid = false;
}

function mousemove(event) {
  if (mouseState) {
    var mx = Math.floor(event.clientX / size);
    var my = Math.floor(event.clientY / size);
    
    state[my][mx] = true;
    valid = false;
  }
}

function mouseup(event) {
  mouseState = false;
}

function keyup(event) {
  if (event.keyCode == 32) {
    active ^= true;
  } else if (event.keyCode == 46) {
    clear();
  }
}