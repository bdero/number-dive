(function() {

  var Star = function(x, y, radius, rings) {
    createjs.Container.call(this);
    this.x = x;
    this.y = y;

    var circle = new createjs.Shape();
    circle.graphics
      .beginFill("white")
      .drawCircle(0, 0, radius);
      this.addChild(circle);

    var that = this;
    _.times(rings, function(n) {
      that.addChild(new Ring(n*4 + 5, n*100));
    });
  };

  Star.prototype = new createjs.Container();


  var Ring = function(stars, radius) {
    createjs.Container.call(this);

    var that = this;
    _.times(stars, function(n) {
      var angle = 2*Math.PI*n/stars;
      var x = Math.cos(angle)*radius;
      var y = Math.sin(angle)*radius;
      that.addChild(new Star(x, y, 50, 0));
    });

    this.rotationSpeed = Math.random()*4 - 2;

    createjs.Ticker.addEventListener("tick", function(event) {
      if (!event.paused) {
        that.rotation += that.rotationSpeed;
      }
    });
  };

  Ring.prototype = new createjs.Container();


  var root;

  var resetStageSize = function() {
    var canvas = $("#cjs-canvas");
    var width = canvas.width();
    var height = canvas.height();
    canvas.attr("width", width);
    canvas.attr("height", height);

    // Center the root container
    root.x = width/2;
    root.y = height/2;

    // Scale the root container according to height
    scaleRatio = height/768;
    root.scaleX = root.scaleY = scaleRatio;
  };

  var init = function() {
    // Initialize the stage
    var stage = new createjs.Stage("cjs-canvas");

    // Create update event loop
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);

    // Create the root container of the scene graph
    root = new createjs.Container();
    stage.addChild(root);

    // Add handler for stage resizing
    $(window).resize(resetStageSize);
    resetStageSize();
    root.addChild(new Star(0, 0, 50, 10));
  };

  // Initialize
  init();

})();
