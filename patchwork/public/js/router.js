// Router

var Workspace = Backbone.Router.extend({
        
    routes: {
        '/'              : 'changeWorkspace',
        '/workspace/:id' : 'changeWorkspace'
    },
    
    changeWorkspace: function(id) {
                           
        var id = id || this.now.id;
        
        // Mark the previewer and patches as selected
        $(".patch, .tab").removeClass('selected');
        $('.patch.user-' + id + ', .tab.user-' + id).addClass('selected');
        
        // Set the patch to the selected value
        $(".patch").fadeOut();
        $('.patch.selected').fadeIn()

    }
    
});