// Model definition for projectile entities.
class ProjectileModel extends Model {

    generateVertices = () => {
        this.data = [
            7.0, 0.0, 0.4, 0.4, 0.5, 1.0,
            0.0, 2.0, 0.4, 0.4, 0.5, 1.0,
            -5.0, 2.0, 0.4, 0.4, 0.5, 1.0,
            -5.0, -2.0, 0.4, 0.4, 0.5, 1.0,
            0.0, -2.0, 0.4, 0.4, 0.5, 1.0,
        ]

        this.numOfVertices[0] = 5;
    }

    constructor(view) {
        super();
        this.generateVertices();
        this.pushModel(view);
    }
}