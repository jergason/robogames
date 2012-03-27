define( [ "underscore"
        , "views/View"
        , "text!views/SelectionItem.html"
        ],
       
function (_
        , View
        , template
        ) {

    return View.extend({
        template: template,

        initialize: function (type, model) {
            console.log(type, model)
            this.type = type
            this.model = model

            this.$link = this.$el.find(".link")

            this.$el.addClass(type)

            this.render()
        },

        render: function () {
            if (this.type === "game") {
                this.$link.attr("href", "#/game/" + this.model.gameId)
                this.$link.text(this.model.level)
            }
            else {
                if (!(this.model instanceof Array)) return
                var wins = this.model.filter(function (m) {
                    return m.state.mode === "won"
                })
                this.$link.text(this.model[0].player.username + " - won " + wins.length)
            }
        }
    })
})
