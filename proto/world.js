class World {
    // Width of the main view
    viewWidth;
    // Height of the main view
    viewHeight;
    // The main entity list. Each entity in this array will be constantly updated and rendered until it's removed.
    entities = [];
    // The main particle list. Each entity in this array will be constantly updated and rendered until it's removed.
    particles = [];
    // The player entity.
    player;
    // The current number of asteroids in this world.
    asteroidCount = 0;
    // The maximum capacity of asteroids in this world.
    // This world will not spawn more asteroids if the asteroid count has exceeded this maximum.
    maxAsteroidCount = 32;
    // The width of the spawning area for asteroids.
    spawnZoneX;
    // The height of the spawning area for asteroids.
    spawnZoneY;

    constructor(viewWidth, viewHeight) {
        this.viewWidth = viewWidth;
        this.viewHeight = viewHeight;
        this.spawnZoneX = viewWidth * 3;
        this.spawnZoneY = viewHeight * 3;
    }

    /**
     * Adds a player entity into the world.
     */
    addPlayer = (p) => {
        this.player = p;
        this.entities.push(p);
    }

    /**
     * Adds an entity other than a player entity into the world.
     */
    addEntity = (e) => {
        this.entities.push(e);
    }

    /**
     * Adds a particle into the world.
     */
    addParticle = (p) => {
        this.particles.push(p);
    }

    /**
     * Spawns a specified number of random asteroids with random attributes outside of the user's view.
     */
    spawnAsteroid = (count) => {
        for (let i = 0; i < count; ++i) {
            // A new asteroid will only spawn in a (3 * view width) X (3 * view height) area
            // centered in the player's position and outside the view area visible to the user.
            // The code below calculates a random position (x and y) inside that area.
            let x = (Math.random() * this.spawnZoneX);
            let y = (Math.random() * this.spawnZoneY);
            if ((x > this.spawnZoneX / 3 && x < this.spawnZoneX * 2 / 3) && (y > this.spawnZoneY / 3 && y < this.spawnZoneY * 2 / 3))
                continue;
            x += this.player.pos[0] - this.spawnZoneX / 2;
            y += this.player.pos[1] - this.spawnZoneY / 2;

            // Add a new asteroid with varying position, velocity, color, and size.
            let eSize = Math.floor(Math.random() * 4);
            let e = new AsteroidEntity(this, model_asteroid, x, y, vec4(0.4, 0.4, Math.random() + 0.6, 1.0), (Math.random() * 4.0) - 2.0, (Math.random() * 4.0) - 2.0, eSize);
            this.addEntity(e);
            this.asteroidCount++;
        }
    }

    /**
     * Remove an entity
     */
    removeEntity = (e) => {
        e.remove();
        if (e instanceof AsteroidEntity)
            this.asteroidCount--;
    }

    /**
     * Resolve a collision between two entities e0 and e1.
     */
    resolveCollision = (e0, e1) => {
        // If both entities are asteroids, update their velocities to simulate momentum conservation.
        if (e0 instanceof AsteroidEntity && e1 instanceof AsteroidEntity) {
            let e0mass = e0.size * e0.size + 1;
            let e1mass = e1.size * e1.size + 1;
            let dx = e1.pos[0] - e0.pos[0];
            let dy = e1.pos[1] - e0.pos[1];
        
            let normalLength = Math.sqrt(dx * dx + dy * dy);
            let normal = vec2(dx / normalLength, dy / normalLength);

            let tangent = vec2(-normal[1], normal[0]);

            // Projection of e0's velocity to normal (dot product)
            let e0np = normal[0] * e0.vel[0] + normal[1] * e0.vel[1];
            // Projection of e0's velocity to tangent (dot product)
            let e0tp = tangent[0] * e0.vel[0] + tangent[1] * e0.vel[1];
            // Projection of e1's velocity to normal (dot product)
            let e1np = normal[0] * e1.vel[0] + normal[1] * e1.vel[1];
            // Projection of e1's velocity to tangent (dot product)
            let e1tp = tangent[0] * e1.vel[0] + tangent[1] * e1.vel[1];

            let e0nv = (e0np * (e0mass - e1mass) + 2.0 * e1mass * e1np) / (e0mass + e1mass);
            let e1nv = (e1np * (e1mass - e0mass) + 2.0 * e0mass * e0np) / (e0mass + e1mass);

            e0np = vec2(normal[0] * e0nv, normal[1] * e0nv);
            e0tp = vec2(tangent[0] * e0tp, tangent[1] * e0tp);
            e1np = vec2(normal[0] * e1nv, normal[1] * e1nv);
            e1tp = vec2(tangent[0] * e1tp, tangent[1] * e1tp);

            e0.vel = vec2(e0np[0] + e0tp[0], e0np[1] + e0tp[1]);
            e1.vel = vec2(e1np[0] + e1tp[0], e1np[1] + e1tp[1]);

            // Entities' positions are shifted slightly to reduce unexpected collision behaviors.
            e0.pos[0] -= normal[0];
            e0.pos[1] -= normal[1];
            e1.pos[0] += normal[0];
            e1.pos[1] += normal[1];
        }
        // If only one entity is an asteroid, split that asteroid and try to remove the other entity.
        // The only possibilities are asteroid-player collision or asteroid-prrojectile collistion.
        // In both cases, the game score is incremented by the asteroid's value.
        else if (e0 instanceof AsteroidEntity) {
            e0.split();
            e1.remove();
            score += e0.value;
        }
        else if (e1 instanceof AsteroidEntity) {
            e1.split();
            e0.remove();
            score += e1.value;
        }
    }

    /**
     * Checks for collisions between every pair of entities in this
     * world using the sweep and prune algorithm. Each entity is sorted
     * based on its y-position and has its own bounding radius. If an
     * entity pair doesn't intersect each other's bounding radius, then
     * that pair must be excluded from the possibility of a collision.
     * This algorithm avoid the naive O(n^2) algorithm.
     */
    checkCollisions = () => {
        let intervals = [];
        this.entities.forEach((e) => {
            intervals.push({
                value: e.pos[1] - e.radius,
                entity: e,
                end: false
            },
            {
                value: e.pos[1] + e.radius,
                entity: e,
                end: true
            }
            );
        })
        intervals.sort((a, b) => a.value - b.value);

        let active = [];
        for (let x of intervals) {
            if (!x.end) {
                active.push(x);
                if (active.length > 1) {
                    // Check if a pair of entities actually collide.
                    let e0 = x.entity;
                    for (let i = 0; i < active.length - 1; ++i) {
                        let e1 = active[i].entity;
                        if (e0.collides(e1)) {
                            this.resolveCollision(e0, e1);
                        }
                    }
                }
            }
            else {
                active.splice(active.indexOf(x), 1);
            }
        }
    }

    onUpdate = () => {
        // Spawn a new asteroid sparsely.
        if (Math.floor(Math.random() * canvas.width) <= 100.0 && this.asteroidCount <= this.maxAsteroidCount) {
            this.spawnAsteroid(1);
        }

        // Render all entities in the entities array.
        // At the end, all removed entities are removed from the entities array.
        let active_entities = [];
        for (let e of this.entities) {
            if (e.isRemoved)
                continue;
            // Any entity outside a (3 * view width) X (3 * view height) area
            // centered in the player's position are removed for performance.
            if (Math.abs(e.pos[0] - this.player.pos[0]) > this.spawnZoneX / 2 || Math.abs(e.pos[1] - this.player.pos[1]) > this.spawnZoneY / 2) {
                this.removeEntity(e);
                continue;
            }

            e.onUpdate();
            active_entities.push(e);
        }
        // Overwrite the entities array.
        this.entities = active_entities;

        this.checkCollisions();

        // Render all particles in the particles array.
        // At the end, all removed particles are removed from the particles array.
        let active_particles = [];
        for (let p of this.particles) {
            if (p.isRemoved)
                continue;
            
            p.onUpdate();
            active_particles.push(p);
        }
        // Overwrite the particles array.
        this.particles = active_particles;
    }

    /**
     * Render all entities and particles in this world.
     */
    onRender = (view) => {
        for (let e of this.entities) {
            e.onRender(view);
        }
        for (let p of this.particles) {
            p.onRender(view);
        }
        view.renderFrame();
    }
}