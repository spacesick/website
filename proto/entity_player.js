class PlayerEntity extends Entity {
    // Maximum velocity for each velocity component (x and y) for the player entity.
    maxVel;
    // Current number of lives of the player.
    lives;
    // Store the last updated sum of x-position and y-position.
    lastPositionSum = 0.1;

    constructor(world, model, posX, posY, col) {
        super(world, model, posX, posY, col);
        this.modelVariant = 0;
        this.maxVel = 10.0;
        this.lives = 5;
    }

    onUpdate = () => {
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];

        if (this.col[0] > 0.0)
            this.col[0] -= 0.04;

        // Render a shrinking stationary particle every couple of frames.
        // Frequency of a new particle is based on the player entity's velocity.
        let positionSum = Math.abs(this.pos[0]) + Math.abs(this.pos[1]);
        if (Math.abs(positionSum - this.lastPositionSum) > 32) {
            let particleColor = vec4(Math.random() * 0.3 - 0.3, -0.5, Math.random() * 0.2 - 0.6, 0.5);
            this.world.addParticle(new Particle(this.model, this.modelVariant, this.pos[0], this.pos[1], -this.vel[0] * 0.1, -this.vel[1] * 0.1, this.ang, particleColor, 0.01));
            this.lastPositionSum = positionSum;
        }
    }

    // Adds velocity to the player entity up to the maximum velocity.
    addVelocity = (x, y) => {
        let newVelX = this.vel[0] + x;
        let newVelY = this.vel[1] + y;

        if (newVelX > this.maxVel)
            this.vel[0] = this.maxVel;
        else if (newVelX < -this.maxVel)
            this.vel[0] = -this.maxVel;
        else this.vel[0] = newVelX;

        if (newVelY > this.maxVel)
            this.vel[1] = this.maxVel;
        else if (newVelY < -this.maxVel)
            this.vel[1] = -this.maxVel;
        else this.vel[1] = newVelY;
    }

    shootProjectile = (velX, velY) => {
        let p = new ProjectileEntity(this.world, model_projectile, this.pos[0] + 4.0 * velX, this.pos[1] + 4.0 * velY, vec4(0.5, 0.5, 0.5, 1.0), velX, velY, this.ang);
        this.world.addEntity(p);
    }

    remove = () => {
        if (--this.lives == 0) {
            this.isRemoved = true;
            score += gameTime;
        }
        this.col[0] = 1.0;
    }
}