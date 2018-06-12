var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
};

function rotate_point(cx, cy, x, y, angle) {
    var
        cos = Math.cos(angle),
        sin = Math.sin(angle),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
        ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return {
        x: nx,
        y: ny
    };
}

function compare(a, b) {
    let comparison = 0;
    if (a.baryOrder > b.baryOrder) {
        comparison = 1;
    } else if (a.baryOrder < b.baryOrder) {
        comparison = -1;
    }
    return comparison;
}

function inside(point, vs, offset) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    let x = point.x,
        y = point.y;

    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        let xi = vs[i].p.x + offset.x,
            yi = vs[i].p.y + offset.y;
        let xj = vs[j].p.x + offset.x,
            yj = vs[j].p.y + offset.y;

        let intersect = ((yi > y) != (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

function lcm(p, q) {
    return (p - 1) * (q - 1);

}

function gcd(a, b) {
    if (!b) {
        return a;
    }
    return gcd(b, a % b);
};

function modInverse(a, b) {
    a %= b;
    for (var x = 1; x < b; x++) {
        if ((a * x) % b == 1) {
            return x;
        }
    }
}

function array_move(arr, old_index, new_index) {
    while (old_index < 0) {
        old_index += arr.length;
    }
    while (new_index < 0) {
        new_index += arr.length;
    }
    if (new_index >= arr.length) {
        let k = new_index - arr.length + 1;
        while (k--) {
            arr.push(undefined);
        }
    }
    arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
    //return arr; 
    // for testing purposes
};