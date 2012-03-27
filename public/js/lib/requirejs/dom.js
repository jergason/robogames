// This is for loading our templates.  It is exactly like the text plugin except it converts the returned text into dom elements

define(["underscore", "./js/lib/requirejs/text.js"], function (_, Text) {
	
	var dom = Text
	var textFinishLoad = dom.finishLoad

	// override the finishLoad method
	dom.finishLoad = function (name, strip, content, onLoad, config) {
		// turn the text into dom elements
		var domObj = $(content.replace(/\n/g, ""))
		textFinishLoad(name, strip, domObj, onLoad, config)
	}

	return dom
})