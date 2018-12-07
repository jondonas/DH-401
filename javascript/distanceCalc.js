// Scale factor was precomputed
// We chose identical points on the map and in Google Maps and 
//  found the corresponding scale between the two distances
// This converts from virtual map distance to metres
scaleFactor = 3.216377148
humanWalk = 1.4
horseWalk = 1.9444
horseTrot = 3.6111

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
humanWalkTime = 0;
horseWalkTime = 0;
horseTrotTime = 0;
nodesSoFar = [];

function infoUpdate(startNode, endNode, distance) {
    startNode = toDisplayCoords(startNode);

    if (endNode == null) {
        nodesSoFar.push(startNode);
        document.getElementById("coordinates").innerHTML = "<img class='icon' src='/icons/home.png'/><p class='iconC'>" + startNode + "</p>";
    }
    else {
        endNode = toDisplayCoords(endNode);
        nodesSoFar.push(endNode);
        totalDistance += distance

        coordsString = "";
        for (var i = 0; i < nodesSoFar.length; ++i) {
            if (i == 0) {
                coordsString += "<img class='icon' src='/icons/home.png'/><p class='iconC'>" + nodesSoFar[i] + "</p>"
            }
            else if (i == nodesSoFar.length - 1) {
                coordsString += "<img class='icon' src='/icons/destination.png'/><p class='iconC' style='margin-bottom: 20px;'>" + nodesSoFar[i] + "</p>"
            }
            else {
                coordsString += "<img class='icon' src='/icons/circle-shape-outline.png'/><p class='iconC'>" + nodesSoFar[i] + "</p>"
            }
        }
        document.getElementById("coordinates").innerHTML = coordsString;

        document.getElementById("distance").innerHTML = "<b>Last Distance: </b> " + distance + " m";
        document.getElementById("totalDistance").innerHTML = "<b>Total Distance: </b> " + totalDistance + " m";

        humanWalkTime += getTimeInMinutes(humanWalk, distance);
        horseWalkTime += getTimeInMinutes(horseWalk, distance);
        horseTrotTime += getTimeInMinutes(horseTrot, distance);

        document.getElementById("humanWalk").innerHTML = "<img class='icon' src='/icons/pedestrian-walking.png'/><p class='iconP'>" + humanWalkTime + " minutes</p>";
        document.getElementById("horseWalk").innerHTML = "<img class='icon' src='/icons/horse-slow.png'/><p class='iconP'>" + horseWalkTime + " minutes</p>";
        document.getElementById("horseTrot").innerHTML = "<img class='icon' src='/icons/horse-fast.png'/><p class='iconP'>" + horseTrotTime + " minutes</p>";
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
        humanWalkTime = 0;
        horseWalkTime = 0;
        horseTrotTime = 0;
        nodesSoFar = [];
    }
}