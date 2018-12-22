"use strict";

//locations in New York
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
  
  // create a blank array for all of the location markers
  let markers = [];
// dclare viewModel globally in order to access the vmLocations in initMap
  var viewModel;
  

  function initMap() {
  
    map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
    });
  
    var infoWindow = new google.maps.InfoWindow();
  
    //iterates throough locations array, creates and drops markers
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
  
        // Event listener to open infoWindow when marker is clicked
        marker.addListener("click", function() {
         //show inforamtion in infoWindow when opened
          populateInfoWindow(this, infoWindow);
          // shows wiki info
          infoWindow.setContent(contentString);
        });
 
        //Populates info window when marker is clicked
        function populateInfoWindow(marker, infoWindow) {
          // Make sure infoWindow is not already open for marker
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
           //clear marker when infoWindow is closed
            infoWindow.addListener("closeclick", function() {
              infoWindow.setMarker = null;
            });
          }
        }
        // variables for wikipedia api
        var title, contentString;
        // replace spaces in title string with _ for wikipedia url
        var wikiTitle = title.split(' ').join('_');
        // wikipedia url and AJAX request
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

  // Site constructor
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
    this.vmLocations = ko.observableArray(); //for filtering
    this.filterText = ko.observable("");
  
 // iterate throough locatons and create a new Site object for each location and push the new object to vmLocations
    for (let i = 0; i < locations.length; i++) {
      let place = new Site(locations[i]);
      self.vmLocations.push(place); 
    }
  
    
    this.searchFilter = ko.computed(function() {
      let filter = self.filterText().toLowerCase(); 
      //filter through vmLocations and filter as user is typing
      for (let j = 0; j < self.vmLocations().length; j++) {
    
        if (
          self .vmLocations()[j].title.toLowerCase() .indexOf(filter) > -1
               
        ) {
          self.vmLocations()[j].show(true); //shows from filtered list
          if (self.vmLocations()[j].marker) {
            self.vmLocations()[j].marker.setVisible(true);  //shows markers in filtered list
          }
        } else {
          self.vmLocations()[j].show(false); //hides locations not in filtered list
          if (self.vmLocations()[j].marker) {
            self.vmLocations()[j].marker.setVisible(false); //hides markers not in filtered list
           
          }
        }
      }
    });
    
    //marker bounces when location in the list is clicked
    this.showLocation = function(locations) {
      google.maps.event.trigger(locations.marker, "click");
    };
  };

  
 
 //instantiate a new View Model 
  viewModel = new ViewModel();
// apply knockout.js bindings
  ko.applyBindings(viewModel);
  