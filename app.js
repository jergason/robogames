(function() {
  var PORT, app, express;

  PORT = process.env.PORT || 2663;

  express = require('express');

  exports.createServer = function() {
    var app;
    app = express.createServer();
    app.use(express.bodyParser());
    app.get("/", function(req, res) {
      return res.send("HI");
    });
    return app;
  };

  if (module === require.main) {
    app = exports.createServer();
    console.log("Started on " + PORT);
    app.listen(PORT);
  }

}).call(this);
