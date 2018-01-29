function cell(x, y, isWhite, letter, number, direction, correctLetter) {
  this.direction = direction;
  this.letter = letter;
  this.correctLetter = correctLetter;
  this.number = number;
  this.isWhite = isWhite;
  this.x = x;
  this.y = y;

  this.createHTML = function() {
    var bw = this.isWhite ? "white" : "black";
    var cellData = $('<div class="' + bw + '-box ' + 'p' + x + '-' + y +'"></div>');
    if (this.isWhite) {
      var letterCell = $('<div class="letter"></div>').appendTo(cellData);
      var numberCell = $('<div class="number"></div>').appendTo(cellData);
      if (this.letter !== 'undefined') {
        $('<span>' + letter + '</span>').appendTo(letterCell);
      }
      if (this.number !== 'undefined') {
        $('<span>' + this.number + '</span>').appendTo(numberCell);
      }
    }
    return cellData;
  }

  this.createHTMLForLetter = function() {
    return '<span>' + this.letter + '</span>';
  }
  this.createHTMLForNumber = function() {
    return '<span>' + this.number + '</span>';
  }
}
