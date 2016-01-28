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
        this.fillTemplate(this._filmId);
    };

    this.getTemplate = function(id){
        this._template = document.getElementById(id).innerHTML;

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

        for(var key in film) {
            template = template.replace( new RegExp('\{\{' + key + '\}\}'), film[key]);
        }
        templateHTML = this.parseTemplate(template);

        this._row.appendChild(templateHTML);

        return this._row;
    };

};

var viewFilm = new cinema.ViewFilm(1);

viewFilm.init();