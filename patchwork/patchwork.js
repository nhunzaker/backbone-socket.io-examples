// Patchwork
// An interactive multiuser quilt of browser windows
//

//-- Requirements:
    
    var Backbone = require('backbone-server'),
        server   = new Backbone.Server({ 'view engine' : 'ejs', 'port': 3000}),
        
        // NowJS objects (for interaction with the client)
        nowjs    = require('now'),
        everyone = nowjs.initialize(server.express);


//-- Backbone Data

    var Models = require('./public/js/models.js');
        
    var users  = new Backbone.Collection({
            model: Models.User 
        }).reset();            
        
    var files  = new Backbone.Collection({
            model: Models.File 
        }).reset();

        
//-- Routes
    
    // Index
    server.get('/', function(req, res) {
        res.render('index');
    });
    
    // Templates
    server.get('/template/:filename', function(req, res) {
        res.sendfile(__dirname + '/views/templates/' + req.params.filename + '.ejs');
    });
    
    
//-- Configure now interaction
    
    //-- User Management
    
        // On user connect
        nowjs.on('connect', function() {
           
            // Set an identifier for reference downstairs
            this.now.id = this.user.clientId;
                 
            // Add user to the database
            users.add({ id: this.user.clientId, name: this.now.name });
                        
            // Give the new user all of the user data
            this.now.addPlayers(users.toJSON());
            
            // Send the new user to all 'cleared' players
            nowjs.getGroup('clearinghouse').now.addPlayers(users.get(this.user.clientId).toJSON());
            
            // Add the new user to the clearing house
            nowjs.getGroup('clearinghouse').addUser(this.user.clientId);
            
            // Welcome the new user
            this.now.flash("success", "Welcome, " + this.now.name);
            
            // If we have files, shoot them over to the new user
            this.now.addFile(files.toJSON);
            
        });
        
        // On user disconnect
        nowjs.on('disconnect', function() {
            
            // Remove user from group
            nowjs.getGroup('clearinghouse').removeUser(this.user.clientId);
            
            // Update database
            users.remove(this.user.clientId);
            
            // Remove user from client databases
            everyone.now.removePlayer(this.now.id);
            everyone.now.flash("notice", this.now.name + " has disconnected");
        });
        
    
    //-- File Management
    
        // Add Files to server
        everyone.now.addFiletoServer = function(data) {
                        
            files.add(data);
                        
            everyone.now.addFile(files.get(data.id).toJSON());
        };
        
        // Move Files
        everyone.now.sendFileUpdates = function(id, data) {
            
            files.get(id).set(data);
            var new_attributes = files.get(id).attributes.toJSON();

            everyone.now.receiveFileUpdates(id, new_attributes);
        }
        
//-- Start everything up
    
    server.start();