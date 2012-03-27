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
                var game, player, players = {}

                for (var i = 0; i < games.length; i++) {
                    game = games[i]
                    player = game.player.username
                    if (!player) continue

                    if (!players[player]) players[player] = []
                    players[player].push(game)
                }

                self.addItems(players)
            })
        },

        countWins: function (player) {
            return player.filter(function (m) {
                return m.state.mode === "won"
            }).length
        },

        sortPlayers: function (a, b) {
            var aWins = this.countWins(a)
            var bWins = this.countWins(b)

            if (aWins < bWins) return 1
            if (aWins > bWins) return -1
            return 0
        },

        addItems: function (players) {
            var self = this
            var playerGames, game

            // convert to array
            players = Object.keys(players).map(function (playerName) {
                return players[playerName]
            }).sort(this.sortPlayers.bind(this))

            players.forEach(function (playerGames) {
                new SelectionItem("player", playerGames).$el.appendTo(self.$games)
                for (var i = 0; i < playerGames.length; i++) {
                    game = playerGames[i]
                    new SelectionItem("game", game).$el.appendTo(self.$games)
                }
            })
        }
    })
})
