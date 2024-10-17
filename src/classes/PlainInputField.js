// classes/plainInput.js
class PlainInput {
  constructor(
    container,
    {
      width = 300,
      height = 40,
      placeholder = "Enter text...",
      bgColor = "#ffffff",
      borderColor = "#c8c8c8",
      borderThickness = 1,
      textColor = "#323232",
      placeholderColor = "#c8c8c8",
      fontSize = 15,
      padding = 10,
      fontFamily = "Roboto",
      inputType = "text",
      defaultValue = "",
      paddingLeft = 10,
      paddingRight = 10,
      paddingTop = 0,
      paddingBottom = 10,
      borderStyle = ["bottom", "top", "right", "left"],
      onInput = null,
    } = {}
  ) {
    // Create the input element
    this.input = document.createElement("input");
    this.input.type = inputType;
    this.input.placeholder = placeholder;
    this.input.value = defaultValue;

    // Apply styles
    this.input.style.width = `${width}px`;
    this.input.style.height = `${height}px`;
    this.input.style.backgroundColor = bgColor;
    this.input.style.border = `${borderThickness}px solid ${borderColor}`;
    this.input.style.borderStyle = borderStyle.join(" ");
    this.input.style.color = textColor;
    this.input.style.fontSize = `${fontSize}px`;
    this.input.style.fontFamily = fontFamily;
    this.input.style.padding = `${paddingTop}px ${paddingRight}px ${paddingBottom}px ${paddingLeft}px`;
    this.input.style.boxSizing = "border-box";

    // Apply placeholder color using CSS trick
    this.input.style.setProperty("--placeholder-color", placeholderColor);
    this.input.style.cssText += `
        ::placeholder {
          color: var(--placeholder-color);
        }
      `;

    // Add the input field to the container
    container.appendChild(this.input);

    // Attach input event listener if provided
    if (onInput) {
      this.input.addEventListener("input", (e) => onInput(e.target.value));
    }
  }
}

export default PlainInput;
