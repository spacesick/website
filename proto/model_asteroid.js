// Model definition for asteroid entities.
// Defines 4 variants: small [0], medium [1], large [2], larger [3].
class AsteroidModel extends Model {

    /**
     * Adds a set of vertices that define a n-polygon outline with the specified radius.
     */
    generateLinePolygon = (radius, n) => {
        for (let i = 0; i < n; ++i) {
            let a = (i / n) * 2 * Math.PI;
            this.data.push(Math.sin(a) * radius, Math.cos(a) * radius, 0.0, 0.0, 0.0, 0.0);
        }
    }

    generateVertices = () => {
        // Small asteroid
        this.generateLinePolygon(12.8, 5);
        this.numOfVertices[0] = 5;

        // Medium asteroid
        this.generateLinePolygon(32.0, 7);
        this.numOfVertices[1] = 7;

        // Large asteroid
        this.generateLinePolygon(51.2, 9);
        this.numOfVertices[2] = 9;

        // Larger asteroid
        this.generateLinePolygon(76.8, 11);
        this.numOfVertices[3] = 11;
    }

    constructor(view) {
        super();
        this.generateVertices();
        this.pushModel(view);
    }
}