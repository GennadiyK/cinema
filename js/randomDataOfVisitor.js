function setRandomData() {

    var randomNum = Math.round((Math.random() * 5));
    var newVisitor = true;
    var date = new Date();
    var VisitTime = function(date) {
        this.hours = date.getHours();
        this.minutes = date.getMinutes();
        this.seconds = date.getSeconds();

        this.showVisitTime = function(){
            if(this.seconds < 10) {

                this.seconds = '0' + this.seconds;

            } else if(this.hours < 10 ) {

                this.hours = '0' + this.hours;

            } else if(this.minutes < 10) {

                this.minutes = '0' + this.minutes;

            }
            return this.hours + " : " + this.minutes + " : " + this.seconds;
        }
    };

    var visitTime = new VisitTime(date);

    var VisitDate = function(date) {
        this.d = date.getDate();
        this.m = date.getMonth();
        this.y = date.getFullYear();

        this.showDate = function(){
            if(this.d < 10) {

                this.d = '0' + this.d;

            }
            switch(this.m) {
                case 0:
                    this.m = 'Jan';
                    break;
                case 1:
                    this.m = 'Feb';
                    break;
                case 2:
                    this.m = 'Mar';
                    break;
                case 3:
                    this.m = 'Apr';
                    break;
                case 4:
                    this.m = 'May';
                    break;
                case 5:
                    this.m = 'June';
                    break;
                case 6:
                    this.m = 'July';
                    break;
                case 7:
                    this.m = 'Aug';
                    break;
                case 8:
                    this.m = 'Sept';
                    break;
                case 8:
                    this.m = 'Oct';
                    break;
                case 10:
                    this.m = 'Nov';
                    break;
                case 11:
                    this.m = 'Dec';
                    break;
            }

            return this.d + "-" + this.m + "-" + this.y;
        }
    }
    var visitDate = new VisitDate(date);

    for(var i = 0; i < peoplesData.length; i++) {

        if(peoplesData[i]['id'] === randomNum) {
            newVisitor = false;

            break;
        }

    }

    if(newVisitor) {
        cinema.modelVisitors.addNewVisitor({"id":randomNum,"name":"Name" + randomNum,"photo":"i/photos/photo.png","visit":1,"personal":0,"date": visitDate.showDate() + ' / ' + visitTime.showVisitTime()});

    } else if(peoplesData[randomNum]) {

        peoplesData[randomNum]['visit']++;

        cinema.modelVisitors.setData(randomNum, 'date', visitDate.showDate() + ' / ' + visitTime.showVisitTime());

        cinema.modelVisitors.setData(randomNum, 'visit', peoplesData[randomNum]['visit']);

    }

    cinema.viewChanging.init();

    setTimeout(setRandomData, 2000);
};

setRandomData();
