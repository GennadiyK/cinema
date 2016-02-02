var cinema = cinema || {};

cinema.sessionModel = {
    _data: null,

    init: function(data) {
        this.setDataFromJson(data);
    },

    setDataFromJson: function(data) {
        this._data = data;
    }
};

cinema.sessionModel.init(sessionData);

cinema.ViewSession = function(sessionId) {
    this._template = null;
    this._model = cinema.sessionModel;
    this._templateId = 'sessionTemplate';
    this._sessionId = sessionId;

    this.init = function() {
        this.getTemplate(this._templateId);
        this.render();
    };

    this.render = function() {
        this.fillTemplate(this._sessionId);
    };

    this.getTemplate = function(templateId) {
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

    }
};








