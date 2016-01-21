var cinema = cinema || {};

//cinema.Visitor = function(name, id, photo) {
//    this.id = id;
//    this.name = name;
//    this.photo = photo;
//    this.visit = 0;
//    this.personal = 0;
//    this.date = "00-00-0000";
//};


cinema.modelVisitors = {
    _data: null,
    init: function (data) {
        this.setDataFromJSON(data);

        //проверить что data существует(ошибка) или не существует
    },
    getData: function (id, key) {//получаем какое имя пользователя и интересующее свойство
        for (var val in this._data) {
            if (this._data[val]['id'] == id) {
                return this._data[val][key];
            }
        }
    },
    setData: function (id, key, val) {//при сохранении и проверка на валидность
        this.getVisitorById(id)[key] = val;
        this.onChangeModel(id, key);
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
        this._data = JSON.parse(data);
    },
    onChangeModel: function () {

    }
};
cinema.modelVisitors.init(peoplesData);


cinema.ViewVisitor = function(visitorId) {
    var that = this;
    this._template = null;
    this._model = cinema.modelVisitors;
    this._visitorId = visitorId;
    this._templateId =  'visitorTemplate';

    this.init =  function() {

        this.getTemplate(this._templateId);
        this.getVisitorFromModel(this._visitorId);

    };

    this.render = function() {
        var row = this.fillTemplate(this._visitorId);
        this.eventListener(row);

        return row;
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
        var row = document.createElement('tr');


        for(var key in data) {
            template = template.replace(new RegExp('\{\{' + key + '\}\}'), data[key]);
        }

        var templateHTML = this.parseTemplate(template);

        row.appendChild(templateHTML);

        return row;
    };
    this.eventListener = function(row) {
        var editFields = row.querySelectorAll('.edit');


        //block.addEventListener('click', function(){
        //    alert('sdf');
        //});

                //var target = e.target;
                //if(target.dataset.field != 'edit') return;
                //console.log('sdf');
                //that.editFieldValue(target);





    };
    this.editFieldValue = function(field) {

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

        //inputField.value = data['name'];
        field.innerHTML = '';



        field.appendChild(inputContainer);

        inputField.focus();

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
        this.getTemplate(this._templateId);
        this._visitorData = this._model.getDataList(10);
        this.render();
    },
    render: function () {
        this._container.appendChild(this.fillTemplate());


    },
    getTemplate: function (templateId) {
        this._template = document.getElementById(templateId).innerHTML;
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
            for (i = 0; 0 < el.childNodes.length;) {
                docfrag.appendChild(el.childNodes[i]);
            }
            return docfrag;
        }
    },

    fillTemplate: function() {

        var container = document.createElement('div');

        for(var i = 0; i < this._visitorData.length; i++) {


            var visitor = new cinema.ViewVisitor(this._visitorData[i].id);

            var templateContent = visitor.render(this._elem);
            this._elem.appendChild(templateContent);
        }
        container.appendChild(this._elem);
        

        this._template = this._template.replace(new RegExp('\{\{'+'visitorsList'+'\}\}'), container.innerHTML);

        var templateHTML =this.parseTemplate(this._template);



        return templateHTML;
    }

};



cinema.viewVisitorCollection.init();
