define( [ "underscore"
        , "views/View"
        , "text!views/Selection.html"
        , "views/SelectionItem"
        ],
       
function (_
        , View
        , template
        , SelectionItem
        ) {

    return View.extend({
        template: template,

        initialize: function () {
            this.$games = this.$el.find(".games")
            this.load()
        },

        load: function () {
            var self = this
            $.get("/minefield/games", function (games) {
                for (var i = 0; i < games.length; i++) {
                    self.addItem(games[i])
                }
            })
        },

        addItem: function (model) {
            new SelectionItem(model).$el.appendTo(this.$games)
        }
    })
})
