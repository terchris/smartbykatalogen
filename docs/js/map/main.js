var MainMap;
var orgType_hash;
var currentOrg;

function initMap(container, lat, lng, zoom) {
  MainMap = new Map(container, lat, lng, zoom);
  orgType_hash = {};

  for(var j = 0; j < countedOrgTypes.organization_type.length; j++) {
    var org = countedOrgTypes.organization_type[j];
    orgType_hash[org] = MainMap.addLayer(org);
  }

  for(var i = 0; i < globalMembers.length; i++) {
    var member = globalMembers[i];
    var latlng;
    if(member.locationData) {
      latlng = JSON.parse(member.locationData.replace(/\'/g, "\"")).latlng;
    }else{
      latlng = {
        lat: 60.645556,
        lng: 3.726389
      };
    }

    MainMap.addMarker(latlng.lat, latlng.lng,
                      `<h5><a href=\"${member.website}\" target=\"_blank\">${member.display_name}</a></h5>
                        <img src=\"${member.image_url}\" alt=\"\" id=\"organization_logo\">
                        <p><b>type</b>: ${member.organization_type}</p>
                        <p><b>beskrivelse</b>: ${member.description}</p>
                        <p>
                          <b>Kontakt:</b> ${member.contact_name} , ${member.contact_title} <br>
                                          <a href=\"tel:${member.contact_mobile}\" target=\"_blank\">${member.contact_mobile}</a> <br>
                                          <a href=\"mailto:${member.contact_email}\" target=\"_blank\">${member.contact_email}</a>
                        </p>`,
                      "https://unpkg.com/leaflet@1.4.0/dist/images/marker-icon.png", [orgType_hash[member.organization_type]]);
  }


  $("i#viewTable").click(function() {
    displayMemberCards();
    if(currentOrg) filterByOrgType(currentOrg);
    document.querySelector("div#mapContainer").style.display = "none";
  });

  $("i#viewMap").click(function() {
    document.getElementById("app").innerHTML = "";
    document.querySelector("div#mapContainer").style.display = "block";
    setTimeout(function() {
      MainMap.apimap.invalidateSize();
    }, 100);
  });
}
