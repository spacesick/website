// Stored models
var model_player;
var model_asteroid;
var model_projectile;

// Global player score
var score = 0;

// Global game time. Increments by 1 at each frame.
var gameTime = 0;

class Game {
    // The main view
    view;
    // The game world
    world;
    // The player entity
    player;
    // The input handler
    input;

    // Get HTML elements
    scoreElement = document.getElementById("score");
    playerLivesElement = document.getElementById("lives");

    constructor(view) {
        this.initModels(view);
        this.view = view;

        // Make the reset button in the HTML page reset the game.
        document.getElementById("reset").onclick = this.reset;

        this.reset();
    }

    /**
     * Reset the game.
     */
    reset = () => {
        // Instantiates a new world, player entity, and input handler.
        this.world = new World(this.view.width, this.view.height);
        this.player = new PlayerEntity(this.world, model_player, 0.0, 0.0, vec4(0.0, 0.0, 0.0, 1.0));
        this.world.addPlayer(this.player);

        this.input = new InputHandler(this.view, this.player);

        score = 0;

        // Initialize three starting asteroids.
        this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, 0, 300, vec4(1.0, 0.4, 0.4, 1.0), 0.0, -0.6, 1));
        this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, 300, -150, vec4(1.0, 0.4, 0.4, 1.0), -0.6, 0.2, 1));
        this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, -300, -150, vec4(1.0, 0.4, 0.4, 1.0), 0.6, 0.2, 1));

        // this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, 0, 100, vec4(1.0, 0.4, 0.4, 1.0), 0.0, 0.0, 1));
        // this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, 120, 100, vec4(1.0, 0.4, 0.4, 1.0), 0.0, 0.0, 1));
        // this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, -120, 100, vec4(1.0, 0.4, 0.4, 1.0), 0.0, 0.0, 1));
        // this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, 200, 200, vec4(1.0, 0.4, 0.4, 1.0), -1.1, -1.1, 2));
        // this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, -200, -200, vec4(1.0, 0.4, 0.4, 1.0), 1.1, 1.1, 1));
    }

    /**
     * Initialize models. Sends every one to the model VBO.
     */
    initModels = (view) => {
        model_player = new PlayerModel(view);
        model_asteroid = new AsteroidModel(view);
        model_projectile = new ProjectileModel(view);
        view.sendBufferData();
    }

    onUpdate = () => {
        this.world.onUpdate();

        if (!this.player.isRemoved) {
            // Sets the main view offset to be equal to the current player position in the world.
            this.view.setOffset(this.player.pos);

            ++gameTime;
        }
        // Update score and player lives shown to the user.
        this.scoreElement.innerHTML = "Score: " + score;
        if (this.player.lives <= 0)
            this.playerLivesElement.innerHTML = "Game Over!";
        else
            this.playerLivesElement.innerHTML = "Lives: " + this.player.lives;
    }

    onRender = () => {
        this.world.onRender(this.view);
    }
}