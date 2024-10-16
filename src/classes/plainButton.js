class PlainButton {
    constructor(parentElement, text = "Click Me", idleColor = '#38b6ff', hoverColor = '#7cc8f4', clickedColor = '#155980', textColor = '#FFFFFF', width = 150, height = 50, border_thickness = 1, borderColor = "#000000", fontFamily = "Roboto") {
        this.text = text;
        this.idleColor = idleColor;
        this.hoverColor = hoverColor;
        this.clickedColor = clickedColor;
        this.textColor = textColor;
        this.width = width;
        this.height = height;
        this.border_thickness = border_thickness;
        this.borderColor = borderColor;
        this.fontFamily = fontFamily;

        // Create button element
        this.buttonElement = document.createElement("button");
        this.buttonElement.textContent = this.text;

        // Apply initial styles
        this.buttonElement.style.backgroundColor = this.idleColor;
        this.buttonElement.style.color = this.textColor;
        this.buttonElement.style.width = `${this.width}px`;
        this.buttonElement.style.height = `${this.height}px`;
        this.buttonElement.style.border = `${this.border_thickness}px solid ${this.borderColor}`;
        this.buttonElement.style.fontFamily = this.fontFamily;
        // this.buttonElement.style.borderRadius = "5px";
        this.buttonElement.style.cursor = "pointer";
        this.buttonElement.style.fontSize = "16px";

        // Attach the button to the parent element
        parentElement.appendChild(this.buttonElement);

        // Bind event handlers
        this.bindEvents();
    }

    // Method to bind events for hover and click states
    bindEvents() {
        this.buttonElement.addEventListener("mouseover", () => this.handleHover());
        this.buttonElement.addEventListener("mouseout", () => this.handleMouseOut());
        this.buttonElement.addEventListener("mousedown", () => this.handleMouseDown());
        this.buttonElement.addEventListener("mouseup", () => this.handleMouseUp());
    }

    // Handle hover state
    handleHover() {
        this.buttonElement.style.backgroundColor = this.hoverColor;
    }

    // Handle idle state
    handleMouseOut() {
        this.buttonElement.style.backgroundColor = this.idleColor;
    }

    // Handle clicked state
    handleMouseDown() {
        this.buttonElement.style.backgroundColor = this.clickedColor;
    }

    // Handle hover state after mouseup
    handleMouseUp() {
        this.buttonElement.style.backgroundColor = this.hoverColor;
    }
}

export default PlainButton;
