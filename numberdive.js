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
      that.addChild(new Ring(n*4 + 5, Math.pow(n*100, 1.01)));
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
      that.addChild(new Star(x, y, 30 + radius/100, 0));
    });

    this.rotationSpeed = Math.random()*4 - 2;
    this.limit = 1 - radius/1000;

    createjs.Ticker.addEventListener("tick", function(event) {
      if (!event.paused) {
        that.rotation += that.rotationSpeed;
        that.rotationSpeed = Math.max(
          -that.limit,
          Math.min(
            that.limit,
            that.rotationSpeed + (Math.random() - 0.5)/50
          )
        );
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
    scaleRatio = (height/768 + width/1024)/2;
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

    var star = new Star(0, 0, 40, 20);
    star.scaleX = star.scaleY = 0.4;
    root.addChild(star);
  };

  // Initialize
  init();

})();
