// Model definition for a player entity.
class PlayerModel extends Model {

    generateVertices = () => {
        this.data = [
            19.2, 0.0, 0.8, 1.0, 0.8, 0.0,
            -12.8, 12.8, 0.6, 0.8, 0.6, 0.0,
            -12.8, -12.8, 0.6, 0.8, 0.6, 0.0,
        ]

        this.numOfVertices[0] = 3;
    }

    constructor(view) {
        super();
        this.generateVertices();
        this.pushModel(view);
    }
}