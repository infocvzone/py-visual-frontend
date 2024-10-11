//import { fabric } from 'fabric';

// Class definition
class FabricText extends fabric.Text {
  constructor(
    x,
    y,
    text = "Hello",
    scale = 1.0,
    fontPath = null,
    color = "#000000",
    fontFamily = "Roboto",
    fontSize = 30,
    bold = false,
    italic = false,
    underline = false,
    strikethrough = false
  ) {
    // Initialize with individual properties
    super(text, {
      left: x,
      top: y,
      fontSize: fontSize * scale, // Adjust font size by scale
      fill: color, // Text color
      fontFamily: fontFamily, // Default font
      fontWeight: bold ? "bold" : "normal", // Bold style
      fontStyle: italic ? "italic" : "normal", // Italic style
      underline: underline, // Underline style
      linethrough: strikethrough, // Strikethrough style
    });

    // Store initial properties
    this.anchorX = x;
    this.anchorY = y;
    this.fontPath = fontPath;
    this.rawText = text; // Store original text
    this.scale = scale;

    // Apply custom font if provided
    if (fontPath) {
      this.setFont(fontPath);
    }

    // Update the coordinates after scaling
    this.setScale(scale);
  }

  // Method to apply scaling
  setScale(scale) {
    this.scale = scale;
    this.fontSize = Math.round(this.fontSize * scale); // Update font size based on scale
    this.setCoords(); // Update positioning
  }

  // Method to update text content
  updateText(newText) {
    this.rawText = newText;
    this.text = newText;
    this.set({ text: newText });
    this.setCoords(); // Update positioning
  }

  // Method to change position
  setPosition(x, y) {
    this.set({ left: x, top: y });
    this.anchorX = x;
    this.anchorY = y;
    this.setCoords();
  }

  // Method to apply a new font from a file path
  setFont(fontPath) {
    if (fontPath) {
      const font = new FontFace("CustomFont", `url(${fontPath})`);
      font.load().then(() => {
        document.fonts.add(font);
        this.set({ fontFamily: "CustomFont" });
        this.setCoords(); // Update positioning
      });
    }
  }

  // Method to change text color
  setColor(color) {
    this.set({ fill: color });
    this.setCoords();
  }

  // Method to change font size
  setFontSize(fontSize) {
    this.set({ fontSize: fontSize * this.scale });
    this.setCoords();
  }

  // Method to toggle bold style
  setBold(isBold) {
    this.set({ fontWeight: isBold ? "bold" : "normal" });
    this.setCoords();
  }

  // Method to toggle italic style
  setItalic(isItalic) {
    this.set({ fontStyle: isItalic ? "italic" : "normal" });
    this.setCoords();
  }

  // Method to toggle underline style
  setUnderline(isUnderline) {
    this.set({ underline: isUnderline });
    this.setCoords();
  }

  // Method to toggle strikethrough (linethrough) style
  setStrikethrough(isStrikethrough) {
    this.set({ linethrough: isStrikethrough });
    this.setCoords();
  }

  // Method to update position based on current text dimensions
  updatePosition() {
    this.left = this.anchorX;
    this.top = this.anchorY - this.height; // Adjust Y position to account for height
    this.setCoords();
  }
}

export default FabricText;
