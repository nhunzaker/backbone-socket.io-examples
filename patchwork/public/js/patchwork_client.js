// --------------------------- //
// --------------------------- //

    
// Collections (Models don't need to be instantiated)  

    var usersCollection = new UsersCollection()
        filesCollection = new FilesCollection();
    
// Router
    var workspace = new Workspace;
    Backbone.history.start();


// 5. Manage
    
    // Create users as they join
    now.addPlayers = function(data) {
        usersCollection.add(data);
    };
    
    // Remove users
    now.removePlayer = function(id) {
        
        $(".user-" + id).fadeOut(500, function() {
            $(this).remove();
            
            // Adjust the positioning of all tabs
            $('.tab').each(function (i){
                $(this).animate({ right: (i * 80) + 20 }, 250);
            });
        });
        
        usersCollection.remove(id);
    };
    
    // Add files
    now.addFile = function(data) {
        if (data['id']) {
            filesCollection.add(data);
        }
    }
    
    // Update files on the grid
    now.receiveFileUpdates = function(id, data) {  
       var file = filesCollection.get(data.id);
       file.set(data)
    }
    
    // Push notifications
    now.flash = function(type, message) {
        $("#container").append("<div class='flash " + type + "'>" + message + "</div>");
        
        $(".flash").fadeOut(0).fadeIn(500).delay(2000).fadeOut(500, function() {
            $(this).remove();
        });
    }
        
        
// 6. Initialize
     
    function initialize() {
        var username = "";
        
        function askName(message) {
            
            var message = message || "Welcome to Patchwork! Please enter you name:";
            
            username = prompt(message).replace(/(^\W|\W)/g, "_");
            
            // If user name is empty or taken:
            if ( (username !== "") && (username !== null) ) {
                now.name = username;
                
                // Setup the drag and drop listeners.
                addDropSupport(filesCollection);
            }
        }
        
        askName();
        
    }; 
    
    initialize();