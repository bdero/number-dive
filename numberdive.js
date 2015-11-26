(function() {

  var asymptote = function(dist, divisor, dt) {
    return (1 - 1/(dt/divisor + 1))*dist;
  };


  var Star = function(x, y, radius, rings, visible) {
    createjs.Container.call(this);
    this.x = x;
    this.y = y;
    this.radius = radius;

    if (arguments.length < 5) {
      visible = true;
    }

    var that = this;

    this.center = new createjs.Shape();
    if (visible) {
      this.center.scaleX = Math.random()/2 + 0.5;
      this.center.scaleY = Math.random()/2 + 0.5;
    }
    this.addChild(this.center);

    this.color = "white";
    this.currentColor = null;

    if (visible) {
      createjs.Ticker.addEventListener("tick", function(event) {
        var colliding = _.find(collideStars, function(c) {
          return that.colliding(c);
        });

        var color = _.isUndefined(colliding) ? that.color : "red";

        if (color !== that.currentColor) {
          that.currentColor = color;

          that.center.graphics.clear();
          that.center.graphics
            .beginFill(color)
            .drawCircle(0, 0, that.radius);
        }
      });
    } else {
      this.visible = false;
    }

    _.times(rings, function(n) {
      that.addChild(new Ring(n*4 + 5, Math.pow(n*30, 1.2)));
    });
  };

  Star.prototype = new createjs.Container();

  Star.prototype.colliding = function(other) {
    var ct = this.center.localToGlobal(0, 0);
    var co = other.center.localToGlobal(0, 0);
    return (
      Math.pow((this.radius*rootStar.scaleX + other.radius)*root.scaleX, 2) >
        Math.pow(co.x - ct.x, 2) + Math.pow(co.y - ct.y, 2)
    );
  };


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
        // Set rotation
        that.rotationSpeed = Math.max(
          -that.limit,
          Math.min(
            that.limit,
            that.rotationSpeed + (Math.random() - 0.5)/50
          )
        );
        that.rotation += that.rotationSpeed/20*event.delta;

        // Follow center
        that.x += asymptote(
          that.parent.center.x - that.x,
          radius/5,
          event.delta
        );
        that.y += asymptote(
          that.parent.center.y - that.y,
          radius/5,
          event.delta
        );
      }
    });
  };

  Ring.prototype = new createjs.Container();


  var root;
  var stage;
  var rootStar;

  var mouseStar;
  var collideStars = [];

  var mouseState;
  var mouseEntered = false;


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
    var scaleRatio = (height/768 + width/1024)/2;
    root.scaleX = root.scaleY = scaleRatio;
  };

  var init = function() {
    // Initialize the stage
    stage = new createjs.Stage("cjs-canvas");

    // Create update event loop
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", stage);

    // Create the root container of the scene graph
    root = new createjs.Container();
    stage.addChild(root);

    // Add handler for stage resizing
    $(window).resize(resetStageSize);
    resetStageSize();

    // Set an initial mouse state
    var initialMouseAngle = Math.random()*Math.PI*2;
    mouseState = {
      x: Math.cos(initialMouseAngle)*1000*root.scaleX,
      y: Math.sin(initialMouseAngle)*1000*root.scaleY
    };

    rootStar = new Star(0, 0, 40, 20);
    rootStar.scaleX = rootStar.scaleY = 0.4;
    root.addChild(rootStar);

    stage.on("stagemousemove", function(event) {
      mouseState.x = event.stageX;
      mouseState.y = event.stageY;
      mouseEntered = true;
    });

    mouseStar = new Star(
      mouseState.x/root.scaleX,
      mouseState.y/root.scaleY,
      100, 0, false
    );
    root.addChild(mouseStar);
    collideStars.push(mouseStar);

    createjs.Ticker.addEventListener("tick", function(event) {
      mouseStar.x += asymptote(
        (mouseState.x - root.x)/root.scaleX - mouseStar.x,
        100,
        event.delta
      );
      mouseStar.y += asymptote(
        (mouseState.y - root.y)/root.scaleY - mouseStar.y,
        100,
        event.delta
      );
      if (mouseEntered) {
        rootStar.center.x = -mouseStar.x/rootStar.scaleX/2.5;
        rootStar.center.y = -mouseStar.y/rootStar.scaleY/2.5;
      }
    });
  };

  // Initialize
  init();

})();
