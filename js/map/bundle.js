"use strict";








/**
 * Function for generating unique number-strings
 * Number-strings are generated similarly to UNIX's epoch time
 *
 * @return {string} The current date, converted to a number-string
 */
function EpochTime() {
  return (new Date()).getTime().toString();
}








/**
 * Initializing function for api map
 *
 * @param {string} containerId The id of the container element
 * @param {number} zoom The zoom level the map is to be initialized to
 * @param {number} initLat The latitude value the map is to be initialized to
 * @param {number} initLng The longitude value the map is to be initialized to
 */
 function Map(containerId, zoom, initLat, initLng) {
    this.id = EpochTime();
    this.initLat = initLat;
    this.initLng = initLng;

    var hash = EpochTime();
    this.basemaps = [
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    id: hash,
                    attribution: "&copy; <a href=\"http://openstreetmap.org/copyright\" target=\"_blank\">OpenStreetMap</a> contributors"
                  }),
      L.tileLayer("https://www.google.com/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}", {
                    id: (parseInt(hash) + 1).toString(),
                    attribution: "&copy; <a href=\"https://www.google.com/\" target=\"_blank\">Google Maps</a> contributors"
                  })
    ];
    this.layers = new Array();

    this.apimap = L.map(containerId, {
      center: [this.initLat, this.initLng],
      zoomControl: false,
      zoom: zoom,
      layers: [this.basemaps[0]]
    });
    L.control.zoom({
      position: "bottomleft"
    }).addTo(this.apimap);



    var underlay = {};
    underlay["OpenStreetMap &nbsp;&nbsp;"] = this.basemaps[0];
    underlay["Google Maps &nbsp;&nbsp;"] = this.basemaps[1];

    var overlay = {};

    this.mapControl = L.control.layers(underlay, overlay, {
      position: "bottomright"
    }).addTo(this.apimap);





    // Initializes the geolocation map search
    this.searchControl = L.esri.Geocoding.geosearch({
      position: "topleft"
    }).addTo(this.apimap);









   /**
    * Method for adding a layer to the map
    *
    * @param {number} lat The latitude value of the marker
    * @param {number} lng The longitude value of the marker
    * @param {string} popupCont The popup content of the marker should display
    * @param {string} iconUrl The url to the marker icon
    * @param {Array<string>} layerIds A, possibly empty, list of id's. These are the id's of the layers that the maper is to be added to
    *
    * @return {string} The id of the new marker
    *
    * @throws An error if the layer type is not defined
    */
    this.addMarker = function(lat, lng, popupCont, iconUrl, layerIds) {
      var newIcon = L.icon({
                      iconUrl: iconUrl,
                      iconSize: [38, 95]
                    }),
          hash = EpochTime();
      var marker = L.marker([lat, lng], {icon: newIcon}).bindPopup(popupCont);

      marker.options.id = hash;

      for(var i = 0; i < layerIds.length; i++) {
        this.getLayer(layerIds[i]).addLayer(marker);
      }

      return hash;
    };


   /**
    * Method for adding a layer to the map
    *
    * @param {string} title The name of the layer to be added
    *
    * @throws An error if the layer type is not defined
    */
    this.addLayer = function(title) {
      var layer = L.markerClusterGroup(),
          hash = EpochTime();

      layer.options.id = hash;
      layer.options.type = "MarkerCluster";
      layer.options.title = title;

      this.layers.push(layer);

      this.apimap.addLayer(layer);
      this.mapControl.addOverlay(layer, `<span id=\"${hash}\">${title}</span>`);

      return hash;
    };


   /**
    * Method for getting a layer on the map
    *
    * @param {string} hash The unique hash of the layer to be returned
    *
    * @return {object} The layer with id equal to 'hash'
    */
    this.getLayer = function(hash) {
      for(var x = 0; x < this.layers.length; x++) {
        if(this.layers[x].options.id == hash) {
          return this.layers[x];
        }
      }
    };



   /**
    * Method for getting the position of a layer in the layer list
    *
    * @param {string} hash The unique hash of the layer to get the position of
    *
    * @return {number} The position of the layer
    */
    this.getLayerPos = function(hash) {
      for(var x = 0; x < this.layers.length; x++) {
        if(this.layers[x].options.id == hash) {
          return x;
        }
      }
    };

   /**
    * Method for removing a layer from the map
    *
    * @param {string} hash The unique hash of the layer to be removed
    */
    this.removeLayer = function(hash) {
      var x = this.getLayerPos(hash);

      this.apimap.removeLayer(this.layers[x]);
      this.mapControl.removeLayer(this.layers[x]);
      this.layers.splice(x, 1);
    };
  }
