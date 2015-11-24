(function() {

  var Star = function() {
    createjs.Shape.call(this);

    this.graphics
      .beginFill("white")
      .drawCircle(0, 0, 50);
  }

  Star.prototype = new createjs.Shape();


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

    root.addChild(new Star());
  };

  // Initialize
  init();

})();
