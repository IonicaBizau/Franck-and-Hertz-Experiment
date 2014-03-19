/*
 *  ....
 *
 * */
$(document).ready(function () {

    // initial animation
    $(".container").css("opacity", "0").animate({
        opacity: 1
      , top: "50%"
    }, 1000);

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
    }

    // change handler for voltmeter input
    $(".vol input[type='number']").on("change", function () }
        updateResult($(this).val()) 
    });
});
