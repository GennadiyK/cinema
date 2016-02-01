var Session = function(id, time, idFilm, place) {
    var placeArr = [];

    this.id = id;
    this.time = time;
    this.idFilm = idFilm;
    this.place = place;

    this.setPlaceArr = function(x, y) {
      for(var i = 0; i < x; i++) {

          placeArr[i] = [];

          for(var n = 0; n < y; n++) {
              placeArr[i][n] = 0;

          }
      }
        return placeArr;
    };

    this.getSessionPlace = function(numRow, numPlace){
        return placeArr[numRow][numPlace];
    };
};

var session = new Session(1, '13:00', 10, 2);

session.setPlaceArr(4, 4);


