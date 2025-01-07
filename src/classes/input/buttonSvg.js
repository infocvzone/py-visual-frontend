class ButtonSvg {
  constructor(
    canvas,
    x,
    y,
    idleSvg,
    hoverSvg,
    clickedSvg,
    scale = 1.0,
    text = "",
    textColor = "#000000",
    textFont = "Roboto",
    textSize = 14
  ) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.scale = scale;

    this.idleSvg = idleSvg;
    this.hoverSvg = hoverSvg;
    this.clickedSvg = clickedSvg;

    this.state = "idle"; // Start in idle state

    // Text properties
    this.text = text;
    this.textColor = textColor;
    this.textFont = textFont;
    this.textSize = textSize;

    this.svgGroup = null; // Group that holds SVGs and text
    this.textElement = this.createText(); // Create fabric.Text object

    // Load the SVGs and set up event listeners
    this.loadSvgs().then(() => {
      this.setupEventListeners(canvas);
    });
  }

  // Create a fabric.Text object
  createText() {
    return new fabric.Text(this.text, {
      fontSize: this.textSize,
      fill: this.textColor,
      fontFamily: this.textFont,
      originX: "center",
      originY: "center",
      selectable: false,
      evented: false,
    });
  }

  // Function to load and scale SVGs
  loadSvgs() {
    return new Promise((resolve, reject) => {
      fabric.loadSVGFromString(this.idleSvg, (objects, options) => {
        const idleSvgObj = this.scaleSvg(objects, options);
        fabric.loadSVGFromString(this.hoverSvg, (objects, options) => {
          const hoverSvgObj = this.scaleSvg(objects, options);
          fabric.loadSVGFromString(this.clickedSvg, (objects, options) => {
            const clickedSvgObj = this.scaleSvg(objects, options);

            // Group SVGs and text
            this.svgGroup = new fabric.Group(
              [idleSvgObj, hoverSvgObj, clickedSvgObj, this.textElement],
              { left: this.x, top: this.y, selectable: true, evented: true }
            );

            resolve(); // Resolve when SVGs are loaded
          });
        });
      });
    });
  }

  // Function to scale SVGs based on the scale factor
  scaleSvg(objects, options) {
    const svgGroup = new fabric.Group(objects, options);
    svgGroup.scale(this.scale);
    svgGroup.set({
      originX: "center",
      originY: "center",
    });
    this.setSvgPosition(svgGroup);
    return svgGroup;
  }

  // Set the position of the SVG group
  setSvgPosition(svgGroup) {
    svgGroup.set({
      left: 0,
      top: 0,
      selectable: false,
      evented: false,
    });
  }

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

  isWithinBounds(mouseX, mouseY) {
    const left = this.svgGroup.left;
    const top = this.svgGroup.top;
    const width = 70 * this.scale;
    const height = 70 * this.scale;
    return (
      mouseX >= left &&
      mouseX <= left + width &&
      mouseY >= top &&
      mouseY <= top + height
    );
  }

  updateState() {
    const idleSvgObj = this.svgGroup.item(0);
    const hoverSvgObj = this.svgGroup.item(1);
    const clickedSvgObj = this.svgGroup.item(2);

    if (this.state === "clicked") {
      idleSvgObj.set({ opacity: 0 });
      hoverSvgObj.set({ opacity: 0 });
      clickedSvgObj.set({ opacity: 1 });
    } else if (this.state === "hover") {
      idleSvgObj.set({ opacity: 0 });
      hoverSvgObj.set({ opacity: 1 });
      clickedSvgObj.set({ opacity: 0 });
    } else {
      idleSvgObj.set({ opacity: 1 });
      hoverSvgObj.set({ opacity: 0 });
      clickedSvgObj.set({ opacity: 0 });
    }

    this.canvas.renderAll(); // Re-render after state change
  }

  updateText(newText, newColor) {
    this.textElement.set({
      text: newText,
      fill: newColor,
    });
    this.svgGroup.addWithUpdate(this.textElement); // Ensure text stays centered
    this.canvas.renderAll();
  }

  getFabricElementAsync() {
    return new Promise((resolve, reject) => {
      this.loadSvgs()
        .then(() => {
          resolve(this.svgGroup).then(() => {
            this.canvas.add(this.svgGroup);
          });
        })
        .catch(reject);
    });
  }
}

export default ButtonSvg;
