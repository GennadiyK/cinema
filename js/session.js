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
    };

    this.render = function() {
      return this.fillTemplate(this._sessionId);
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
        var session = this._model.getSessionById(id);
        var templateHTML;

        var template = this._template;
        for(var key in session) {
            if(key === 'places') {
                var container = document.createElement('div');
                var table = document.createElement('table');
                    table.className = 'placesTable table table-bordered table-striped';
                var tbody = document.createElement('tbody');
                    table.appendChild(tbody);
                for(var x = 0; x < 11; x++) {
                    var tr = document.createElement('tr');
                    for(var y = 0; y < 11; y++) {

                        var td = document.createElement('td');
                        if(x == 0) {
                            td.innerHTML = y;
                        }
                        if(y == 0) {
                            td.innerHTML = x;
                        }
                        tr.appendChild(td);
                    }
                    table.tBodies[0].appendChild(tr);
                }
                container.appendChild(table);
                session[key] = container.innerHTML;
            }
            template = template.replace(new RegExp('\{\{' + key + '\}\}'), session[key]);
        }
        templateHTML = this.parseTemplate(template);
        return templateHTML;
    }
};

var viewSession = new cinema.ViewSession(0);
viewSession.init();
document.getElementById('sessions').tBodies[0].appendChild(viewSession.render());









