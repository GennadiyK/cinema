var cinema = cinema || {};

cinema.People = function(id, name, photo) {
	this.id = id;
	this.name = name;
	this.photo = photo;
	this.visit = 0;
	this.personal = 0;
	this.date = "00-00-0000";
};

cinema.peopleCollection = JSON.parse(peoplesData);


cinema.addPeople = function(id, name, photo) {
	var people = new cinema.People(id.length, name, photo);
	cinema.peopleCollection.push(people);
	console.log(cinema.peopleCollection);
};

cinema.cameraListener = function(id) {
	var people = cinema.peopleCollection[id];
	if(people) {
		people.visit++;
	} else {
		this.addPeople(cinema.peopleCollection,'newName','photo/newPhoto.png');
	}
};


cinema.peopleCollectionView = function() {
    var peopleTemplate = _.template(document.getElementById('cinemaTemplate').innerHTML);

    var peoplesObjData = JSON.parse(peoplesData);

    var resultingHtml = peopleTemplate({peoples : peoplesObjData});

    document.getElementById('peoplesTable').tBodies[0].innerHTML = resultingHtml;
};

cinema.render = function() {
	cinema.peopleCollectionView();
};

cinema.render();