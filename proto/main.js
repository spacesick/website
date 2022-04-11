// The webGl context
var gl;
// The HTML canvas
var canvas = document.getElementById("gl-canvas");
// The game instance
var game;

// Main update function
var update = () => {
    game.onUpdate();
}

// Main render function
var render = () => {
    game.onRender();
}

/**
 * Main game loop
 */
run = () => {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    update();
    render();
    requestAnimationFrame(run);
}

/**
 * Main function
 * 
 * Prepares the WebGL context and runs the game.
 */
var main = () => {
    gl = canvas.getContext("webgl2");
    if (!gl)
        alert("WebGL 2.0 isn't available");
    
    // Sets final viewport.
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Sets the background color.
    gl.clearColor(0.02, 0.0, 0.03, 1.0);

    // Blend source colors according to its alpha. Enable blending.
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);

    // Instantiate the view.
    var view = new View(canvas.width, canvas.height);

    // Instantiate the game.
    game = new Game(view);

    run();
}

// Call to main
main();