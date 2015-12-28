var cinema = cinema || {};

cinema.People = function(id, name, photo) {
	this.id = id;
	this.name = name;
	this.photo = photo;
	this.visit = 0;
	this.personal = 0;
	this.date = '00-00-0000';
};

cinema.peopleCollection = [];


cinema.addPeople = function(id, name, photo) {
	var people = new cinema.People(id.length, name, photo);
	this.peopleCollection.push(people);
};

console.log(cinema.peopleCollection);
cinema.addPeople(cinema.peopleCollection, "Vasya", "photo/vasya.png");
console.log(cinema.peopleCollection);
cinema.addPeople(cinema.peopleCollection, "Petya", "photo/petya.png");
console.log(cinema.peopleCollection);

cinema.cameraListener = function(id) {
	var people = this.peopleCollection[id];
	if(people) {
		people.visit++;
		console.log(people);
	} else {
		//this.addPeople(this.peopleCollection.length,'newName','photo/newPhoto.png').call(this);
		console.log(this.addPeople(this.peopleCollection,'newName','photo/newPhoto.png').call(cinema));
	}
};

