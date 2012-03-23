define( [ "underscore"
        , "views/View"
        , "text!views/GameBoard.html"
        , "views/Cell"
       ],
       
function (_
        , View
        , template
        , CellView
        ) {

    return View.extend({
        template: template,

        initialize: function (model) {
            this.model = model

            this.cells = []
            this.cellsByCoordnate = []

            this.aspect = 480 / 640

            $(window).resize(_.bind(this.resize, this))

            // this.generateCells()

            this.currentTurn = 0
            this.entitiesById = {}
            
        },

        render: function () {
            var turn = this.model.turns[this.currentTurn]

            for (var i = 0; i < turn.mines.length; i++) {
                this.renderEntity("mine", turn.mines[i])
            }
        },

        renderEntity: function (type, entityModel) {
            if (!this.entitiesById[entityModel.id]) {
                this.addEntity(type, entityModel)
            }
            else {
                var entity = this.entitiesById[entityModel.id]
                entity.updateModel(entityModel)
            }
        },

        addEntity: function (type, entityModel) {
            var entity = new CellView(entityModel, type)
            this.$el.append(entity.$el)

            entity.setScale(this.scale)

            this.entitiesById[entityModel.id] = entity
            this.cells.push(entity)
        },

        generateCells: function () {
            for (var x = 0; x < this.model.width; x++) {
                for (var y = 0; y < this.model.height; y++) {
                    this.addCellView(new CellView({
                        x: x,
                        y: y
                    }))
                }
            }
        },

        updateCellScales: function () {
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i].setScale(this.scale)
            }
        },

        addCellView: function (cellView) {
            var x = cellView.getX()
            var y = cellView.getY()
            
            if (!this.cellsByCoordnate[x]) this.cellsByCoordnate[x] = []
            this.cellsByCoordnate[x][y] = cellView
            this.cells.push(cellView)

            this.$el.append(cellView.$el)
        },

        resize: function () {
            this.calculateScale()
            this.updateCellScales()
            this.render()
        },

        calculateScale: function () {
            var width = this.$el.width()
            var height = this.$el.height()

            this.scale = Math.floor(width / this.model.width)
        },

        play: function () {
            if (this.interval) return
            this.interval = setInterval(_.bind(this.tick, this), 2000)
        },

        stop: function () {
            clearInterval(this.interval)
            this.interval = null
        },

        tick: function () {
            if (this.model.turns[this.currentTurn + 1]) {
                this.currentTurn++
                this.render()
            }
            else {
                this.stop()
            }
        }
    })
})
