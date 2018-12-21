"use strict";

const locations = [
    {title: 'Statue of Liberty', location: {lat: 40.6892494, lng: -74.0445004}},
      {title: 'Empire State Building', location: {lat: 40.7485452, lng: -73.98576349999996}},
      {title: 'Central Park', location: {lat: 40.7828647, lng: -73.96535510000001}},
      {title: 'Rockefeller Center', location: {lat: 40.7587402, lng: -73.97867359999998}},
      {title: 'New York Public Library', location: {lat: 40.75318230000001, lng: -73.98225339999999}},
      {title: 'Grand Central Terminal', location: {lat: 40.7527262, lng: -73.9772294}},
      {title: 'Metropolitan Museum of Art', location: {lat: 40.7794366, lng: -73.96324400000003}}
    ];
  

  let map;
  
  
  let markers = [];

  var viewModel;
  

  function initMap() {
  
    map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
    });
  
    var infoWindow = new google.maps.InfoWindow();
  
    for (var i = 0; i < locations.length; i++) {
      (function() {

        var title = locations[i].title;
        var position = locations[i].location;
  
        let marker = new google.maps.Marker({
          position: position,
          map: map,
          title: title,
          animation: google.maps.Animation.DROP,
          
        });
        markers.push(marker);
  
        viewModel.vmLocations()[i].marker = marker;
  
    
        marker.addListener("click", function() {
      
          populateInfoWindow(this, infoWindow);
      
          infoWindow.setContent(contentString);
        });
 
        function populateInfoWindow(marker, infoWindow) {
  
          if (infoWindow.marker != marker) {
            infoWindow.marker = marker;
            infoWindow.setContent(
              '<div class="title">' +
                marker.title +
                "</div>" +
                marker.contentString
            );

            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
              marker.setAnimation(null);
            }, 2130);
            infoWindow.open(map, marker);
    
            infoWindow.addListener("closeclick", function() {
              infoWindow.setMarker = null;
            });
          }
        }

        var title, contentString;

        var wikiTitle = title.split(' ').join('_');
    
        var wikiUrl = 'https://en.wikipedia.org/w/api.php?action=opensearch&search=' + wikiTitle  + '&format=json&callback=wikiCallback';
    
        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
            jsonp: 'callback',

            success: function (response) {
              var articleStr = response[0];

                var url = 'https://en.wikipedia.org/wiki/' + articleStr;
                contentString =  '<div class="title">' +
                marker.title +
                "</div>" +
                '<div><a href="' + url + '">' + articleStr + '</a></div>'; marker.contentString;
        
            },
            error: function() {
              contentString = "<div>Request appears to be unavailable. Please try again later.</div>"
            }
        })
          
      })(i);
      }
    }
  
  
  function mapError() {
    alert("Map could not be loaded at this moment. Please try again");
  }
  

  const Site = function(data) {
    let self = this;
    this.title = data.title;
    this.location = data.location;
    this.marker = data.marker;
    this.infoWindow = data.infoWindow;
    this.show = ko.observable(true); 
  };
  
  // View Model
  const ViewModel = function() {
    let self = this;
    this.vmLocations = ko.observableArray();
    this.filterText = ko.observable("");
  
    for (let i = 0; i < locations.length; i++) {
      let place = new Site(locations[i]);
      self.vmLocations.push(place);
    }
  
    
    this.searchFilter = ko.computed(function() {
      let filter = self.filterText().toLowerCase(); 
      
      for (let j = 0; j < self.vmLocations().length; j++) {
      
        if (
          self .vmLocations()[j].title.toLowerCase() .indexOf(filter) > -1
               
        ) {
          self.vmLocations()[j].show(true); 
          if (self.vmLocations()[j].marker) {
            self.vmLocations()[j].marker.setVisible(true); 
          }
        } else {
          self.vmLocations()[j].show(false);
          if (self.vmLocations()[j].marker) {
            self.vmLocations()[j].marker.setVisible(false); 
           
          }
        }
      }
    });
  
    
    this.showLocation = function(locations) {
      google.maps.event.trigger(locations.marker, "click");
    };
  };
  
  viewModel = new ViewModel();

  ko.applyBindings(viewModel);
  