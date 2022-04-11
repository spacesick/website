class ProjectileEntity extends Entity {
    constructor(world, model, posX, posY, col, velX, velY, ang) {
        super(world, model, posX, posY, col);
        this.vel = vec2(velX, velY);
        this.ang = ang;
        this.radius = 28.0;
    }

    onUpdate = () => {
        this.pos[0] += this.vel[0];
        this.pos[1] += this.vel[1];
    }
}