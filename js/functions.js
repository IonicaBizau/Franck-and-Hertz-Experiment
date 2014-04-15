// simple draggable
var SimpleDraggable = function (selector, options) {

    options.onStart = options.onStart || function () {};
    options.onStop = options.onStop || function () {};
    options.onDrag = options.onDrag || function () {};

    var allElms = document.querySelectorAll (selector);
    for (var i = 0; i < allElms.length; ++i) {
        (function (cEl) {
            // document.body.appendChild(cEl);
            cEl.style.position = "absolute";
            cEl._simpleDraggable = {
               drag: false
            }

            cEl.addEventListener("mousedown", function (e) {
                cEl._simpleDraggable.drag = true;
                cEl._simpleDraggable.mousePos = {
                    x: e.clientX
                  , y: e.clientY
                }
                cEl._simpleDraggable.elPos = {
                    x: cEl.offsetLeft
                  , y: cEl.offsetTop
                }
            });

            cEl.addEventListener("mouseup", function (e) {
                cEl._simpleDraggable.drag = false;
                options.onStart.call(this, e, cEl);
            });

            document.body.addEventListener("mouseout", function (e) {
                cEl._simpleDraggable.drag = false;
                options.onStop.call(this, e, cEl);
            });

            document.body.addEventListener("mousemove", function (e) {
                if (!cEl._simpleDraggable.drag) { return; }

                if (options.onDrag.call(this, e, cEl) === false) {
                    return;
                }

                if (!options.onlyY) {
                    cEl.style.left = (cEl._simpleDraggable.elPos.x + e.clientX - cEl._simpleDraggable.mousePos.x) + "px";
                }
                if (!options.onlyX) {
                    cEl.style.top = (cEl._simpleDraggable.elPos.y + e.clientY - cEl._simpleDraggable.mousePos.y) + "px";
                }

            })
        })(allElms[i])
    }
};

/*
 *  ....
 *
 * */
$(document).ready(function () {

    var expGraph = $.jqplot ('graph', [[[]]], {
        title: 'Graficul Franck-Hertz'
      , axesDefaults: {
            labelRenderer: $.jqplot.CanvasAxisLabelRenderer
        }
      , axes: {
            xaxis: {
                label: "U (V)"
              , min: 0
              , max: 16.5
            }
          , yaxis: {
                label: "I (mA)"
              , min: 0
              , max: 20
            }
        }
    });

    // initial animation
    $(".container").css("opacity", "0").animate({
        opacity: 1
      , top: "50%"
    }, 1000);

    var screenVisible = true;
    $("div.button").on("click", function () {

        var $screen = $(".screen")
          , $docs   = $(".docs")
          ;

        if (screenVisible) {
            $screen.stop(true).fadeOut();
            $docs.stop(true).fadeIn();
            screenVisible = false;
            $(this).text("Experiment");
        } else {
            $screen.stop(true).fadeIn();
            $docs.stop(true).fadeOut();
            screenVisible = true;
            $(this).text("Teoria lucrării");
        }
    });

    var max = 226
      , min = 98
      ;

    $("img").on("dragstart", function () {
        return false;
    });

    SimpleDraggable(".cursor", {
        onlyX: true
      , onDrag: function (e, cEl) {

            var value = (cEl.offsetLeft - min) / 8.6;
            if (value < 0) { value = 0; }
            $(".vol input").val(value.toFixed(2));
            updateResult(value);


            if (cEl.offsetLeft > max) {
                cEl.style.left = (parseInt(cEl.style.left) - 1) + "px";
                return false;
            }

            if (cEl.offsetLeft < min) {
                cEl.style.left = (parseInt(cEl.style.left) + 1) + "px";
                return false;
            }
        }
    });

    /**
     * private: updateResult
     *   This function updates the result when the voltmeter
     *   value is changed.
     *
     *    Arguments
     *      @value: the value of the voltmeter
     *
     */
    function updateResult (value) {
        var x = value
          , y = comptuteValue (value)
          ;
        var seriesObj = expGraph.series[0];
        seriesObj.data.push([x, y]);
        expGraph.drawSeries({},0);

        $(".amp input").val(y);
    }

    function comptuteValue (value) {

        var period = 4.9
          , low = 6
          ;

        function addOrSubstract (x) {

            if (x < low) {
                if (x <= period) {
                    return Math.pow(x, 3/2);
                } else {
                    return Math.pow(period + low - x, 3/2) - x * 1.1;
                }
            }

            return addOrSubstract (x - period);
        }

        return (2 * (Math.floor(value / period + 0.1)) + addOrSubstract(value) * 1.1989).toFixed(2);
    }

    // change handler for voltmeter input
    $(".vol input").on("change", function () {
        var value = Number($(this).val());
        document.querySelector(".cursor").style.left = value * 8.6 + min + "px";
        updateResult(value);
    }).val("0").change();
});
