define( [ "underscore"
        , "backbone"
        , "text!views/GameViewer.html"
        , "views/GameBoard"
        , "views/Selection"
        ],
       
function (_
        , Backbone
        , template
        , GameBoard
        , Selection
        ) {

    return Backbone.Router.extend({
        template: template,



        routes: {
            "/game/:gameId": "playGame"
        },

        initialize: function ($el) {
            this.$el = $el

            this.game = new GameBoard()
            var selection = new Selection()

            this.$el.append(this.game.$el, selection.$el)

        },

        playGame: function (gameId) {
            
            this.game.playGame(gameId)
        }
    })
})
