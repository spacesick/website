class View {
    // The default shader for this game.
    shader;

    // View width
    width;
    // View height
    height;

    // View (Camera) offset
    offs = vec2(0, 0);

    // The main VAO to bind to.
    vertexArrayObject;
    // The main VBO used to store all models' vertices. 
    // This way, there will only be one copy of vertex data for each model.
    modelVertexBufferObject;

    // Limit to 65536 vertices.
    maxVertices = 65536;

    // Stride per model vertex
    modelVertexStride = 6;
    // A buffer for the model vertices (to be sent to the model VBO).
    modelVertexBuffer = new Float32Array(this.maxVertices * this.modelVertexStride);
    // The current count of vertices in the model vertex buffer.
    modelVertexCount = 0;

    // The main render stack.
    // All render calls are collected here and drawn at once at the end of each frame.
    renderStack = [];

    // Uniform locations
    uResolution;
    uViewOffs;
    uModelPos;
    uModelCol;
    uModelAng;
    uModelScale;

    constructor(width, height) {
        this.width = width;
        this.height = height;

        // Create, compile, link, and use the shader.
        this.shader = initShaders(gl, "vertex-shader", "fragment-shader");
        gl.useProgram(this.shader);

        // Create the main VAO.
        this.vertexArrayObject = gl.createVertexArray();
        gl.bindVertexArray(this.vertexArrayObject);

        // Create the VBO to store vertex data for every model.
        this.modelVertexBufferObject = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.modelVertexBufferObject);

        // Sets the vertex buffer layout: [ pos.x pos.y | col.r col.g col.b col.a ], for the default shader.
        let posLoc = gl.getAttribLocation(this.shader, "aPos");
        gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, this.modelVertexStride * 4, 0);
        gl.enableVertexAttribArray(posLoc);
        let colLoc = gl.getAttribLocation(this.shader, "aCol");
        gl.vertexAttribPointer(colLoc, 4, gl.FLOAT, false, this.modelVertexStride * 4, 2 * 4);
        gl.enableVertexAttribArray(colLoc);

        // Get uniform locations.
        this.uResolution = gl.getUniformLocation(this.shader, "uResolution");
        this.uViewOffs = gl.getUniformLocation(this.shader, "uViewOffs");
        this.uModelPos = gl.getUniformLocation(this.shader, "uModelPos");
        this.uModelCol = gl.getUniformLocation(this.shader, "uModelCol");
        this.uModelAng = gl.getUniformLocation(this.shader, "uModelAng");
        this.uModelScale = gl.getUniformLocation(this.shader, "uModelScale");

        gl.uniform2f(this.uResolution, width, height);
    }

    /**
     * Renders a frame using data from the render stack.
     * At the end, the render stack is cleared.
     */
    renderFrame = () => {
        gl.uniform2f(this.uViewOffs, this.offs[0], this.offs[1]);
        for (let r of this.renderStack) {
            gl.uniform2f(this.uModelPos, r[0][0], r[0][1]);
            gl.uniform4f(this.uModelCol, r[1][0], r[1][1], r[1][2], r[1][3]);
            gl.uniform1f(this.uModelAng, r[2]);
            gl.uniform1f(this.uModelScale, r[5]);

            gl.drawArrays(gl.LINE_LOOP, r[3], r[4]);
        }
        this.renderStack = [];
    }

    /**
     * Submits all vertices in the model vertex buffer to the model VBO.
     */
    sendBufferData = () => {
        gl.bufferData(gl.ARRAY_BUFFER, this.modelVertexBuffer.subarray(0, this.modelVertexCount * this.modelVertexStride), gl.STATIC_DRAW);
    }

    /**
     * Pushes a single vertex to the model vertex buffer.
     */
    pushModelVertex = (posX, posY, colR, colG, colB, colA) => {
        this.modelVertexBuffer.set([posX, posY, colR, colG, colB, colA], this.modelVertexCount * this.modelVertexStride);
        this.modelVertexCount++;
    }

    /**
     * Adds a render call to the main render stack for a specified object.
     * pos is the position of the object.
     * col is the color of the object.
     * angle is the rotational angle of the object relative to the positive x-axis in radians.
     * startIndex is the starting index of a model to be used in the model VBO.
     * numOfVertices is the number of vertices that will be rendered starting from the startIndex. 
     * scale is the scale of the object. (Optional, defaults to 1.0)
     */
    pushToRenderStack = (pos, col, angle, startIndex, numOfVertices, scale) => {
        if (scale != undefined)
            this.renderStack.push([pos, col, angle, startIndex, numOfVertices, scale]);
        else
            this.renderStack.push([pos, col, angle, startIndex, numOfVertices, 1.0]);
    }

    /**
     * Sets the view offset.
     */
    setOffset = (offs) => {
        this.offs = offs;
    }

    getModelVertexCount = () => {
        return this.modelVertexCount;
    }

    getModelVertexStride = () => {
        return this.modelVertexStride;
    }
}