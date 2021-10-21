// TODO: set the number of rows and cols in the toggle pane
const TOGGLE_ROWS = 2;
const TOGGLE_COLS = 3;

// set the pixel size of each tile
const TILE_HEIGHT = 50;
const TILE_WIDTH = 200;

// global reference to the canvas element
let canvas;

// global reference to the canvas' context
let ctx;

// TODO: create an array of strings with the 2 different
// toggle settings (prefix and whitespace)
let flags = ['prefix', 'whitespace'];

// array used to store currently selected toggle settings
let selection = [];

/*
  When the document is ready, this runs.
*/
$(document).ready(() => {

  // set up the canvas .
  canvas = $("#toggle")[0]

  // TODO: set the width and height of canvas
  // hint -- use the globally defined TOGGLE_ROWS, TOGGLE_COLS,
  //         TILE_HEIGHT, TILE_WIDTH
  canvas.width = TOGGLE_COLS * TILE_WIDTH;
  canvas.height = TOGGLE_ROWS * TILE_HEIGHT;

  // TODO: set up the canvas context
  ctx = canvas.getContext("2d");

  // paints the toggle pane
  paintToggle();

  // TODO: add a click handler for when the user clicks the canvas element
  // with id 'toggle'. Have it call the function 'paintOnClick'.
  $('#toggle').click(paintOnClick);


  // click handler for the submit button
  $('#submit').click(submitSelection);

  // listens for user to change text in the textarea field for autocorrect
  $('#autocorrect').on('input', function () {
    // clear the screen
    $('#suggestions').html("");

    // gets what the user typed
    const input = $('#autocorrect').val();
    console.log(input)

    // check if user didn't type anything or has trailing whitespace
    if ($.trim(input) === '' || $.trim(input) != input) {
      // clear the screen
      $('#suggestions').html("");
    } else {
      // build the javascript object that contains data for POST request
      const postParams = { word: input };

      // POST request to "/generate" endpoing with word information
      $.post("/generate", postParams, responseJSON => {

        // parse the JSON response into a Javscript object
        const responseObject = JSON.parse(responseJSON);

        // display the suggestions
        const suggestionsList = $('<ul>').appendTo('#suggestions');
        const suggestionsJSON = responseObject.suggestions
        console.log(suggestionsJSON)
        $(suggestionsJSON).each(function (index, item) {
          suggestionsList.append(
              $(document.createElement('li')).text(item)
          );
        });
      });
    }
  });

});

/*
  Function that paints the toggle pane
*/
const paintToggle = () => {
  // setting the context's font and line width
  ctx.font = '16px Andale Mono';
  ctx.lineWidth = 1;

  // TODO: fill the background color of the canvas element to
  // something other than white using ctx.fillStyle() and ctx.fillRect()
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, canvas.width, canvas.height);


  // TODO: draw the grid lines for the toggle pane using ctx.beginPath()
  // and ctx.moveTo()
  // hint -- remember you have the fields TOGGLE_ROWS & TOGGLE_COLS, and
  //         TILE_HEIGHT & TILE_WIDTH, which will help you draw the lines
  //Horozontal Lines
  for (let row = 0; row < TOGGLE_ROWS + 1; row++){
    ctx.moveTo(0, row * TILE_HEIGHT)
    ctx.lineTo(TILE_WIDTH * TOGGLE_COLS, row * TILE_HEIGHT)
  }

  for (let col = 0; col < TOGGLE_COLS + 1; col++){
    ctx.moveTo(col * TILE_WIDTH, 0)
    ctx.lineTo(col * TILE_WIDTH, TILE_HEIGHT * TOGGLE_ROWS)
  }

  ctx.stroke();



  // populate the toggle pane's text using ctx.fillText(). Reference
  // the lab handout to see what text is necessary.
  for (let row = 0; row < TOGGLE_ROWS; row++) {
    for (let col = 0; col < TOGGLE_COLS; col++) {
      let text;
      if (col == 0) {
        // set the variable 'text' to be the toggle settings that
        // belongs in the current row, using the array 'flags'
        text = flags[row]
      } else if (col == 1) {
        // set the variable 'text' to be "on"
        text = "on"
      } else {
        // set the variable 'text' to be "off"
        text = "off"

        // we want the toggle pane to default display "off" for each
        // toggle setting, so fill the rectangle with a color of your choice!
        // use ctx.fillRect()
        ctx.fillStyle = 'black'
        ctx.fillRect(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
      }

      // TODO: using the variable 'text', set the text of each rectangle
      // with ctx.fillText()
      ctx.fillStyle = 'green';
      ctx.fillText(text, 0, 0)
    }
  }
};

