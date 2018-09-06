var OSName = "Unknown OS";
if (navigator.appVersion.indexOf("Win") != -1) OSName = "Windows";
if (navigator.appVersion.indexOf("Mac") != -1) OSName = "MacOS";
if (navigator.appVersion.indexOf("X11") != -1) OSName = "UNIX";
if (navigator.appVersion.indexOf("Linux") != -1) OSName = "Linux";
function cwo(a, b, o) {
    return (a - o) < b && b < (a + o);
}
(function () {
    var ev = new $.Event('style'),
        orig = $.fn.css;
    $.fn.css = function () {
        $(this).trigger(ev);
        return orig.apply(this, arguments);
    }
})();
window.onload = function () {
    AOS.init();
    var equipment_sketch = new p5(equipment_game);
    var background_sketch = new p5(background_game);
    let cookies = document.cookie;
    if (cookies) document.getElementById("menuBar").scrollIntoView();
    document.cookie = "at=1; expires=Thu, 18 Dec 2019 12:00:00 UTC";
    let desc_flop = false;
    let desc_pos = getCoords(document.getElementById('intro_desc_text')).top;
    var scrolling = false;
    let height_check = $(window).scrollTop();
    if (height_check > 100)
        $('#down_symbol_start').css('display', 'none');
    $(window).scroll(function () {
        scrolling = true;
    });
    if ($("#backgroundSketch").css("display") == "none") {
        background_sketch.noLoop();
    } else {
        background_sketch.loop();
    }
    // $(window).resize(function () {
    //     $("#log").append("<div>Handler for .resize() called.</div>");
    // });
    //background_sketch.noLoop();
    setInterval(function () {
        if (scrolling) {
            scrolling = false;
            let height = $(window).scrollTop();
            let intro_bike_pos = document.getElementById('intro_bike').getBoundingClientRect().top;
            // base 0.65
            let offset = 0.35;
            let gap = 500;
            if (intro_bike_pos > -gap && intro_bike_pos < gap)
                $('#intro_bike').css('opacity', 0.65 + (offset - offset * ((intro_bike_pos < 0 ? (intro_bike_pos * -1) : (intro_bike_pos)) / gap)));
            if (height < 100) {
                $('#down_symbol_start').css('display', 'block');
                $('#down_symbol_start').css('opacity', 1 - height / 100);
                $('#start_text_fadeout').css('opacity', 1 - height / 100);

            } else {
                $('#start_text_fadeout').css('opacity', 0);
                $('#down_symbol_start').css('display', 'none');
            }
            if ($("#backgroundSketch").css("display") == "none") {
                background_sketch.noLoop();
            } else {
                background_sketch.loop();
            }
            // if (height >= desc_pos && !desc_flop) {
            //     window.scrollTo(0, desc_pos);
            //     $('body').addClass('stop-scrolling');
            // }
            // if (height < desc_pos - 30) desc_flop = false;
            if ($('#d_intro_0')[0].getBoundingClientRect().top < $(window).height()
                && $('#d_intro_7')[0].getBoundingClientRect().top > 0) {
                let height_mid = $(window).height() / 2;
                let arr_o_triggers = {
                    "question": $('#d_intro_0')[0].getBoundingClientRect().top,
                    "frog": $('#d_intro_1')[0].getBoundingClientRect().top,
                    "bed": $('#d_intro_2')[0].getBoundingClientRect().top,
                    "shuttle-van": $('#d_intro_3')[0].getBoundingClientRect().top,
                    "wrench": $('#d_intro_4')[0].getBoundingClientRect().top,
                    "bicycle": $('#d_intro_45')[0].getBoundingClientRect().top,
                    "surprise": $('#d_intro_5')[0].getBoundingClientRect().top,
                    "hand-peace": $('#d_intro_6')[0].getBoundingClientRect().top,
                    "grin-tongue-wink": $('#d_intro_7')[0].getBoundingClientRect().top
                };
                for (let el in arr_o_triggers) {
                    if (cwo(arr_o_triggers[el], height_mid, 0.05)) {
                        $("#diary_intro_story_box_icon")[0].className = "fa fa-" + el;
                        if (el == "shuttle-van") {
                            //special case
                            $('#d_intro_left').html("Vilnius<br />Lithuania");
                            $('#d_intro_right').html("Boston<br />United Kingdom");
                        } else {
                            $('#d_intro_left').html("");
                            $('#d_intro_right').html("");
                        }
                        if (el == "wrench") {
                            //special case
                            $('#d_intro_left').html("Klijavau lipdukus vieną mėnesį.<br> Vieną dieną rinkau gėles.");
                            $('#d_intro_right').html("Vieną dieną rušiavimo savartyne.<br>Vieną mėnesį viriau padažus tonomis.");
                        } else {
                            $('#d_intro_left').html("");
                            $('#d_intro_right').html("");
                        }
                        break;
                    }
                };
            }
        }

    }, 250);
    // $("#intro_desc_text").bind('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
    //     desc_flop = true;
    //     $('body').removeClass('stop-scrolling');
    // });
    // $('#intro_desc_text').one("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
    //     function (event) {

    //     });

    $('a[href*="#"]')
        // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function (event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function () {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex', '-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });
};
function getCoords(elem) { // crossbrowser version
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docEl = document.documentElement;

    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;

    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;

    var top = box.top + scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}





