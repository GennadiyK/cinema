var cinema = cinema || {};

cinema.modelVisitors = {
    _data: null,
    _eventsList:{
        'reload': [],
        'change': [],
        'addNewVisitor': []
    },
    init: function (data) {
        this.setDataFromJSON(data);

    },
    reload: function (data) { // получение заново данных, и запуск функций из массива свойства объекта reload
        this.setDataFromJSON(data);
        for(var i = 0; i < this._eventsList.reload.length; i++ ) {
            this._eventsList.reload[i]();
        }
    },
    change: function(id, key, val) { // запускает функции из массива свойства объекта change и передает в функции id key val визитора
        for(var i = 0; i < this._eventsList.change.length; i++ ) {
            this._eventsList.change[i](id, key, val);
        }
    },
    addNewVisitor: function(visitor) {
        this._data.push(visitor);
        for(var i = 0; i < this._eventsList.addNewVisitor.length; i++ ) {
            this._eventsList.addNewVisitor[i](visitor['id']);
        }
    },
    addEventListener: function(event, func){
        this._eventsList[event].push(func);
    },
    getData: function (id, key) {//получаем какое имя пользователя и интересующее свойство
        for (var val in this._data) {
            if (this._data[val]['id'] == id) {
                return this._data[val][key];
            }
        }
    },
    setData: function (id, key, val) {
        this.getVisitorById(id)[key] = val;
        this.change(id, key, val);
    },
    getDataList: function(len, page) {
        var arr = [];
        for(var i = 0; i < this._data.length && len > 0; i++) {

            arr.push(this._data[i]);
            len--;
        }

        return arr;
    },
    getVisitorById: function (id) {
        for (var key in this._data) {
            if (this._data[key]['id'] == id) {
                return this._data[key];
            }
        }
    },
    setDataFromJSON: function (data) {
        this._data = data;
    },
    validateName: function(value) {
        var reg = /^[a-zA-Z''-'\s]{1,40}$/;

        if(!value.match(reg)) {
            return false;
        }
    }
};
cinema.modelVisitors.init(visitorsData);


cinema.ViewVisitor = function(visitorId) {
    var that = this;
    this._template = null;
    this._model = cinema.modelVisitors;
    this._visitorId = visitorId;
    this._templateId =  'visitorTemplate';
    this._row = null;
    this._allowRender = true;
    this._isDisable = false;

    this.init =  function() {

        this.getTemplate(this._templateId);
        this.getVisitorFromModel(this._visitorId);
        this._model.addEventListener('change', function(id, key, val) {
            if(this._visitorId != id) return;
            if(this._allowRender) {
                this.render();
            }
        }.bind(this));

    };

    this.render = function() {
        this._row = this.fillTemplate(this._visitorId);
        this.eventListener(this._row);

        return this._row;
    };

    this.reRender = function() {//if dada reload
        if(!this._allowRender) {
           return;
        }
        this._row.querySelectorAll('[data-visitor="name"]')[0].innerHTML = this._model.getData(this._visitorId, 'name');
        this._row.querySelectorAll('[data-visitor="visit"]')[0].innerHTML = this._model.getData(this._visitorId, 'visit');
    };

    this.getTemplate = function (templateId) {
        this._template = document.getElementById(templateId).innerHTML;
        return this._template;
    };
    this.parseTemplate = function(markup){
        if (markup.toLowerCase().trim().indexOf('<!doctype') === 0) {
            var doc = document.implementation.createHTMLDocument("");
            doc.documentElement.innerHTML = markup;
            return doc;
        } else if ('content' in document.createElement('template')) {
            // Template tag exists!
            var el = document.createElement('template');
            el.innerHTML = markup;
            return el.content;
        } else {
            // Template tag doesn't exist!
            var docfrag = document.createDocumentFragment();
            var el = document.createElement('body');
            el.innerHTML = markup;
            for (var i = 0; 0 < el.childNodes.length;) {
                docfrag.appendChild(el.childNodes[i]);
            }
            return docfrag;
        }
    };

    this.getVisitorFromModel = function(id) {
        return this._model.getVisitorById(id);
    };

    this.fillTemplate = function (visitorId) {
        var template = this._template;

        var data = this.getVisitorFromModel(visitorId);

        if(this._row == null) {
            this._row = document.createElement('tr');
        } else {
            this._row.innerHTML = '';
        }


        for(var key in data) {
            template = template.replace(new RegExp('\{\{' + key + '\}\}'), data[key]);
        }

        var templateHTML = this.parseTemplate(template);

        this._row.appendChild(templateHTML);

        return this._row;
    };
    this.eventListener = function(row) {
       var editNode = row.querySelectorAll('.edit');
        var td = [].slice.call(editNode);


        for(var i =0; i < td.length; i++) {
            td[i].addEventListener('dblclick', function(){
                that.editFieldValue(this);
            });
        }
    };
    this.editFieldValue = function(field) {
        that._allowRender = false;
        that._isDisable = true;
        var visitorName = cinema.modelVisitors.getData(that._visitorId, 'name');
        var newInputValue;
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

        inputContainer.appendChild(inputField);

        inputContainer.appendChild(btnContainer);

        inputField.value = visitorName;
        field.innerHTML = '';

        field.appendChild(inputContainer);

        inputField.focus();

        inputField.addEventListener('keyup', function(){

            if(that._model.validateName(this.value) === false) {
                that.disabledFieldWithError(this);
            } else {
                that.enabledFieldWithSucsess(this);
            }
        });

        cancelButton.addEventListener('click', function(e){
            e.preventDefault();

            that.cancelEditData(field, visitorName);
        });

        saveButton.addEventListener('click', function(e){
            e.preventDefault();
            if(that._isDisable === false) {
                newInputValue = inputField.value;

                that.saveEditData(field, 'name', newInputValue);
            }
        });
    };

    this.disabledFieldWithError = function(field) {
        that._isDisable = true;
        field.classList.add('error');
        if(field.classList.contains('success')) {
            field.classList.remove('success');
            field.classList.add('error');
        }

    };

    this.enabledFieldWithSucsess = function(field) {
        that._isDisable = false;
        field.classList.add('success');
        if(field.classList.contains('error')) {
            field.classList.remove('error');
            field.classList.add('success');
        }
    };

    this.cancelEditData = function(field, val){
        field.innerHTML = val;
        this._allowRender = true;
    };

    this.saveEditData = function(field, key, newVal) {
        cinema.modelVisitors.setData(that._visitorId, key, newVal);
        console.log(cinema.modelVisitors.getData(that._visitorId,'name'));
        field.innerHTML = newVal;
        this._allowRender = true;
    };


    this.init(visitorId);
};

cinema.viewChanging = {
    _elem: document.getElementById('alert'),

    init: function() {
        this.change(cinema.modelVisitors);
        this.newVisitor(cinema.modelVisitors);
    },
    render: function(data) {
        this._elem.innerHTML = data;
    },
    change: function(model) {
        model.addEventListener('change', function(id, key, val){
            if(key === 'visit') {
                this.render('We have visitor: ' + model.getData(id,'name')  + '<br>' + ' Visits: ' + model.getData(id,'visit') + '<br>' + 'Date of visit: ' + model.getData(id,'date'));
            }
        }.bind(this));

    },
    newVisitor: function(model) {
        model.addEventListener('addNewVisitor', function(id){
            this.render('We have new visitor: ' + model.getData(id,'name') + '<br>'  + ' Visits: ' + model.getData(id,'visit') + '<br>' +'Date of visit: ' + model.getData(id,'date'));
        }.bind(this));
    }

};

cinema.viewVisitorCollection = {
    _template: null,
    _model: cinema.modelVisitors,
    _templateId: 'allVisitorsTemplate',
    _elem:  document.createElement('tbody'),
    _container: document.getElementById('peoples'),
    _visitorData: null,
    _visitorsView:{},

    init: function () {
        this.render();
        this._model.addEventListener('addNewVisitor', function(){
           this.render();
        }.bind(this));
    },
    render: function () {
        this.getTemplate(this._templateId);
        this._visitorData = this._model.getDataList(10);
        this._container.innerHTML = '';
        this._container.appendChild(this.fillTemplate());
    },
    getTemplate: function (templateId) {
        var templateHtml;
        var template = document.getElementById(templateId).innerHTML;
        templateHtml = this.parseTemplate(template);
        this._template = templateHtml;

        return this._template;
    },

    parseTemplate:  function(markup){

        if (markup.toLowerCase().trim().indexOf('<!doctype') === 0) {
            var doc = document.implementation.createHTMLDocument("");
            doc.documentElement.innerHTML = markup;
            return doc;
        } else if ('content' in document.createElement('template')) {
            // Template tag exists!
            var el = document.createElement('template');
            el.innerHTML = markup;
            return el.content;
        } else {
            // Template tag doesn't exist!
            var docfrag = document.createDocumentFragment();
            var el = document.createElement('body');
            el.innerHTML = markup;
            for (var i = 0; 0 < el.childNodes.length;) {
                docfrag.appendChild(el.childNodes[i]);
            }
            return docfrag;
        }
    },

    fillTemplate: function() {

        for(var i = 0; i < this._visitorData.length; i++) {
            if(this._visitorsView[this._visitorData[i].id]) {
                this._visitorsView[this._visitorData[i].id].reRender();
                continue;
            }

            var visitor = new cinema.ViewVisitor(this._visitorData[i].id);

            this._visitorsView[this._visitorData[i].id] = visitor;

            var templateContent = visitor.render();

            this._elem.appendChild(templateContent);

        }

        this._template.children[0].appendChild(this._elem);

        return this._template;

    }

};

cinema.viewVisitorCollection.init();

