var cinema = cinema || {};

cinema.sessionModel = {
    _data: null,

    init: function(data) {
        this.setDataFromJson(data);
    },

    setDataFromJson: function(data) {
        this._data = data;
    },

    getSessionById: function(id) {
        for(var i = 0; i < this._data.length; i++) {
            for(var key in this._data[i]) {
                if(key === 'id' && this._data[i][key] === id) {
                    return this._data[i];
                }
            }
        }

    },

    setData: function(id, key, val){
        var session = this.getSessionById(id);
        if(key === 'places') {
            if(session[key][val] > 1) {
                session[key][val] = 0;
            } else {
                session[key][val] = 1;
            }

        } else {
            session[key] = val;
        }
    }
};

cinema.sessionModel.init(sessionData);

cinema.ViewSession = function(sessionId) {
    this._template = null;
    this._model = cinema.sessionModel;
    this._templateId = 'sessionTemplate2';
    this._sessionId = sessionId;
    this._row = null;
    this._placesTable = null;

    this.init = function() {
        this.getTemplate(this._templateId);

    };

    this.render = function() {
        this._row = this.fillTemplate(this._sessionId);
        this.eventListener(this._row);

        return this._row;
    };

    this.getTemplate = function(templateId) {
        this._template = document.getElementById(templateId).innerHTML;
        return this._template;
    };

    this.changeIdFilmOnName = function(id) {
        var session = this._model.getSessionById(id);
        var film = cinema.modelFilms.getFilmById(session['filmId']);

        return film['filmName'];
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

    this.fillTemplate = function(id) {

        var session = this._model.getSessionById(id);
        var templateHTML;
        var template = this._template;

        for(var key in session) {
            if(key === 'places') {
                var container = document.createElement('div');
                var table = document.createElement('table');
                    table.className = 'placesTable table table-responsive';
                var tbody = document.createElement('tbody');
                    table.appendChild(tbody);
                for(var x = 0; x < 11; x++) {
                    var tr = document.createElement('tr');
                    for(var y = 0; y < 11; y++) {
                        var td = document.createElement('td');

                        if(x == 0 ) {
                            td.innerHTML = y;

                        } else if(y == 0) {
                            td.innerHTML = x;

                        } else {
                            td.innerHTML = x + ":" + y;
                            td.dataset.place = x + ":" + y;
                        }
                        tr.appendChild(td);
                    }
                    table.tBodies[0].appendChild(tr);
                }

                container.appendChild(table);


                template = template.replace(new RegExp('\{\{' + key + '\}\}'), container.innerHTML);
                this._placesTable = this.parseTemplate(container.innerHTML);

            }else if(key === 'filmId') {
                var title = this.changeIdFilmOnName(session[key]);
                template = template.replace(new RegExp('\{\{' + key + '\}\}'), title);
            } else {
                template = template.replace(new RegExp('\{\{' + key + '\}\}'), session[key]);
            }
        }

        templateHTML = this.parseTemplate(template);
        return templateHTML;
    };

    this.eventListener = function(row) {
        this.showModal(row);
        this.closeModal();
        this.choosePlace(this._placesTable);

    };

    this.choosePlace = function(row) {
        var tdCollection = row.querySelectorAll('td');
        var td = [].slice.call(tdCollection);
        var that = this;


        for(var i = 0; i < td.length; i++) {

            td[i].addEventListener('click', function(e){
                e.stopPropagation();
                var elem = this;

                if(!elem.dataset.place) return;

                elem.classList.toggle('choose');

                that._model.setData(that._sessionId, 'places', elem.dataset.place);
            });
        }
    };

    this.showModal = function(row) {
        var btn = row.querySelectorAll('.btnShowPlaces');
        var modal = document.getElementById('modal');
        var modalBg = document.getElementById('modalBg');
        var placesTable = this._placesTable;

        for(var i = 0; i < btn.length; i++) {
            btn[i].addEventListener('click', function(){
                modalBg.classList.add('in');
                modalBg.classList.remove('hidden');
                modal.classList.add('in');
                modal.style.display = 'block';

                modal.getElementsByClassName('modal-body')[0].appendChild(placesTable);


            }.bind(this));
        }
    };

    this.closeModal = function() {
        var modal = document.getElementById('modal');
        var modalBg = document.getElementById('modalBg');
        var span = document.createElement('span');
        var table;


        modal.addEventListener('click', function(e){
            e.preventDefault();
            var elem = e.target;
            if(!elem.dataset.dismiss) return;


            modal.classList.remove('in');
            modal.style.display = 'none';
            modalBg.classList.remove('in');
            modalBg.classList.add('hidden');

            table = modal.querySelector('.placesTable');
            table.parentNode.removeChild(table);
        }.bind(this));
    }
};

var viewSession = new cinema.ViewSession(0);
viewSession.init();
document.getElementById('sessions').tBodies[0].appendChild(viewSession.render());









