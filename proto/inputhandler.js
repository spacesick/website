class InputHandler {
    view;
    player;

    // The current mouse position relative to the HTML canvas' origin.
    mouseX = 0.0;
    mouseY = 0.0;

    // Whether the left mouse button is hold or not.
    leftMouseButtonIsHold = false;

    constructor(view, player) {
        this.view = view;
        this.player = player;

        // Add callback functions that respond to mouse interaction
        canvas.addEventListener("mousemove", this.handleMouseMovement);
        canvas.addEventListener("mousedown", this.handleMouseButtonPress);
        canvas.addEventListener("mouseup", this.handleMouseButtonRelease);
    }

    /**
     * Handle moving the mouse.
     * Makes the player entity face towards the mouse cursor.
     */
    handleMouseMovement = (event) => {
        let rect = canvas.getBoundingClientRect();
        this.mouseX = (event.clientX - rect.left - canvas.width / 2) / canvas.width;
        this.mouseY = (event.clientY - rect.top - canvas.height / 2) / canvas.height;

        let len = Math.sqrt(this.mouseX * this.mouseX + this.mouseY * this.mouseY);

        this.mouseX /= len;
        this.mouseY /= len;

        if (this.mouseY < 0)
            this.player.ang = Math.acos(this.mouseX);
        else
            this.player.ang = -Math.acos(this.mouseX);
    }

    /**
     * Handle pressing a mouse button.
     * If the left button is pressed, make the player entity shoot
     * a projectile. If the right button is pressed, accelerate the player
     * in the direction its facing.
     */
    handleMouseButtonPress = (event) => {
        if (!this.player.isRemoved) {
            switch (event.button) {
                case 0:
                    this.player.shootProjectile(this.mouseX * 8.0, -this.mouseY * 8.0);
                    break;
                case 2:
                    this.leftMouseButtonIsHold = true;
                    this.handleMouseButtonHold();
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Handle releasing a mouse button.
     */
    handleMouseButtonRelease = (event) => {
        switch (event.button) {
            case 2:
                this.leftMouseButtonIsHold = false;
                break;
            default:
                break;
        }
    }

    /**
     * Handle holding a mouse button.
     * Called whenever the left mouse button is pressed.
     */
    handleMouseButtonHold = () => {
        if (this.leftMouseButtonIsHold) {
            this.player.addVelocity(this.mouseX / 2.0, -this.mouseY / 2.0);
            setTimeout(this.handleMouseButtonHold, 100);
        }
    }
}

