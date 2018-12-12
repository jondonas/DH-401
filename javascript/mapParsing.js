var mapFile = "maps/new-york.txt";
var backgroundImage = "images/backgroundMap.jpg";

////////////////////////// Helper Functions //////////////////////////

function nodeDistance(n1, n2) {
    var x1 = n1[0];
    var y1 = n1[1];
    var x2 = n2[0];
    var y2 = n2[1];

    // Return the straight-line distance between two points
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function nameToCoords(name) {
    var coords = name.replace(/^\(|\)$/g, "").split(", ").map(Number);

    return coords;
}

function coordsToName(coords) {
    var name = "(" + coords[0] + ", " + coords[1] + ")";

    return name;
}

function rotateClockwise(coords) {
    return [coords[1], -coords[0]];
}

function matchLine(line) {
    var regEx = /^(.*)\|(.*)$/g;
    var match = regEx.exec(line);
    var left = match[1];
    var right = match[2];

    return [left, right];
}

//////////////////////////// Map Creation ////////////////////////////

var edgesX = [];
var edgesY = [];
var nodesX = [];
var nodesY = [];
var nodeNames = [];
var paths = {};

function getMap() {
    // Read from the map file and initialize graph structures
    $.get({
        url: mapFile,
        async: false,
        success: function(txt) {
            var lines = txt.split("\n");
            var nodesAdded = {};
            var edgesAdded = {};

            for (var i = 0, len = lines.length; i < len; i++) {
                var line = lines[i];

                // Skip the file header and/or empty lines
                if (line.charAt(0) != "(") {
                    continue;
                }

                // Match the line to a regex to extract node data
                var [parentNodeName, numEdges] = matchLine(line);
                var parentNodeCoords = rotateClockwise(nameToCoords(parentNodeName));
                numEdges = parseInt(numEdges);

                if (numEdges > 0) {
                    if (!(parentNodeName in nodesAdded)) {
                        // Dictionary is used for checking-speed, but value is unneeded
                        nodesAdded[parentNodeName] = 0;
                        nodesX.push(parentNodeCoords[0]);
                        nodesY.push(parentNodeCoords[1]);
                        // for displaying lat/long in degrees on mouseover over nodes
                        nodeNames.push(displayCoordsToLatLong(parentNodeName));
                    }
                }

                // Add edges to the graph
                for (var ii = 1; ii <= numEdges; ii++) {
                    var [edgeNodeName, meta] = matchLine(lines[i + ii]);
                    var edgeNodeCoords = rotateClockwise(nameToCoords(edgeNodeName));

                    if (!(edgeNodeName in nodesAdded)) {
                        nodesAdded[edgeNodeName] = 0;
                        nodesX.push(edgeNodeCoords[0]);
                        nodesY.push(edgeNodeCoords[1]);
                        // for displaying lat/long in degrees on mouseover over nodes
                        nodeNames.push(displayCoordsToLatLong(edgeNodeName));
                    }

                    if (!((parentNodeName + edgeNodeName) in edgesAdded) && !((edgeNodeName + parentNodeName) in edgesAdded)) {
                        edgesAdded[parentNodeName + edgeNodeName] = 0;
                        edgesX.push(parentNodeCoords[0], edgeNodeCoords[0], null);
                        edgesY.push(parentNodeCoords[1], edgeNodeCoords[1], null);
                        makePath(paths, coordsToName(parentNodeCoords), coordsToName(edgeNodeCoords), nodeDistance(parentNodeCoords, edgeNodeCoords));
                    }
                }
                i += numEdges;
            }
        }
    });
}

getMap();