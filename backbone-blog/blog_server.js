// Name   : Example Server
// Author : Nate Hunzaker 
//
//-- 1. Create Backbone.Server
//-- 2. Collect Data
//-- 3. Routes
//-- 4. Socket.io Methods
//-- 5. Start Server
//


//-- 1. Create Backbone.Server
    
    var Backbone = require('backbone-server');
    
    var server = new Backbone.Server({
        'port'        : 9000,
        'socketio'    : true,
        'view engine' : 'ejs'
    });


//-- 2. Collect Data
    
    var articles = require('./data.js').article_data;


//-- 3. Routes

    // Index
    server.get('/', function(req, res) {
        res.render("index");
    });
    
    // Single Article Page
    server.get('/:name', function(req, res) {
        var article = articles.get(req.params.name).toJSON();
        res.render('article', article);
    });
    
    // For partial rendering on the client side
    server.get('/template/:name', function(req, res) {
        res.sendfile(__dirname + '/views/' + req.params.name + "." + server['view engine']);
    });
    

//-- 4. Socket.io Functions
    
    // Note: I've altered this method to show the traditional socket.io way of doing things (using io.sockets.on)
    server.receive('connection', function() {
        console.log("Received connection, sending articles...");
        server.send('articles', articles);
    });


//-- 5. Start Server

    server.start();