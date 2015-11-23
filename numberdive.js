(function() {

  var root;

  var resetStageSize = function() {
    var canvas = $("#cjs-canvas");
    var width = canvas.width();
    var height = canvas.height();
    canvas.attr("width", width);
    canvas.attr("height", height);

    root.x = width/2;
    root.y = height/2;
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

    var shape = new createjs.Shape();
    shape.graphics
      .beginFill("lightblue")
      .drawCircle(0, 0, 50);
    root.addChild(shape);
  };

  // Initialize
  init();

})();
