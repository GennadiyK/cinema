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

cinema.renderPeople = function() {
	var table = document.createElement('table');
		table.className = 'table table-bordered table-striped';
	var thead = document.createElement('thead');
	var tbody = document.createElement('tbody');
	var tr, th, td;

	//render header ot table
	if(cinema.peopleCollection[0]) {
		for(var i in cinema.peopleCollection[0]) {
			th = document.createElement('th');
			th.innerHTML = '<th>' + i + '</th>';
			thead.appendChild(th);
		}
	}

	//render body
	for(var x = 0; x < cinema.peopleCollection.length ; x++) {
			tr = document.createElement('tr');
			console.log(tr);
			for ( var key in cinema.peopleCollection[x]) {
				td = document.createElement('td');
				td.innerHTML = '<td>' +  cinema.peopleCollection[x][key] + '</td>';
				tr.appendChild(td);	
			}
		tbody.appendChild(tr);
	}
				
				
	//render table
	table.appendChild(thead);
	table.appendChild(tbody);
	document.getElementById('peoples').appendChild(table);

};

cinema.renderPeople();