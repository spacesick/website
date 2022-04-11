// A model object can have multiple variants, for example, an asteroid can have a small
// variant, a medium variant, etc. Each variant are indexed starting from 0.
// Use the variant indexed at 0 if there's only 1 type of model.
class Model {
    // The indeces of this model's variants in the model vertex buffer. Each element in
    // this array represents a variant.
    bufferIndex = [];
    // Number of vertices for this model's variant. Each element in this array
    // represents a variant.
    numOfVertices = [];
    // Model vertex data for each variant.
    data = [];

    /**
     * Pushes a set of vertices that define this model into the model VBO.
     * Also calculates the starting indices of each model variant defined
     * in the model VBO.
     */
    pushModel = (view) => {
        let totalNumOfVertices = 0;
        
        for (let j = 0; j < this.numOfVertices.length; ++j) {
            this.bufferIndex[j] = view.getModelVertexCount() + totalNumOfVertices;
            totalNumOfVertices += this.numOfVertices[j];
        }

        for (let i = 0; i < totalNumOfVertices * view.getModelVertexStride(); i += view.getModelVertexStride()) {
            view.pushModelVertex(this.data[i], this.data[i + 1], this.data[i + 2], this.data[i + 3], this.data[i + 4], this.data[i + 5]);
        }
        
    }
}