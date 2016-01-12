var cinema = cinema || {};

cinema.Visitor = function(name, id, photo) {
    this.id = id;
    this.name = name;
    this.photo = photo;
    this.visit = 0;
    this.personal = 0;
    this.date = "00-00-0000";
};

cinema.VisitorView = function(model, templateId) {
    var model = model;
    var template = document.getElementById(templateId);

    this.render = function() {
        var tr = document.createElement('tr');
        var trContent = template.innerHTML;
        for(var key in model) {
            trContent = trContent.replace(new RegExp('\{' + key + '\}'), model[key]);
        }

        document.getElementById('peoplesTable').tBodies[0].innerHTML = trContent;
    }
};

cinema.visitor = new cinema.Visitor('Vasya',0,'photo');

cinema.visitorView = new cinema.VisitorView(cinema.visitor, 'cinemaTemplate');
cinema.visitorView.render();