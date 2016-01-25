var cinema = cinema || {};

cinema.modelVisitors = {
    _data: null,
    _eventsList:{
        'reload': [],
        'change': []
    },
    init: function (data) {
        this.setDataFromJSON(data);

    },
    reload: function (data) {
        this.setDataFromJSON(data);
        for(var i = 0; i < this._eventsList.reload.length; i++ ) {
            this._eventsList.reload[i]();
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

        for(var i = 0; i < this._eventsList.change.length; i++ ) {
            this._eventsList.change[i](id, key, val);
        }

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
    setDataFromJSON: function (data) {//
        this._data = data;
    },
    onChangeModel: function (data) {

    }
};
cinema.modelVisitors.init(peoplesData);


cinema.ViewVisitor = function(visitorId) {
    var that = this;
    this._template = null;
    this._model = cinema.modelVisitors;
    this._visitorId = visitorId;
    this._templateId =  'visitorTemplate';
    this._row = null;

    this.init =  function() {

        this.getTemplate(this._templateId);
        this.getVisitorFromModel(this._visitorId);
        this._model.addEventListener('change', function(id, key, val) {
            if(this._visitorId != id) return;

            this.render();
        }.bind(this));

    };

    this.render = function() {
        this._row = this.fillTemplate(this._visitorId);
        this.eventListener(this._row);

        return this._row;
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
            for (i = 0; 0 < el.childNodes.length;) {
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

        cancelButton.addEventListener('click', function(e){
            e.preventDefault();

            that.cancelEditData(field, visitorName);
        });

        saveButton.addEventListener('click', function(e){
            e.preventDefault();
            newInputValue = inputField.value;

            that.saveEditData(field, 'name', newInputValue);
        });
    };

    this.cancelEditData = function(field, val){
        field.innerHTML = val;
    };

    this.saveEditData = function(field, key, newVal) {
        cinema.modelVisitors.setData(that._visitorId, key, newVal);
        field.innerHTML = newVal;
    };


    this.init(visitorId);
};


cinema.viewVisitorCollection = {
    _template: null,
    _model: cinema.modelVisitors,
    _templateId: 'allVisitorsTemplate',
    _elem:  document.createElement('tbody'),
    _container: document.getElementById('peoples'),
    _visitorData: null,

    init: function () {
        this.render();
        this._model.addEventListener('reload', function(){
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
        this._elem.innerHTML = '';
        for(var i = 0; i < this._visitorData.length; i++) {


            var visitor = new cinema.ViewVisitor(this._visitorData[i].id);

            var templateContent = visitor.render(this._elem);

            this._elem.appendChild(templateContent);
        }


        this._template.children[0].appendChild(this._elem);

        return this._template;

    }

};



cinema.viewVisitorCollection.init();
