// Views

var Patch = Backbone.View.extend({
        
    initialize: function() {;
        // Create Patch
        this.el = '.user-' + this.model.get("id");
        
        // Bind events
        this.model.bind('change', this.render());
    },
    
    render: function() {
    
        var view = this,
            model = this.model;
        
        // Render patch
        $.get('/template/patch', function(data) {
            var html = _.template(data, model.toJSON());
            
            $("#container").prepend(html);

            // If we're rendering the user's patch, select it
            if (model.get('id') === now.id) {
                $(view.el).addClass("selected");
            }
        });
        
        // Render tab
        $.get('/template/tab', function(data) {
            var html = _.template(data, model.toJSON());
            
            $("header").prepend(html);
            
            // Adjust the positioning of all tabs
            $('.tab').each(function (i){
                $(this).animate({ right: (i * 80) + 20 }, 250);
            });
            
            // If we're rendering the user's patch, select it
            if (model.get('id') === now.id) {
                $(view.el).addClass("selected").fadeIn(300).focus();
            }
        });
    }
});

var TextBox = Backbone.View.extend({

    initialize: function() {
        // Bind events
        this.model.bind('add', this.render());
    },
                                  
    render: function() {
                   
        var model = this.model,
            view  = this;

        $.get('/template/file', function(data) {        
            
            // Add the template
            var html = _.template(data, model.toJSON()); 
            $(".patch.user-" + model.get('owner')).append(html);       
            
            // Now that we've added it, let's set the el
            view.el = '.textblock.' + model.get('id');
            
            // For later use, let's go ahead and set the absolute positioning
            $(view.el).animate(model.get('position'), 500);

            // Make it editable and draggable by the owner
            if (model.get('owner') === now.id) {
                
                $(view.el).children(".content").prop("contenteditable", "true");
                
                $(view.el).draggable({ 
                    grid: [20, 20],
                    handle: 'header',
                    //containment : '.patch.user-' + model.get('owner'),
                    stop: function(e) {
                        var position = $(view.el).offset();
                        now.sendFileUpdates(model.get('id'), { 'position' : position });
                    }
                });
            }

           view.delegateEvents({
               'change .content'   : 'sendContent',
               'paste.content'    : 'sendContent',  
               'keyup.content'    : 'sendContent'
           });
            
            // Notify that we have a new text block
            now.flash("success", "<strong>Patchwork:</strong><br/>File <strong>" + model.get('filename') + "</strong> was successfully converted into a snippet");
            
        });
    },

    update: function() {
        var model = this.model;

        if (model.get('owner') !== now.core.clientId) {
            $(this.el).animate(model.get('position'), 500).children(".content").text(model.get('content'));
        }
    },

    sendContent: function() {
        now.sendFileUpdates(this.model.get('id'), { content: $(this.el).children('.content').text() });
    }
    
});
