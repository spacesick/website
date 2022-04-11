class Entity {
    // The world this entity lives in.
    world;
    // The model this entity uses.
    model;
    // The variant of the model above.
    modelVariant = 0;
    // Whether this entity is removed or not.
    isRemoved = false;

    // Position vector of this entity.
    pos = vec2(0.0, 0.0);
    // Velocity vector of this entity.
    vel = vec2(0.0, 0.0);
    // Rotational angle of this entity.
    ang = 4.7;
    // The bounding radius of this entity.
    radius = 16.0;

    // The color of this entity.
    col = vec4(1.0, 0.0, 1.0, 1.0);

    constructor(world, model, posX, posY, col) {
        this.world = world;
        this.model = model;
        this.pos = vec2(posX, posY);
        this.col = col;
    }

    // Remove this entity.
    remove = () => {
        this.isRemoved = true;
    }

    // MUST BE IMPLEMENTED BY INHERITING CLASSES
    onUpdate = () => {
        return;
    }

    onRender = (view) => {
        view.pushToRenderStack(this.pos, this.col, this.ang, this.model.bufferIndex[this.modelVariant], this.model.numOfVertices[this.modelVariant]);
    }

    // Checks whether this entity collides another specified one.
    // Both must collide if the sum of both entities' bounding radiuses
    // is larger than the distance between both entities' center positions.
    collides = (entity) => {
        let dx = Math.abs(this.pos[0] - entity.pos[0]);
        let dy = Math.abs(this.pos[1] - entity.pos[1]);
        let r = this.radius + entity.radius;
        return (dx * dx + dy * dy - 2.0 < r * r);
    }
}