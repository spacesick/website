class AsteroidEntity extends Entity {
    // Asteroid entity radiuses for size 0 to 3.
    static radList = [
        12.8,   // For size 0.
        32.0,   // For size 1.
        52.0,   // For size 2.
        76.8    // For size 3.
    ]
    // Asteroid entity values for size 0 to 3.
    static valueList = [
        1000,   // For size 0.
        400,    // For size 1.    
        200,    // For size 2.    
        100     // For size 3.    
    ]
    // Size of this asteroid entity. Ranges from 0 (small) to 3 (larger).
    size;
    // Value of this asteroid entity.
    value;
    // Store the last updated game time.
    lastGameTime = 0;
    // Angular velocity of this asteroid entity.
    angVel;

    constructor(world, model, posX, posY, col, velX, velY, size) {
        super(world, model, posX, posY, col);
        this.size = size;
        this.modelVariant = size;   // Model variant is based on this asteroid entity's size.
        this.vel = vec2(velX, velY);
        this.ang = Math.random() * 10.0;
        this.angVel = Math.random() * 0.04;
        this.radius = AsteroidEntity.radList[size];
        this.value = AsteroidEntity.valueList[size];
    }

    onUpdate = () => {
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];
        this.ang += this.angVel;

        // Render a shrinking stationary particle every couple of frames.
        // Frequency of a new particle is based on this asteroid entity's velocity.
        if (gameTime - this.lastGameTime > 36 / (Math.abs(this.vel[0]) + Math.abs(this.vel[1]) + 0.1)) {
            let particleColor = vec4(Math.random() * 0.4 + 0.6, Math.random() * 0.4 + 0.6, Math.random() * 0.2 + 0.8, 0.6);
            this.world.addParticle(new Particle(this.model, this.modelVariant, this.pos[0], this.pos[1], -this.vel[0] * 0.1, -this.vel[1] * 0.1, this.ang, particleColor, 0.01));
            this.lastGameTime = gameTime;
        }
    }

    /**
     * Splits an asteroid into multiple smaller ones with random velocities.
     */
    split = () => {
        if (this.size != 0) {
            let halfRadius = this.radius * 0.8;

            let randomA = Math.random() * Math.PI * 2;
            let randomX = Math.cos(randomA) * halfRadius;
            let randomY = Math.sin(randomA) * halfRadius;
            let randomVel = (Math.random() * 6.0) - 3.0;
            this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, this.pos[0] + randomX, this.pos[1] + randomY, this.col, this.vel[0] + randomVel, this.vel[1] + randomVel, 0));
            randomA += 0.7;
            randomX = Math.cos(randomA) * halfRadius;
            randomY = Math.sin(randomA) * halfRadius;
            randomVel = (Math.random() * 6.0) - 3.0;
            this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, this.pos[0] + randomX, this.pos[1] + randomY, this.col, this.vel[0] + randomVel, this.vel[1] + randomVel, 0));
            for (let i = 1; i < this.size; ++i) {
                randomA += 1.5;
                randomX = Math.cos(randomA) * halfRadius;
                randomY = Math.sin(randomA) * halfRadius;
                randomVel = (Math.random() * 6.0) - 3.0;     
                this.world.addEntity(new AsteroidEntity(this.world, model_asteroid, this.pos[0] + randomX, this.pos[1] + randomY, this.col, this.vel[0] + randomVel, this.vel[1] + randomVel, i));
            }
        }
        this.remove();
    }

    remove = () => {
        this.isRemoved = true;
        let particleColor = vec4(Math.random() * 0.4 + 0.6, Math.random() * 0.4 + 0.6, Math.random() * 0.2 + 0.8, 0.6);
            this.world.addParticle(new Particle(this.model, this.modelVariant, this.pos[0], this.pos[1], -this.vel[0] * 0.1, -this.vel[1] * 0.1, this.ang, particleColor, 0.16));
    }
}