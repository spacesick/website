class Particle {
    // The model this particle uses.
    model;
    // The variant of the model above.
    modelVariant;

    // Position vector of this particle.
    pos;
    // Velocity vector of this particle.
    vel;
    // Rotational angle of this particle.
    ang;

    // The color of this particle.
    col;

    // This particle's scale.
    scale;

    // Lifespan of this particle.
    life = 1.0;
    // Whether this particle is removed or not.
    isRemoved = false;
    // The rate of which the scale of the model is reduced.
    scaleRate;

    constructor(model, modelVariant, posX, posY, velX, velY, ang, col, scaleRate) {
        this.model = model;
        this.modelVariant = modelVariant;
        this.pos = vec2(posX, posY);
        this.vel = vec2(velX, velY);
        this.ang = ang;
        this.scale = 0.9;
        this.col = col;
        this.scaleRate = scaleRate;
    }

    onUpdate = () => {
        // Reduce the lifespan, scale, and color alpha of this particle.
        this.life -= 0.01;
        this.scale -= this.scaleRate;
        this.col[3] -= 0.01;

        // Remove this particle if its life is less than zero.
        if (this.life < 0.0) {
            this.isRemoved = true;
        }

        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];
    }

    onRender = (view) => {
        view.pushToRenderStack(this.pos, this.col, this.ang, this.model.bufferIndex[this.modelVariant], this.model.numOfVertices[this.modelVariant], this.scale);
    }
}