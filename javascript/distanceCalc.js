// Scale factor was precomputed
// We chose identical points on the map and in Google Maps and 
//  found the corresponding scale between the two distances
// This converts from virtual map distance to metres
scaleFactor = 3.216377148

function getDistanceMetres(path) {
    var distance = 0;
    for (var i = 0; i < path.length - 1; i++) {
        var start = nameToCoords(path[i]);
        var end = nameToCoords(path[i + 1]);
        distance += nodeDistance(start, end) * scaleFactor;
    }

    return Math.round(distance);
}

function toDisplayCoords(coords) {
    coords = nameToCoords(coords);
    coords = [-coords[1], coords[0]];
    return coordsToName(coords);
}

totalDistance = 0;

function infoUpdate(startNode, endNode, distance) {
    var coordinatesId = document.getElementById("coordinates");
    var distanceId = document.getElementById("distance");
    var totalDistanceId = document.getElementById("totalDistance");
    startNode = toDisplayCoords(startNode);

    if (endNode == null) {
        coordinatesId.innerHTML = startNode + " =>";
    }
    else {
        endNode = toDisplayCoords(endNode);
        totalDistance += distance
        coordinatesId.innerHTML = startNode + " => " + endNode;
        distanceId.innerHTML = "<b>Distance: </b> " + distance + " m";
        totalDistanceId.innerHTML = "<b>Total Distance: </b> " + totalDistance + " m";
    }
}

function toggleElementVisibility(e, visible) {
    if (visible)
        e.style.display = 'block';
    else
        e.style.display = 'none';
}

function infoVisible(visible) {
    var coordinatesId = document.getElementById("coordinates");
    var distanceId = document.getElementById("distance");
    var totalDistanceId = document.getElementById("totalDistance");
    var placeholderId = document.getElementById("placeholder");

    toggleElementVisibility(coordinatesId, visible);
    toggleElementVisibility(distanceId, visible);
    toggleElementVisibility(totalDistanceId, visible);
    toggleElementVisibility(placeholderId, !visible);

    if (!visible) {
        distanceId.innerHTML = "";
        totalDistanceId.innerHTML = "";
        totalDistance = 0;
    }

}