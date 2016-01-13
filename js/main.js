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



    this.editData = function(field, fieldLabel) {
        var inputContainer = document.createElement('div');
            inputContainer.setAttribute('class','input-group');
        var inputField = document.createElement('input');
            inputField.setAttribute('class','form-control');
        var cancelButton = document.createElement('button');
            cancelButton.setAttribute('class', 'btn btn-danger');
            cancelButton.innerHTML = 'cancel';
        var saveButton = document.createElement('button');
            saveButton.setAttribute('class', 'btn btn-success');
            saveButton.innerHTML = 'save';
        var btnContainer = document.createElement('div');
            btnContainer.setAttribute('class','input-group-btn');
            btnContainer.appendChild(cancelButton);
            btnContainer.appendChild(saveButton);

        var fieldValue;


        //checking label of col
        if(fieldLabel == 'name') {
            fieldValue = model.name;
        }

        //adding text to value
        inputField.value = fieldValue;

        //clearing html of col
        field.innerHTML = '';

        //adding new elements: input and cancel button to the col
        inputContainer.appendChild(inputField);
        inputContainer.appendChild(btnContainer);
        field.appendChild(inputContainer);

        inputField.focus();

        //canceling any changing with input value
        cancelButton.addEventListener('click', function(e){

            e.preventDefault();
            this.cancelEditData(field, fieldValue);

        }.bind(this));

        //saving value at the moment of changing

        saveButton.addEventListener('click', function(e){

            e.preventDefault();
            if(fieldLabel == 'name') {
                this.saveEditData(inputField, 'name', field);
            }

        }.bind(this));
    };

    this.cancelEditData = function(field, val){
        return field.innerHTML = val;
    };

    this.saveEditData = function(input, key, field) {
        model[key] = input.value;
        return field.innerHTML = model[key];
    };


    this.eventListener = function(parent) {
        parent.addEventListener('dblclick', function(e){
            var target = e.target;
            if(target.dataset.field != 'edit') return;

            this.editData(target,'name');
        }.bind(cinema.visitorView));
    };

    this.render = function() {
        var tr = document.createElement('tr');
        var trContent = template.innerHTML;
        var table = document.getElementById('peoplesTable');
        for(var key in model) {
            trContent = trContent.replace(new RegExp('\{\{' + key + '\}\}'), model[key]);
        }

        table.tBodies[0].innerHTML = trContent;
        this.eventListener(table);
    };
};

cinema.visitor = new cinema.Visitor('Vasya',0,'photo');

cinema.visitorView = new cinema.VisitorView(cinema.visitor, 'cinemaTemplate');
cinema.visitorView.render();