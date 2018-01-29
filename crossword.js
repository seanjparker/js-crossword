function crossword() {
  this.crosswordID;
  this.width;
  this.height;
  this.clues;
  this.words;
  this.grid;
  this.container;
  this.crosswordData;
  var _this = this;

  this.init = function(crosswordID) {
    this.crosswordID = crosswordID;

    //The starting place to where we draw the crossword grid
    var c = $("#crosswordStart");
    this.container = $('<div class="grid"></div>').appendTo(c);

    //Load the crossword by creating the grid and parsing the json
    this.loadCrossword(function() {
      _this.initGrid()
      _this.parseCrosswordData();
      _this.drawGrid();
      _this.drawClues();
      _this.setKeyHandlers();
    });
  }

  this.loadCrossword = function(loadSuccessful) {
    $.getJSON('crosswords/' + this.crosswordID + '.json', {
    })
    .done(function(jsondata) {
      _this.crosswordData = jsondata;
      loadSuccessful();
    });
  }

  this.initGrid = function() {
    this.width = this.crosswordData.width;
    this.height = this.crosswordData.height;
    this.grid = [];
    for (var y = 0; y < this.height; y++) {
      this.grid[y] = [];
      for (var x = 0; x < this.width; x++) {
        //Create the grid of cells by setting then to all black and empty
        this.grid[y][x] = new cell(x, y, false, 'undefined', 'undefined');
      }
    }
  }

  //Parsing the crossword data:
  //We find the clues and words and store the data
  //Then we set each cell with the correct letter and the x and y co-ords
  this.parseCrosswordData = function() {
    this.clues = {
      'A':[],
      'D':[]
    };
    this.words = [];

    var data = this.crosswordData.data;

    for (var i = 0; i < data.length; i++) {
      this.words.push(data[i].w);
      var x = data[i].x;
      var y = data[i].y;
      var d = data[i].d;

      //At the start of the word, set the super-script number
      this.grid[y][x].number = data[i].n;
      this.grid[y][x].direction = d;

      //Add the clues with the direction and number
      this.clues[d].push({
        'n':data[i].n,
        'c':data[i].c
      });

      for (var c = 0; c < this.words[i].length; c++) {
        var yOff = y + (d == 'D' ? c : 0);
        var xOff = x + (d == 'A' ? c : 0);
        this.grid[yOff][xOff].correctLetter = this.words[i][c].toUpperCase();
        this.grid[yOff][xOff].isWhite = true;
        this.grid[yOff][xOff].direction = d;
      }
    }
  }
  this.createJSON = function() {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {

      }
    }
  }

  this.drawGrid = function() {
    //draw the initial grid
    for (var y = 0; y < this.height; y++) {
      var row = $('<div class="row"></div>').appendTo(this.container);
      for (var x = 0; x < this.width; x++) {
        //Makes a call to each cell and it returns the html for that cell
        $(this.grid[y][x].createHTML()).appendTo(row);
      }
    }
  }

  this.drawClues = function() {
    var clueDiv = $('<div class="clues"></div>').appendTo('#crosswordStart');
    clueDiv.append('<h4 class="cluelabel">Across</h4>');
    var acrossList = $('<div class="across scroll-pane"></div>').appendTo(clueDiv);
    clueDiv.append('<h4 class="cluelabel">Down</h4>');
    var downList = $('<div class="down scroll-pane"></div>').appendTo(clueDiv);
    for (var key in this.clues) {
      for (var i = 0; i < this.clues[key].length; i++) {
        var clue = this.clues[key][i];
        var li = $('<p></p>').appendTo(key == 'A' ? acrossList : downList);
        li.addClass('c' + key + clue.n);
        li.text(clue.n + '. ' + clue.c);
      }
    }
    $(function() {
      $('.scroll-pane').jScrollPane();
    });
  }

  this.checkCrossword = function() {
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        //Check each cell, if one letter doesn't match the correct letter
        //the crossword solution is incorrect
        if (this.grid[y][x].isWhite && this.grid[y][x].letter !== this.grid[y][x].correctLetter)
          return false;
      }
    }
    return true;
  }

  this.getXAndY = function(cellToParse) {
    //Parse the class name to find the x and y of the cell
    return cellToParse.attr('class').split(" ")[1].split("p")[1].split("-");
  }

  this.updateLetter = function(newLetter) {
    //When a letter is pressed find the active cell
    var active = $('#cell-active');
    var pos = this.getXAndY(active);
    //Remove the current letter from the HTML for the cell
    var cell = active.children(".letter").empty();
    //Update the cell with the new letter and create the html
    if (newLetter !== '' || typeof newLetter == 'undefined') {
      this.grid[pos[1]][pos[0]].letter = newLetter;
      $(this.grid[pos[1]][pos[0]].createHTMLForLetter()).appendTo(cell);
    }
    this.updateActive();
  }

  this.updateActive = function(pressX, pressY) {
    //Find the active cell
    var cell = $('#cell-active');
    var pos = this.getXAndY(cell);
    var x = parseInt(pos[0]);
    var y = parseInt(pos[1]);
    if ((typeof pressX == 'undefined' && typeof pressY == 'undefined') && this.grid[y][x].direction !== 'undefined') {
      //Depending on the direction for the cell, move the active cell if we can
      if (this.grid[y][x].direction === 'A') {
        //Ensure the new x is within the grid bounds
        var xDelta = x += (x + 1 < this.width ? 1 : 0);
        if (this.grid[y][xDelta].isWhite) {
          //Set the cell @ [y][xDelta] to active
          //Remove the active cell id and move it to the new cell
          $(".row > div").removeAttr('id', 'cell-active');
          $(".p" + xDelta + "-" + y).attr('id', 'cell-active');
        }
      } else if (this.grid[y][x].direction === 'D') {
        //Ensure the new x is within the grid bounds
        var yDelta = y += (y + 1 < this.height ? 1 : 0);
        if (this.grid[yDelta][x].isWhite) {
          //Set the cell @ [y][xDelta] to active
          //Remove the active cell id and move it to the new cell
          $(".row > div").removeAttr('id', 'cell-active');
          $(".p" + x + "-" + yDelta).attr('id', 'cell-active');
        }
      }
    } else {
      var deltaX = x + pressX;
      var deltaY = y + pressY;
      if ((deltaX < this.width && deltaY < this.height && deltaX >= 0 && deltaY >= 0) && this.grid[deltaY][deltaX].isWhite) {
        //Set the cell @ [y][xDelta] to active
        //Remove the active cell id and move it to the new cell
        $(".row > div").removeAttr('id', 'cell-active');
        $(".p" + deltaX + "-" + deltaY).attr('id', 'cell-active');
      }
    }
  }

  this.setKeyHandlers = function() {
    //Capture the key press event
    $(".row > div").click(function(e) {
      if($(this).hasClass("white-box")) {
        //When the user clicks on the white cell, set it to active
        $(".row > div").removeAttr('id', 'cell-active');
        $(this).attr('id', 'cell-active');
      }
    });
    $(document).keypress(function(e) {
      //When a letter is pressed, update the active cell with that letter
      var character = String.fromCharCode(e.which).toUpperCase();
      _this.updateLetter(character);
    });
    $(document).on('keydown', function(e) {
      //When the user presses delete, remove the letter from the cell
      var key = e.key;
      if (key === 'Backspace' || key === 'Delete') {
        _this.updateLetter('')
      } else if (key === 'ArrowUp') {
        _this.updateActive(0, -1);
      } else if (key === 'ArrowDown') {
        _this.updateActive(0, 1);
      } else if (key === 'ArrowLeft') {
        _this.updateActive(-1, 0);
      } else if (key === 'ArrowRight') {
        _this.updateActive(1, 0);
      }
    });
  }
}
