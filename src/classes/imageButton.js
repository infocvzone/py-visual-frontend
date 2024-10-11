class ButtonImage {
  constructor(canvas, x, y, images = [], scale = 1.0) {
    this.canvas = canvas;
    this.x = x;
    this.y = y;
    this.scale = scale;

    // Default images for idle, hover, and clicked states
    this.idleImage = images[0];
    this.hoverImage = images[1];
    this.clickedImage = images[2];

    // Button states
    this.state = "idle"; // Start in the idle state

    // Group that holds all images
    this.imageGroup = null;

    // Load the images and set up event listeners
    this.loadImages().then(() => {
      this.setupEventListeners(canvas);
    });
  }

  // Function to load and scale images
  loadImages() {
    return new Promise((resolve, reject) => {
      fabric.Image.fromURL(
        this.idleImage,
        (idleImg) => {
          fabric.Image.fromURL(this.hoverImage, (hoverImg) => {
            fabric.Image.fromURL(this.clickedImage, (clickedImg) => {
              // Set images with desired width and height
              this.idleImage = this.normalizeImage(idleImg, 100, 100);
              this.hoverImage = this.normalizeImage(hoverImg, 100, 100);
              this.clickedImage = this.normalizeImage(clickedImg, 100, 100);

              // Group all images into a fabric.Group
              this.imageGroup = new fabric.Group(
                [this.idleImage, this.hoverImage, this.clickedImage],
                {
                  left: this.x,
                  top: this.y,
                  selectable: true,
                  evented: true,
                }
              );

              // Add the group to the canvas
              resolve(); // Resolve the promise when images are loaded
            });
          });
        },
        { crossOrigin: "anonymous" }
      ); // Optional: handle CORS for external images
    });
  }

  normalizeImage(image, maxWidth, maxHeight) {
    // Calculate the scaling factor to maintain aspect ratio
    const aspectRatio = image.width / image.height;

    let width = maxWidth * this.scale; // Desired width scaled
    let height = maxHeight * this.scale; // Desired height scaled

    // Adjust width and height based on the aspect ratio
    if (width / height > aspectRatio) {
      // If the calculated width is too wide, scale based on height
      width = height * aspectRatio;
    } else {
      // If the calculated height is too tall, scale based on width
      height = width / aspectRatio;
    }

    // Set the image properties
    image.set({
      scaleX: this.scale,
      scaleY: this.scale,
      originX: "center", // Center the images within the group
      originY: "center",
    });

    this.setImagePosition(image);
    return image;
  }

  // Set the image position based on x and y
  setImagePosition(image) {
    image.set({
      left: 0, // Set to 0 to position within the group context
      top: 0, // Position within the group context
      selectable: false, // Prevent individual dragging
      evented: false, // Disable individual event handling
    });
  }

  // Function to handle events for hover and click states
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

  // Check if the mouse is within the button's bounds
  isWithinBounds(mouseX, mouseY) {
    return (
      mouseX >= this.imageGroup.left &&
      mouseX <= this.imageGroup.left + 200 * this.scale &&
      mouseY >= this.imageGroup.top &&
      mouseY <= this.imageGroup.top + 200 * this.scale
    );
  }

  // Update the button state by changing the displayed image
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

    this.canvas.renderAll(); // Re-render the canvas after state change
  }

  // Ensure images are loaded before calling this method
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
