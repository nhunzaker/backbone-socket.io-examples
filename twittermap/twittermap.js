// Twitter Map
// Geographically displays all tweets by search query
//
//-- Requires: --------------------------------------//
    var Backbone = require('backbone-server');
//---------------------------------------------------//


// Server:
var twitter_map = new Backbone.Server({
    'view engine' : 'ejs',
});

// Routes:
twitter_map.get('/', function(req, res) {
    res.render('index');
});

twitter_map.start();