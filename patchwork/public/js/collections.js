// 2. Collections

var UsersCollection = Backbone.Collection.extend({
    model: User,
    
    initialize: function() {
        this.bind('add', function(model) {
            var patch = new Patch({ model: model });
        });
        this.bind('remove', function(model) {
            $('.patch.user-' + model.id).remove();
        });
    }
    
});

var FilesCollection = Backbone.Collection.extend({
   model: File,
   
   initialize: function() {
       this.bind('add', function(model) {
           var textbox = new TextBox({ model: model });

           textbox.model.bind('change', function() {
              textbox.update();
           });
       });

       this.bind('remove', function(model) {
           $('.textblock .' + model.id).remove();
       });
   }
});