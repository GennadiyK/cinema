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

cinema.viewVisitors = {
    //для чего View - исходя из это методы вьюшки
    /*
     * 1.получать данные из модели
     * 2.отрисовывать полученные данные в темплэйте
     * 3. дать возможность пользователю изменить отображаемые данные
     * 4. сохранить введённые данные и передать их в модель
     * 5. отменить сохраниение введённых данных
     * 6.добавить нового пользователя и передать данные в модель
     * 7. удалить пользователя текущего и передать id удаленного пользователя в модель
     *
     * */
    //метод init render
    //в init продумать поведение вьющки при  изменения модельки
    _template: null,

    init: function (model, templateId) {
        this.render(model, templateId);
    },
    render: function (model, templateId) {
        this.fillTemplate(model, templateId);
    },
    getDataFromModel: function (model) {
        return model.getDataList(10);
    },
    getTemplate: function (templateId) {
        this._template = document.getElementById(templateId);

        return this._template.innerHTML;
    },
    fillTemplate: function (model, templateId) {
        var template = this.getTemplate(templateId);
        var data = this.getDataFromModel(model);

        for(var i = 0; i < data.length; i++) {
            var row = document.createElement('tr');

            for(var key in data[i]) {
                template = template.replace(new RegExp('\{\{' + key + '\}\}'), data[i][key]);
            }
            
            row.innerHTML = template;
            document.getElementById('peoplesTable').tBodies[0].appendChild(row);
        }

    }

    //var model = model;
    //var template = document.getElementById(templateId);
    //
    //this.editData = function(field, fieldLabel) {
    //    var inputContainer = document.createElement('div');
    //        inputContainer.setAttribute('class','input-group');
    //    var inputField = document.createElement('input');
    //        inputField.setAttribute('class','form-control');
    //    var cancelButton = document.createElement('button');
    //        cancelButton.setAttribute('class', 'btn btn-danger');
    //        cancelButton.innerHTML = 'cancel';
    //    var saveButton = document.createElement('button');
    //        saveButton.setAttribute('class', 'btn btn-success');
    //        saveButton.innerHTML = 'save';
    //    var btnContainer = document.createElement('div');
    //        btnContainer.setAttribute('class','input-group-btn');
    //        btnContainer.appendChild(cancelButton);
    //        btnContainer.appendChild(saveButton);
    //
    //    var fieldValue;
    //
    //
    //    //checking label of col
    //    if(fieldLabel == 'name') {
    //        fieldValue = model.name;
    //    }
    //
    //    //adding text to value
    //    inputField.value = fieldValue;
    //
    //    //clearing html of col
    //    field.innerHTML = '';
    //
    //    //adding new elements: input and cancel button to the col
    //    inputContainer.appendChild(inputField);
    //    inputContainer.appendChild(btnContainer);
    //    field.appendChild(inputContainer);
    //
    //    inputField.focus();
    //
    //    //canceling any changing with input value
    //    cancelButton.addEventListener('click', function(e){
    //
    //        e.preventDefault();
    //        this.cancelEditData(field, fieldValue);
    //
    //    }.bind(this));
    //
    //    //saving value at the moment of changing
    //
    //    saveButton.addEventListener('click', function(e){
    //
    //        e.preventDefault();
    //        if(fieldLabel == 'name') {
    //            this.saveEditData(inputField, 'name', field);
    //        }
    //
    //    }.bind(this));
    //};
    //
    //this.cancelEditData = function(field, val){
    //    return field.innerHTML = val;
    //};
    //
    //this.saveEditData = function(input, key, field) {
    //    model[key] = input.value;
    //    return field.innerHTML = model[key];
    //};
    //
    //this.eventListener = function(parent) {
    //    parent.addEventListener('dblclick', function(e){
    //        var target = e.target;
    //        if(target.dataset.field != 'edit') return;
    //
    //        this.editData(target,'name');
    //    }.bind(this));
    //};
    //
    //this.render = function() {
    //    var tr = document.createElement('tr');
    //    var trContent = template.innerHTML;
    //    var table = document.getElementById('peoplesTable');
    //    for(var key in model) {
    //        trContent = trContent.replace(new RegExp('\{\{' + key + '\}\}'), model[key]);
    //    }
    //
    //    table.tBodies[0].innerHTML = trContent;
    //    this.eventListener(table);
    //};
};

cinema.viewVisitors.init(cinema.modelVisitors, 'cinemaTemplate');
