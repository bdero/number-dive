(function() {

  var resetStageSize = function() {
    var canvas = $("#cjs-canvas");
    canvas.attr("width", canvas.width());
    canvas.attr("height", canvas.height());
  };

  var init = function() {
    // Initialize the stage
    var stage = new createjs.Stage("cjs-canvas");

    // Create update event loop
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);

    // Add handler for stage resizing
    $(window).resize(resetStageSize);
    resetStageSize();

    var shape = new createjs.Shape();
    shape.graphics
      .beginFill("lightblue")
      .drawCircle(0, 0, 50);
    stage.addChild(shape);
  };

  // Initialize
  init();

})();
