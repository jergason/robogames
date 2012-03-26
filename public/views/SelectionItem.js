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

        initialize: function (model) {
            this.model = model
            this.$level = this.$el.find(".level")
            this.$link = this.$el.find(".link")
            this.$user = this.$el.find(".user")
            this.render()
        },

        render: function () {
            this.$level.text(this.model.level)
            this.$link.attr("href", "#/game/" + this.model.gameId)
            if (this.model.player && this.model.player.username) {
                this.$user.text(this.model.player.username)
            }
        }
    })
})
