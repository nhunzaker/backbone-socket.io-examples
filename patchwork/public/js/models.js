// 1. Models

var User = Backbone.Model.extend({});

var File = Backbone.Model.extend({
    defaults: {
        filename     : '',
        content_type : 'text/text',
        content      : '',
        owner        : '',
        position     : {
            top: '50%',
            left: '50%'
        }
    }
});