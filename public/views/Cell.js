define( [ "views/View"
        , "text!views/Cell.html"
       ],
       
function (View
        , template
        ) {

    return View.extend({
        template: template,

        initialize: function (model, type) {
            this.model = model
            this.type = type

            this.$el.addClass(type)



            this.render()
        },

        render: function () {
            if (!this.scale) return
            this.$el.css({
                left: (this.model.x * this.scale) + "px",
                top: this.model.y * this.scale,
                width: this.scale,
                height: this.scale
            })
        },

        updateModel: function (model) {
            this.model = model
            this.render()
        },

        getX: function () {
            return this.x
        },

        getY: function () {
            return this.y
        },

        setScale: function (scale) {
            this.scale = scale
            this.render()
        }
    })
})