/*
  Function that gets called when something is clicked in the toggle pane.
  This handles the toggling on/off animation and coloring.
*/
const paintOnClick = event => {

  // get the x and y coordinates of the click event
  // with (0, 0) being the top left corner of canvas
  // hint -- you can get the x y coordinates using event.pageX and event.pageY!
  //         You'll want to convert this into coordinates relative to the canvas,
  //         so that (0, 0) is the top left corner. Remember we have
  //         canvas.offsetLeft and canvas.offsetTop!
  const x = event.pageX - canvas.offsetLeft
  const y = event.pageY - canvas.offsetTop

  // TODO: use these x y coordinates to determine the row and col of
  const row = Math.trunc(y / TILE_HEIGHT)
  const col = Math.trunc(x / TILE_WIDTH)

  // get the selected toggle setting by indexing into the array 'flags'
  // using the row of the clicked tile.
  const toggleSetting = flags[row]

  if (col == 1) {
    // case - the user selected 'on'

    // TODO: color the current tile using ctx.fillRect() with whichever select
    // you chose in paintToggle(). Remember that after coloring,
    // you're going to want to draw the text again using ctx.fillText()
    ctx.fillStyle = 'blue'
    ctx.fillRect(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
    ctx.fillStyle = 'black';
    ctx.fillText('on', col * TILE_WIDTH + 10, row * TILE_HEIGHT + 10)

    // TODO: color the adjacent tile (ie. the 'off' tile) with whichever color
    // you chose as the base toggle pane color. This will mimic the effect of
    // deselecting the 'off' tile when 'on' is selected. Remember again that
    // after coloring, you're going to want to redraw the text.
    ctx.fillStyle = 'red'
    ctx.fillRect((col+1) * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
    ctx.fillStyle = 'black';
    ctx.fillText('off', (col+1) * TILE_WIDTH + 10, row * TILE_HEIGHT + 10)

    // TODO: using the selected toggle setting that you defined in a previous
    // todo, add this into the 'selection' array we defined globally. Remember
    // that you only want to add this setting if it isn't already in the
    // 'selection' array, so be sure to check for that first!
    if (!selection.includes(toggleSetting)){
      selection.push(toggleSetting)
    }

  } else if (col == 2) {
    // case - the user selected 'off'

    // TODO: color the current tile using ctx.fillRect() with whichever select
    ctx.fillStyle = 'blue'
    ctx.fillRect(col * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
    ctx.fillStyle = 'black';
    ctx.fillText('on', col * TILE_WIDTH + 10, row * TILE_HEIGHT + 10)

    // TODO: color the adjacent tile (ie. the 'on' tile) with whichever color
    // you chose as the base toggle pane color. This will mimic the effect of
    // deselecting the 'on' tile when 'off' is selected. Remember again that
    // after coloring, you're going to want to redraw the text.
    ctx.fillStyle = 'red'
    ctx.fillRect((col-1) * TILE_WIDTH, row * TILE_HEIGHT, TILE_WIDTH, TILE_HEIGHT)
    ctx.fillStyle = 'black';
    ctx.fillText('off', (col-1) * TILE_WIDTH + 10, row * TILE_HEIGHT + 10)

    // TODO: using the selected toggle setting that you defined in a previous
    // todo, remove this from the 'selection' array we defined globally. Remember
    // that you only want to remove this setting if it is in the
    // 'selection' array, so be sure to check for that first!
    if (!selection.includes(toggleSetting)){
      selection.push(toggleSetting)
    }
  }

}

/*
  Sends the selected toggle settings to backend to create an Autocorrector
*/
const submitSelection = () => {
  // build javascript object that contains the data for the POST request.
  const postParameters = { flags: selection.join(" ") };

  const $message = $("#message");

  // post request to "/setflags" endpoint with toggle settings selected
  $.post("/setflags", postParameters, responseJSON => {
    // Parse the JSON response into a JavaScript object.
    const responseObject = JSON.parse(responseJSON);
    $message.html(responseObject.props);
  });
}
