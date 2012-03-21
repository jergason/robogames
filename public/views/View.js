
// all views should extend from this

define(["backbone", "mold"],
function (Backbone, Mold) {
	var dependencies = {}

	return Backbone.View.extend({
		make: function () {
			if (!this.template) console.error("No template found in View")
			this.template = new Mold(this.template)
			return $(this.template.create())
		},

		registerDependency: function (name, dep) {
			dependencies[name] = dep
		},

		getDependency: function (name) {
			return dependencies[name]
		},

		bubble: function (source) {
			var self = this

			function bubble (type) {
		        source.bind(type, function () {
		            Array.prototype.unshift.call(arguments, type)
		            self.trigger.apply(self, arguments)
		        })
		    }

		    for (var i = 1; i < arguments.length; i++) {
		        bubble(arguments[i])
		    }
		},

        destroy: function() {
            this.$el.remove()
        }
	})
})
