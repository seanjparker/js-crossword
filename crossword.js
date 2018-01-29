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

    var c = $("#crosswordStart");
    this.container = $('<div class="grid"></div>').appendTo(c);

    this.loadCrossword(function() {
      _this.parseCrosswordData();
      _this.draw();
      _this.setKeyHandlers();
    });
  }

  this.loadCrossword = function(loadSuccessful) {
    $.getJSON(this.crosswordID + '.json', {
    })
    .done(function(jsondata) {
      _this.crosswordData = jsondata;
      loadSuccessful();
    });
  }

  this.parseCrosswordData = function() {
    this.width = this.crosswordData.width;
    this.height = this.crosswordData.height;
    this.clues = [];
    this.words = [];

    var data = this.crosswordData.data;

    for (var i = 0; i < data.length; i++) {
      this.clues.push(data[i]["c"]);
      this.words.push(data[i]["w"]);
    }

    console.log(this.clues, this.words);
    //for (var i = 0; i < this.crosswordData.data.length; i++) {
    //  this.crosswordData.data[i].
    //}


    console.log(this.crosswordData);
  }

  this.draw = function() {
    this.drawGrid();
    this.drawSuperScriptNumbers();
  }

  this.drawGrid = function() {
    //draw the initial grid
    this.grid = [];
    for (var y = 0; y < this.height; y++) {
      var row = $('<div class="row"></div>').appendTo(this.container);
      this.grid[y] = [];
      for (var x = 0; x < this.width; x++) {
        var bw = Math.random() > 0.8 ? "black" : "white";
        var cell = $('<div class="' + bw + '-box"></div>').appendTo(row);
        this.grid[y][x] = cell;
        console.log("x: " + x + ", y: " + y + "  ::  " + JSON.stringify(this.grid[y][x]));
      }
    }

    //create the letter space
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var cell = this.grid[y][x];
        if (cell.hasClass("white-box")) {
          $('<div class="letter"></div>').appendTo(cell);
        }
      }
    }
  }

  this.drawSuperScriptNumbers = function() {
    //create the super script numbers in cell
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var cell = this.grid[y][x];
        if (cell.hasClass("white-box")) {
          $('<div class="number">1</div>').appendTo(cell);
        }
      }
    }
  }

  this.setKeyHandlers = function() {
    this.container.find(".row > div").click(function(e) {
      if($(this).hasClass("white-box")) {
        var cell = $(this);
        _this.container.find(".row > div").removeAttr('id', 'cell-active');
        cell.attr('id', 'cell-active');
      }
    });
    $(document).keypress(function(e) {
      var character = String.fromCharCode(e.which).toUpperCase();
      var cell = _this.container.find('#cell-active').children(".letter").empty();
      $('<span>' + character + '</span>').appendTo(cell);
    });
  }
}
