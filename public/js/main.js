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

require(["jquery", "modernizr", "backbone", "views/GameBoard"],
    function ($, modernizr, Backbone, GameBoard) {
        var game = new GameBoard($("#mainContent"))
    }
)
