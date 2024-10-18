class ButtonImage {
  constructor(
    canvas, x, y, 
    idleImage, hoverImage, clickedImage, 
    scale = 1.0, 
    text = "", textColor = "#000000", textFont = "Roboto", textSize = 14
  ) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.scale = scale;

    this.idleImage = idleImage;
    this.hoverImage = hoverImage;
    this.clickedImage = clickedImage;

    this.state = "idle"; // Start in idle state

    // Text properties
    this.text = text;
    this.textColor = textColor;
    this.textFont = textFont;
    this.textSize = textSize;

    this.imageGroup = null; // Group that holds images and text
    this.textElement = this.createText(); // Create fabric.Text object

    // Load the images and set up event listeners
    this.loadImages().then(() => {
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

  // Function to load and scale images
  loadImages() {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(this.idleImage, (idleImg) => {
        fabric.Image.fromURL(this.hoverImage, (hoverImg) => {
          fabric.Image.fromURL(this.clickedImage, (clickedImg) => {
            this.idleImage = this.normalizeImage(idleImg, 150, 150);
            this.hoverImage = this.normalizeImage(hoverImg, 150, 150);
            this.clickedImage = this.normalizeImage(clickedImg, 150, 150);

            // Group images and text
            this.imageGroup = new fabric.Group(
              [this.idleImage, this.hoverImage, this.clickedImage, this.textElement],
              { left: this.x, top: this.y, selectable: true, evented: true }
            );

            resolve(); // Resolve when images are loaded
          });
        });
      }, { crossOrigin: "anonymous" });
    });
  }

  normalizeImage(image, maxWidth, maxHeight) {
    const aspectRatio = image.width / image.height;

    let width = maxWidth * this.scale;
    let height = maxHeight * this.scale;

    if (width / height > aspectRatio) {
      width = height * aspectRatio;
    } else {
      height = width / aspectRatio;
    }

    image.set({
      scaleX: this.scale,
      scaleY: this.scale,
      originX: "center",
      originY: "center",
    });

    this.setImagePosition(image);
    return image;
  }

  setImagePosition(image) {
    image.set({
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
    return (
      mouseX >= this.imageGroup.left &&
      mouseX <= this.imageGroup.left + 200 * this.scale &&
      mouseY >= this.imageGroup.top &&
      mouseY <= this.imageGroup.top + 200 * this.scale
    );
  }

  updateState() {
    if (this.state === "clicked") {
      this.idleImage.set({ opacity: 0 });
      this.hoverImage.set({ opacity: 0 });
      this.clickedImage.set({ opacity: 1 });
    } else if (this.state === "hover") {
      this.idleImage.set({ opacity: 0 });
      this.hoverImage.set({ opacity: 1 });
      this.clickedImage.set({ opacity: 0 });
    } else {
      this.idleImage.set({ opacity: 1 });
      this.hoverImage.set({ opacity: 0 });
      this.clickedImage.set({ opacity: 0 });
    }

    this.canvas.renderAll(); // Re-render after state change
  }

  updateText(newText, newColor) {
    this.textElement.set({
      text: newText,
      fill: newColor,
    });
    this.imageGroup.addWithUpdate(this.textElement); // Ensure text stays centered
    this.canvas.renderAll();
  }

  getFabricElementAsync() {
    return new Promise((resolve, reject) => {
      this.loadImages()
        .then(() => {
          resolve(this.imageGroup).then(() => {
            this.canvas.add(this.imageGroup);
          });
        })
        .catch(reject);
    });
  }
}

export default ButtonImage;