var equipment_game = function (sketch) {
    var canvas;
    let parent = $("#equipment_canvas");
    sketch.windowResized = function () {
        //570
        let size_x = parent.width() * (10 / 7)
        sketch.resizeCanvas(parent.width(), size_x * (3 / 10));

    }
    var backpack_img;
    var bag_img;
    var bike_img;
    var camp_img;
    let main_h;
    sketch.windowResized = function () {
        main_h = parent.height();
        sketch.resizeCanvas(parent.width(), parent.height());

    }
    sketch.setup = function () {

        let size_x = parent.width() * (10 / 7)
        canvas = sketch.createCanvas(parent.width(), size_x * (3 / 10));
        main_h = parent.height();
        canvas.parent("equipment_canvas");

        sketch.background(102, 85, 85);
        backpack_img = sketch.loadImage("../img/backpack_part.png");
        bag_img = sketch.loadImage("../img/bag_part.png");
        bike_img = sketch.loadImage("../img/bike_part.png");
        camp_img = sketch.loadImage("../img/outside_part.png");


    }
    let defined_backpack = [
        [0.43,0.47],
        [0.52,0.48],
        [0.59,0.90],
        [0.40,0.90]
    ];
    let defined_camp = [
        [0.63, 0.14],
        [0.71, 0.17],
        [0.75, 0.37],
        [0.58, 0.33]
    ];
    let defined_bag = [
        [0.61, 0.36],
        [0.71, 0.38],
        [0.71, 0.54],
        [0.61, 0.50]
    ];
    let defined_bike = [
        [0.35, 0.09],
        [0.56, 0.17],
        [0.58, 0.47],
        [0.34, 0.43]
    ];
    let backpack_flop = false;
    let camp_flop = false;
    let bag_flop = false;
    let bike_flop = false;
    sketch.mouseMoved = function () {
        if(sketch.mouseX > 0 &&sketch.mouseX < parent.width() 
        && sketch.mouseY > 0 && sketch.mouseY < parent.height())
        {

             console.log(sketch.mouseX / parent.width(), sketch.mouseY / parent.height());
            backpack_flop = inside([sketch.mouseX / parent.width(), sketch.mouseY / parent.height()],defined_backpack);
            camp_flop = inside([sketch.mouseX / parent.width(), sketch.mouseY / parent.height()],defined_camp)
            bag_flop = inside([sketch.mouseX / parent.width(), sketch.mouseY / parent.height()],defined_bag)
            bike_flop = inside([sketch.mouseX / parent.width(), sketch.mouseY / parent.height()],defined_bike)
            // if(backpack_flop || camp_flop || bag_flop) bike_flop = false;
            // else bike_flop = true;
        }    
    }
    sketch.draw = function () {
        sketch.background(163, 48, 37);
        //1280
        //960
        //
        let p = parent.height() / 960;
        let offset = (parent.width() - 1280 * p) / 2;
        sketch.noStroke();
        sketch.push();
        if(bike_flop){
            sketch.scale(1.5,1.5);
            sketch.translate((-parent.width() *.58 * 0.5) / 2,(-parent.height()*.79 * 0.5)/2);
        }
        sketch.image(bike_img, offset, 0, 1280 * p, main_h);
        sketch.pop();
        sketch.push();
        if(backpack_flop){
            sketch.scale(1.5,1.5);
            sketch.translate((-parent.width() *.58 * 0.5) / 2,(-parent.height()*.79 * 0.5)/2);
        }
        sketch.image(backpack_img, offset, 0, 1280 * p, main_h);
        sketch.pop();
        sketch.push();
        if(camp_flop){
            sketch.scale(1.5,1.5);
            sketch.translate((-parent.width() *.58 * 0.5) / 2,(-parent.height()*.79 * 0.5)/2);
        }
        sketch.image(camp_img, offset, 0, 1280 * p, main_h);
        sketch.pop();
        sketch.push();
        if(bag_flop){
            sketch.scale(1.5,1.5);
            sketch.translate((-parent.width() *.58 * 0.5) / 2,(-parent.height()*.79 * 0.5)/2);
        }
        sketch.image(bag_img, offset, 0, 1280 * p, main_h);
        sketch.pop();



    }
};

function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};