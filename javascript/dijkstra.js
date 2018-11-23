//////////////////////// Dijkstra's Algorithm ////////////////////////

// Modified from: http://jsfiddle.net/toadskipper/rPhc4/
function Dijkstra(paths, source, dest) {
    var inf = Number.POSITIVE_INFINITY;
    var distance = {};
    var done = {};
    var pred = {};
    for (var i in paths) {
        distance[i] = inf;
        pred[i] = 0;
        done[i] = false;
    }

    distance[source] = 0;

    for (i in paths) {
        var minDist = inf,
            closest;
        for (var j in paths) {
            if (!done[j]) {
                if (distance[j] <= minDist) {
                    minDist = distance[j];
                    closest = j;
                }
            }
        }
        done[closest] = true;
        if (closest === dest) {
            break;
        }

        var neighbors = pathsFrom(paths, closest);
        for (var nb in neighbors) {
            var w = neighbors[nb];
            if (!done[nb]) {
                if (distance[closest] + w < distance[nb]) {
                    distance[nb] = distance[closest] + w;
                    pred[nb] = closest;
                }
            }
        }
    }

    i = dest;
    if (distance[i] < inf) {
        var thePath = [i];
        var node = i;
        while (node !== source) {
            node = pred[node];
            thePath.unshift(node);
        }

        return thePath;
    } else {
        return null;
    }
}

function makePath(paths, from, to, distance) {
    function addPath(from, to) {
        if (!(from in paths)) {
            paths[from] = {};
        }
        paths[from][to] = distance;
    }
    addPath(from, to);
    addPath(to, from);
}

function pathsFrom(paths, node) {
    var found = paths[node];
    if (found === undefined) {
        console.log("No node named '" + node + "' found.");
    } else {
        return found;
    }
}