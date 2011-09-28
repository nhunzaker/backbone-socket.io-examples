jQuery(function() {

//-- Backbone Objects --------------------------------------------------//
    
    //-- Models --------------------------------------------------------//
    
        var Article = Backbone.Model;
    
    
    //-- Collections ---------------------------------------------------//
    
        var Articles = Backbone.Collection.extend({ 
            model: Article 
        });
        
        
    //-- Views ---------------------------------------------------------//
        
        var Posts = Backbone.View.extend({
            
            el: $('#content'),
            
            template: '/template/article',

            initialize: function() {
                
                var post = this;
                
                this.collection.bind('add', function(model) {
                    post.render(model);
                })
            },
            
            render: function(id) {
                var view    = this,
                    content = this.collection.get(id).toJSON();

                $.get(view.template, function(template) {
                    // We use the Underscore '_.template' function to generate our html
                    view.el.append( _.template( template, content ));
                });

                return this;
            },

            renderAll: function() {
                var view = this;
                
                // Reset the collection and render each article in the collection
                view.reset().collection.each(function(article) {
                   view.render(article);
                });

                return this;
            },

            reset: function() {
                var view = this.el;

                view.html("");

                return this;
            }
            
        });
        
    
    //-- Create instances ----------------------------------------------//
    
        articlesCollection = new Articles();
        
        var posts = new Posts({
            collection: articlesCollection
        });
        
        
    //-- Router --------------------------------------------------------//
    
    var Router = Backbone.Router.extend({
        
        routes: {
            '/'         : 'index',
            '/:id'      : 'show',
        },
        
        index: function() {
            $("#content").fadeTo(250, 0, function() {
                posts.renderAll(); 
            }).fadeTo(250, 1);
        },

        show: function(id) {
            $("#content").fadeTo(250, 0, function() {
                posts.reset().render(id);
            }).fadeTo(250, 1);
        }
        
    });
    
    var router = new Router();
    Backbone.history.start();
            
  
//-- Socket.IO ---------------------------------------------------------//
    
    var socket = io.connect('http://localhost');                      
    
    // Receive Article Data when the user connects
    socket.on('articles', function(data) {
        
        articlesCollection.add(data);
        
    });
    
});