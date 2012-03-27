
// bind shim
if (!Function.prototype.bind) {
  Function.prototype.bind = function (oThis) {
    if (typeof this !== "function") {
      // closest thing possible to the ECMAScript 5 internal IsCallable function
      throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
    }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP
                                 ? this
                                 : oThis || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}




// set up some paths for require
require.config({
    baseUrl: "/",
    paths: {
        backbone: "js/lib/backbone",
        text: "js/lib/requirejs/text",
        order: "js/lib/requirejs/order",
        jquery: "js/lib/jquery.custom",
        underscore: "js/lib/underscore.custom",
        datejs: "js/lib/date",
        moment: "js/lib/moment.min",
        modernizr: "js/lib/modernizr",
        color: "js/lib/color",
        SimpleHtmlParser: "js/lib/mold/simplehtmlparser",
        mold: "js/lib/mold/mold"
    }
})

require(["jquery", "modernizr", "backbone", "views/GameViewer"],
    function ($, modernizr, Backbone, GameViewer) {
        new GameViewer($("#mainContent"))
        Backbone.history.start()
    }
)
