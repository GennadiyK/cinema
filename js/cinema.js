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
		this.addPeople(cinema.peopleCollection,'newName','photos/newPhoto.png');
	}
};


cinema.peopleCollectionView = function() {
    var peopleTemplate = document.getElementById('cinemaTemplate').innerHTML;
    var peopleTemplateData = JSON.parse(peoplesData);

    for(var i = 0; i < peopleTemplateData.length; i++ ) {
        var tr = document.createElement('tr');
        var  trContent = peopleTemplate;

        for( var key in peopleTemplateData[i]) {
            trContent = trContent.replace(new RegExp('\{' + key + '\}', 'gi'), peopleTemplateData[i][key]);
            tr.innerHTML = trContent;

        }

        document.getElementById('peoplesTable').tBodies[0].appendChild(tr);
    }
};


cinema.template = function(htmlText){
    var range = document.createRange();
    var container = range.createContextualFragment('<div></div>');

    range.selectNode(document.body); // required in Safari

    var firstNode = container.firstChild;

    firstNode.innerHTML = htmlText;

    return container.firstChild;
}

cinema.render = function() {
	cinema.peopleCollectionView();
};

cinema.render();

