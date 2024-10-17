

class ButtonSVG {
  constructor(canvas, x, y, svgs = [], scale = 1.0) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.scale = scale;

    // Default SVGs for idle, hover, and clicked states
    this.idleSVG = svgs[0];
    this.hoverSVG = svgs[1];
    this.clickedSVG = svgs[2];

    // Button state
    this.state = "idle"; // Start in the idle state

    // Group to hold all SVGs
    this.svgGroup = null;

    // Load the SVGs and set up event listeners
    this.loadSVGs().then(() => {
      this.setupEventListeners(canvas);
    });
  }

  // Load SVGs into fabric objects and create a group
  loadSVGs() {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromString(this.idleSVG, (objects, options) => {
        const idleObj = this.normalizeSVG(objects, options);

        fabric.loadSVGFromString(this.hoverSVG, (hoverObjects, hoverOptions) => {
          const hoverObj = this.normalizeSVG(hoverObjects, hoverOptions);

          fabric.loadSVGFromString(this.clickedSVG, (clickedObjects, clickedOptions) => {
            const clickedObj = this.normalizeSVG(clickedObjects, clickedOptions);

            // Group all SVGs
            this.svgGroup = new fabric.Group(
              [idleObj, hoverObj, clickedObj],
              {
                left: this.x,
                top: this.y,
                selectable: true,
                evented: true,
              }
            );

            resolve(); // SVGs are loaded
          });
        });
      });
    });
  }

  // Normalize the SVG by scaling and setting properties
  normalizeSVG(objects, options) {
    const svgObj = fabric.util.groupSVGElements(objects, options);

    svgObj.set({
      scaleX: this.scale,
      scaleY: this.scale,
      originX: "center",
      originY: "center",
    });

    this.setSVGPosition(svgObj);
    return svgObj;
  }

  // Position the SVG within the group
  setSVGPosition(svgObj) {
    svgObj.set({
      left: 0,
      top: 0,
      selectable: false, // Disable individual dragging
      evented: false, // Disable individual event handling
    });
  }

  // Set up event listeners for hover and click states
  setupEventListeners(canvas) {
    canvas.on("mouse:move", (event) => {
      const pointer = canvas.getPointer(event.e);
      const isHovered = this.isWithinBounds(pointer.x, pointer.y);
      if (isHovered && this.state !== "hover") {
        this.state = "hover";
        this.updateState();
      } else if (!isHovered && this.state === "hover") {
        this.state = "idle";
        this.updateState();
      }
    });

    canvas.on("mouse:down", (event) => {
      const pointer = canvas.getPointer(event.e);
      if (this.isWithinBounds(pointer.x, pointer.y)) {
        this.state = "clicked";
        this.updateState();
      }
    });

    canvas.on("mouse:up", () => {
      if (this.state === "clicked") {
        this.state = "idle";
        this.updateState();
      }
    });
  }

  // Check if the mouse pointer is within the button's bounds
  isWithinBounds(mouseX, mouseY) {
    return (
      mouseX >= this.svgGroup.left &&
      mouseX <= this.svgGroup.left + 200 * this.scale &&
      mouseY >= this.svgGroup.top &&
      mouseY <= this.svgGroup.top + 200 * this.scale
    );
  }

  // Update the button state and switch between SVGs
  updateState() {
    if (this.state === "clicked") {
      this.setOpacity(0, 0, 1); // Show clicked SVG
    } else if (this.state === "hover") {
      this.setOpacity(0, 1, 0); // Show hover SVG
    } else {
      this.setOpacity(1, 0, 0); // Show idle SVG
    }

    this.canvas.renderAll(); // Re-render the canvas
  }

  // Set opacity for idle, hover, and clicked SVGs
  setOpacity(idle, hover, clicked) {
    this.svgGroup._objects[0].set({ opacity: idle });
    this.svgGroup._objects[1].set({ opacity: hover });
    this.svgGroup._objects[2].set({ opacity: clicked });
  }

  // Ensure SVGs are loaded before calling this method
  getFabricElementAsync() {
    return new Promise((resolve, reject) => {
      this.loadSVGs()
        .then(() => {
          resolve(this.svgGroup).then(() => {
            this.canvas.add(this.svgGroup);
          });
        })
        .catch(reject);
    });
  }
}

export default ButtonSVG;
