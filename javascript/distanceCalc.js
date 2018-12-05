// Scale factor was precomputed
// We chose identical points on the map and in Google Maps and 
//  found the corresponding scale between the two distances
// This converts from virtual map distance to metres
scaleFactor = 3.216377148
horseWalk = 1.9444
horseTrot = 3.6111
humanWalk = 1.4

function getTimeInMinutes(speed, distance) {
    var time = distance / speed / 60;
    return time < 1 ? 1 : Math.ceil(time);
}

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
    startNode = toDisplayCoords(startNode);

    if (endNode == null) {
        document.getElementById("coordinates").innerHTML = startNode + " =>";
    }
    else {
        endNode = toDisplayCoords(endNode);
        totalDistance += distance
        document.getElementById("coordinates").innerHTML = startNode + " => " + endNode;
        document.getElementById("distance").innerHTML = "<b>Distance: </b> " + distance + " m";
        document.getElementById("totalDistance").innerHTML = "<b>Total Distance: </b> " + totalDistance + " m";

        document.getElementById("humanWalk").innerHTML = "<img class='icon' src='/icons/pedestrian-walking.png'/><p class='iconP'>" + getTimeInMinutes(humanWalk, distance) + " minutes</p>";
        document.getElementById("horseWalk").innerHTML = "<img class='icon' src='/icons/horse-slow.png'/><p class='iconP'>" + getTimeInMinutes(horseWalk, distance) + " minutes</p>";
        document.getElementById("horseTrot").innerHTML = "<img class='icon' src='/icons/horse-fast.png'/><p class='iconP'>" + getTimeInMinutes(horseTrot, distance) + " minutes</p>";

        //document.getElementById("humanWalk").innerHTML = "<b>Walking Duration: </b> " + getTimeInMinutes(humanWalk, distance) + " min";
        //document.getElementById("horseWalk").innerHTML = "<b>Horse Walk Duration: </b> " + getTimeInMinutes(horseWalk, distance) + " min";
        //document.getElementById("horseTrot").innerHTML = "<b>Horse Trot Duration: </b> " + getTimeInMinutes(horseTrot, distance) + " min";
    }
}

function toggleElementVisibility(e, visible) {
    if (visible)
        e.style.display = 'block';
    else
        e.style.display = 'none';
}

function infoVisible(visible) {
    var infoTextIds = document.getElementsByClassName("infoText");
    var placeholderId = document.getElementById("placeholder");

    for (var i = 0; i < infoTextIds.length; ++i) {
        toggleElementVisibility(infoTextIds[i], visible);
    }

    toggleElementVisibility(placeholderId, !visible);

    if (!visible) {
        for (var i = 0; i < infoTextIds.length; ++i) {
            infoTextIds[i].innerHTML = "";
        }

        totalDistance = 0;
    }
}