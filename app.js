const locations = [
    {title: 'Park Ave Penthouse', location: {lat: 40.7713024, lng: -73.9632393}},
      {title: 'Chelsea Loft', location: {lat: 40.7444883, lng: -73.9949465}},
      {title: 'Union Square Open Floor Plan', location: {lat: 40.7347062, lng: -73.9895759}},
      {title: 'East Village Hip Studio', location: {lat: 40.7281777, lng: -73.984377}},
      {title: 'TriBeCa Artsy Bachelor Pad', location: {lat: 40.7195264, lng: -74.0089934}},
      {title: 'Chinatown Homey Space', location: {lat: 40.7180628, lng: -73.9961237}}
    ];
  

  let map;
  
  
  let markers = [];
  

  function initMap() {
  
    map = new google.maps.Map(document.getElementById("map"), {
      center: {lat: 40.7413549, lng: -73.9980244},
      zoom: 13
    });
  
    let infoWindow = new google.maps.InfoWindow();
  
    for (i = 0; i < locations.length; i++) {
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
    
        let wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + title + '&format=json&callback=wikiCallback';
    
        $.ajax({
            url: wikiUrl,
            dataType: 'jsonp',
            jsonp: 'callback',

            success: function (response) {
              let articleStr = response[0];

                let url = 'http://en.wikipedia.org/wiki/' + articleStr;
                contentString =  '<div class="title">' +
                marker.title +
                "</div>" +
                '<div><a href="' + url + '">' + articleStr + '</a></div>'; marker.contentString;
        
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
    this.show = ko.observable(true);
  };
  
  // View Model
  const ViewModel = function() {
    let self = this;
    this.vmLocations = ko.observableArray();
    this.filterText = ko.observable("");
  
    for (i = 0; i < locations.length; i++) {
      let place = new Site(locations[i]);
      self.vmLocations.push(place);
    }
  
    
    this.searchFilter = ko.computed(function() {
      let filter = self.filterText().toLowerCase(); 
      
      for (j = 0; j < self.vmLocations().length; j++) {
      
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
  