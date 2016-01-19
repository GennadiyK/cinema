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


cinema.viewVisitor = {
    _template: null,
    _model: cinema.modelVisitors,
    _visitorId: null,
    _templateId:  'visitorTemplate',

    init: function(visitorId) {
        this._visitorId = visitorId;
        this.getTemplate(this._templateId);
        this.getVisitorFromModel(this._visitorId);
    },

    render: function(elem) {
        return elem.appendChild(this.fillTemplate(this._visitorId));
    },

    getTemplate: function (templateId) {
        this._template = document.getElementById(templateId).innerHTML;
        return this._template;
    },

    getVisitorFromModel: function(id) {
        return this._model.getVisitorById(id);
    },

    fillTemplate: function (visitorId) {
        var template = this._template;
        var data = this.getVisitorFromModel(visitorId);
        var row = document.createElement('tr');


        for(var key in data) {
            template = template.replace(new RegExp('\{\{' + key + '\}\}'), data[key]);
        }

        row.innerHTML = template;

        return row;
    }

};


//append(cinema.viewVisitor.init(user[id])); //передавать только id пользователя

cinema.viewVisitorCollection = {

    _template: null,
    _model: cinema.modelVisitors,
    _templateId: 'allVisitorsTemplate',
    _elem: null,

    init: function () {
        this.getTemplate(this._templateId);
        this.render();
    },
    render: function () {
        this.fillTemplate();
    },
    getTemplate: function (templateId) {
        this._template = document.getElementById(templateId).innerHTML;
        return this._template;
    },
    fillTemplate: function() {
        var data = this._model.getDataList(10);
        
        this._elem = document.createElement('tbody');
        for(var i = 0; i < data.length; i++) {
            cinema.viewVisitor.init(data[i].id);
            var templateContent = this._elem.appendChild(cinema.viewVisitor.render(this._elem));
            this._elem.appendChild(templateContent);
        }
        document.getElementById('peoples').appendChild(this._elem);
    }

};

cinema.viewVisitorCollection.init();
