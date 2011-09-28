// Twitter Map

$(function() {

//-- Data ---------------------------------------------------------------------//    
    
    var Tweet = new Backbone.Model();
    
    var Tweets = Backbone.Collection.extend({
            
        url: "http://search.twitter.com/search.json?callback=?&result_type=mixed&count=100&rpp=100&geocode=35.5,-100,1000mi",

        parse: function(response) {
                    
            var filtered = _.filter(response.results, function(d) {
                if (d.geo !== null) {
                    return true;
                }
            });
            
            this.add(filtered);
            
        },
            
        initialize: function() {
          
          setInterval(function() {
              console.log("Fetching fresh data...");
              tweets.fetch();
          }, 2000)
          
          this.fetch();
        }
  });
  

//-- Views --------------------------------------------------------------------//
    
    var Map = Backbone.View.extend({
        
        el: $('#map_canvas'),
                        
        initialize: function() {
            
            var latlng = new google.maps.LatLng(35.5, -100);
            
            var myOptions = {
                zoom: 5,
                center: latlng,
                mapTypeControl: false,
                navigationControlOptions: {
                style: google.maps.NavigationControlStyle.ANDROID
                },
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                streetViewControl: false,
                styles: [{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"landscape.natural",stylers:[{hue:"#0000ff"},{lightness:-84},{visibility:"off"}]},{featureType:"water",stylers:[{visibility:"on"},{saturation:-61},{lightness:-63}]},{featureType:"poi",stylers:[{visibility:"off"}]},{featureType:"road",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"landscape",stylers:[{visibility:"off"}]},{featureType:"administrative",stylers:[{visibility:"off"}]},{},{}]
              
            };
            
            this.el.height($(window).height() - $("header").height());
            
            var map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
            
            
            // Bind an event to add tweets from the collection
            
            this.collection.bind('add', function(model) {
               
                console.log("Marker added");
                        
                //Stores the tweet's location
                var position = new google.maps.LatLng( model.get("geo").coordinates[0], model.get("geo").coordinates[1]);	
                	
                //Creates the marker
                var marker = new google.maps.Marker({													
                	position: position,
                	map: map,
                	title: model.from_user,
                	icon: '/images/marker.png',
                	description: model.text
                });
                
                
            });
        }
    });
    

//-- Initialize ---------------------------------------------------------------//
        
    var tweets = new Tweets({
        model: Tweet
    });
    
    var twitter_map = new Map({
        collection: tweets
    });
    

});