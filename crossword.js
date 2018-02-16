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
      _this.initGrid()
      _this.parseCrosswordData();
      _this.drawGrid();
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
        this.grid[y][x] = new cell(x, y, false, 'undefined', 'undefined');
      }
    }
  }

  this.parseCrosswordData = function() {
    this.clues = [];
    this.words = [];

    var data = this.crosswordData.data;

    for (var i = 0; i < data.length; i++) {
      this.clues.push(data[i].c);
      this.words.push(data[i].w);
      var x = data[i].x;
      var y = data[i].y;
      var d = data[i].d;
      this.grid[y][x].number = data[i].n;
      this.grid[y][x].direction = d;

      for (var c = 0; c < this.words[i].length; c++) {
        var yOff = y + (d == 'D' ? c : 0);
        var xOff = x + (d == 'A' ? c : 0);
        this.grid[yOff][xOff].correctLetter = this.words[i][c].toUpperCase();
        this.grid[yOff][xOff].isWhite = true;
      }
    }
  }

  this.drawGrid = function() {
    //draw the initial grid
    for (var y = 0; y < this.height; y++) {
      var row = $('<div class="row"></div>').appendTo(this.container);
      for (var x = 0; x < this.width; x++) {
        $(this.grid[y][x].createHTML()).appendTo(row);
      }
    }
  }

  this.getXAndY = function(cellToParse) {
    return cellToParse.attr('class').split(" ")[1].split("?");
  }

  this.updateLetter = function(newLetter) {
    var active = $('#cell-active');
    var pos = _this.getXAndY(active);
    var cell = active.children(".letter").empty();

    if (newLetter !== '' || typeof newLetter == 'undefined') {
      _this.grid[pos[1]][pos[0]].letter = newLetter;
      $(_this.grid[pos[1]][pos[0]].createHTMLForLetter()).appendTo(cell);
    }
  }

  this.setKeyHandlers = function() {
    this.container.find(".row > div").click(function(e) {
      if($(this).hasClass("white-box")) {
        var cell = $(this);
        $(".row > div").removeAttr('id', 'cell-active');
        cell.attr('id', 'cell-active');
      }
    });
    $(document).keypress(function(e) {
      var character = String.fromCharCode(e.which).toUpperCase();
      _this.updateLetter(character);
    });
    $(document).on('keydown', function(e) {
      var key = e.key;
      if (key === 'Backspace' || key === 'Delete') {
        _this.updateLetter('');
      }
    });
  }
}
