define( [ "views/View"
        , "text!views/Cell.html"
       ],
       
function (View
        , template
        ) {
function c(){var f=Math.floor;var r=Math.random;return "rgb(a,a,a)".replace("a",f(r()*255)).replace("a",f(r()*255)).replace("a",f(r()*255))}
    return View.extend({
        template: template,

        initialize: function (model, type) {
            this.model = model
            this.type = type



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
