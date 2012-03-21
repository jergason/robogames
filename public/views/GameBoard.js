define(["views/View"
       , "text!views/GameBoard.html"
       ],
       
function ( View
         , template
         ) {

    return View.extend({
        template: template,

        initialize: function ($parent) {
            $parent.append(this.$el)

        }
    })
})
