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
        $(".amp input").val(comptuteValue(value));
    }

    function comptuteValue (value) {

        function addOrSubstract (x) {

            var period = 4.9;

            if (x < 5.1) {
                if (x <= period) {
                    return Math.pow(x, 3/2);
                } else {
                    return Math.pow(period - 5.1 + x, 3/2);
                }
            }

            return addOrSubstract (x - period);
        }

        return (2 * (Math.floor(value / 4.9)) + addOrSubstract(value) * 1.1989).toFixed(2);
    }


    // change handler for voltmeter input
    $(".vol input[type='number']").on("change", function () {
        updateResult(Number($(this).val()));
    });
});
