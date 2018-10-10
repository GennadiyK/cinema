var cinema = cinema || {};

cinema.modelFilms = {
    _data: null,

    init: function(data){
        this.setDataFromJson(data);
    },

    setDataFromJson: function(data) {
       this._data = data;
    },

    getFilmById: function(id) {
        for(var i = 0; i < this._data.length; i++) {
            for(var key in this._data[i]) {
                if(key === 'id' && this._data[i][key] == id) {
                   return this._data[i];
                }
            }
        }
    },

    getDataList: function(len) {
        var arr = [];

        for(var i = 0; i < this._data.length && len > 0; i++) {
            arr.push(this._data[i]);
            len--;
        }
        return arr;
    }
};

cinema.modelFilms.init(filmsData);


cinema.ViewFilm = function(filmId) {
    this._template = null;
    this._model = cinema.modelFilms;
    this._filmId = filmId;
    this._templateId = 'filmTemplate';
    this._row = null;

    this.init = function() {
        this.getTemplate('filmTemplate');
        this.render();
    };

    this.render = function() {
        return this.fillTemplate(this._filmId);
    };

    this.getTemplate = function(templateId){
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

    this.fillTemplate = function(id) {
        var film = this._model.getFilmById(id);
        var template = this._template;
        var templateHTML;

        this._row = document.createElement('li');
        this._row.className = 'list-group-item';

        for(var key in film) {
            template = template.replace( new RegExp('\{\{' + key + '\}\}'), film[key]);
        }
        templateHTML = this.parseTemplate(template);

        this._row.appendChild(templateHTML);

        return this._row;
    };

};

cinema.viewFilmCollection = {
    _elem: document.createElement('ul'),
    _container: document.getElementById('films'),
    _filmData: null,

    init: function() {
        this._elem.className = 'list-group';
        this._filmData = cinema.modelFilms.getDataList(10);
        this.render();

    },

    render: function() {
        for(var i = 0; i < this._filmData.length; i++){
            var filmsList = new cinema.ViewFilm(i);
                filmsList.init();
            this._elem.appendChild(filmsList.render());
        }
        this._container.appendChild(this._elem);
    }

}


cinema.viewFilmCollection.init();
//test

