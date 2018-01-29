function crossword() {
  this.crosswordID;
  this.width = 10;
  this.height = 10;
  this.clues;
  this.words;
  this.grid;
  this.container;
  this.crosswordData;
  this.crossword;
  var self = this;

  this.init = function(crosswordID) {
    this.crosswordID = crosswordID;

    var c = $("#crosswordStart");
    this.container = $('<div class="grid"></div>').appendTo(c);

    //self.loadCrossword();
    self.draw();
    self.setKeyHandlers();
    //var test = '<h1> Hello World! </h1>';
    //test.appendTo(c);
    //this.createGrid = function() {
    //}
  }

  this.loadCrossword = function() {
    this.crossword = $.ajax({
      type: 'get',
      dataType: 'json',
      url: 'c' + this.id + '.json',
      success: function(data) {
        self.crosswordData = data;
        self.clues = self.crosswordData.data;
        //self.parseCrosswordData();
      },
      error: function(e, ts, err){
        console.log(e, ts, err);
      }
    });
  }

  this.parseCrosswordData = function() {

  }

  this.draw = function() {
    self.drawGrid();
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
      }
    }

    //create the letter space
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var cell = this.grid[y][x];
        if (cell.hasClass("white-box")) {
          $('<span class="letter"></span>').appendTo(this.grid[y][x]);
        }
      }
    }
  }

  this.setKeyHandlers = function() {
    this.container.find(".row > div").click(function(e) {
      if($(this).hasClass("white-box")) {
        var cell = $(this);
        self.container.find(".row > div").removeAttr('id', 'cell-active');
        cell.attr('id', 'cell-active');
      }
    });
    $(document).keypress(function(e) {
      var character = String.fromCharCode(e.which).toUpperCase();
      var cell = self.container.find('#cell-active');
      cell.children('.letter').text(character);
    });
  }
}
