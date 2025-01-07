// Function to generate Python code based on current elements
export const handleGenerateCode = async (
  elements,
  positions,
  heights,
  width,
  height,
  color,
  bgImage,
  setCodeDisplay,
  codeDisplay,
  setGeneratedCode
) => {
  setCodeDisplay(!codeDisplay);
  // Sort elements by their zIndex property (default to 1 if not defined)
  const sortedElements = [...elements].sort(
    (a, b) => (a.zIndex || 1) - (b.zIndex || 1)
  );
  let pythonCode = `
#.................... 1. LOGIC CODE ....................#\n\n
#.................... 2. EVENTS BINDING ....................#\n
def attach_events():
    pass

#.................... 3. MAIN FUNCTION ....................#\n
def main():
  # Create a window for the calculator
  window = pv.Window(title="PyVisual Window", width=${
    !width ? 700 : width
  }, height=${!height ? 400 : height}, bg_color=${
    !color ? `(1,1,1,1)` : `${normalizeRgba(color)}`
  },
  icon=None, bg_image=${
    !bgImage ? "None" : `"assets/background/background.jpg"`
  }, is_frameless=False, is_resizable=False)
  create_ui(window)
  attach_events()
  # Display the window
  window.show()

#..................... 4. UI CODE .....................#\n

ui = {}

def create_ui(window):

 
`; // Initial code string

  sortedElements.forEach((el, index) => {
    const pos = positions[el.id] || { x: 50, y: 50 }; // Get position or default
    const elHeight = heights[el.id]?.height || 0;
    let params =
      el.type === "Line"
        ? `(window=window`
        : `(window=window, x=${pos.x}, y=${
            !height ? 400 - pos.y - elHeight : height - pos.y - elHeight
          }`;

    // Handle parameters for each element type
    switch (el.type) {
      case "BasicButton":
        params += `, 
          width=${Math.floor(el.width)}, height=${Math.floor(
          el.height
        )}, text='${el.text}', 
          font="assets/fonts/${el.fontFamily}/${
          el.fontFamily
        }.ttf", font_size=${el.fontSize}, font_color=${normalizeRgba(
          el.textColor
        )},
          bold = ${el.bold === true ? `True` : `False`}, italic = ${
          el.italic === true ? `True` : `False`
        }, underline = ${
          el.underline === true ? `True` : `False`
        }, strikethrough = ${el.strikethrough === true ? `True` : `False`},
          button_color=${normalizeRgba(
            el.idleColor
          )}, hover_opacity= 0.7, clicked_opacity= 0.5,  
          border_color=${normalizeRgba(el.borderColor)}, border_thickness=${
          el.borderThickness
        }, corner_radius = ${el.borderRadius},
          is_visible=${
            el.visibility === true ? `True` : `False`
          }, disabled = False, disabled_opacity = 0.3, opacity=${el.opacity},
          on_hover=${el.onHover === null ? "None" : el.onHover}, on_click=${
          el.onClick === null ? "None" : el.onClick
        }, on_release=${el.onRelease === null ? "None" : el.onRelease}, tag=${
          el.name === null || el.name === "" ? `None` : `"${el.name}"`
        }      
          `;
        break;

      case "InputField":
        params += `, width=${el.width}, height=${el.height}, visibility=${
          el.visibility === true ? `True` : `False`
        }, background_color=${normalizeRgba(el.bgColor)}, input_type='${
          el.input_type
        }',
          placeholder='${el.placeholder}', default_text="${el.text}", 
          text_padding_left=${el.padding_left}, text_padding_right=${
          el.padding_right
        }, text_padding_top=${el.padding_top}, text_padding_bottom=${
          el.padding_bottom
        },
          font="assets/fonts/${el.fontFamily}/${
          el.fontFamily
        }.ttf", font_size=${el.fontSize}, font_color=${normalizeRgba(
          el.textColor
        )},
          border_color=${normalizeRgba(el.borderColor)}, border_thickness=${
          el.borderThickness
        }, 
          border_style= ["${el.border_style[0]}", "${el.border_style[1]}", "${
          el.border_style[2]
        }", "${el.border_style[3]}"], on_input=${
          !el.on_input ? "None" : `"${el.on_input}"`
        }, tag = ${
          el.name === null || el.name === "" ? `None` : `"${el.name}"`
        }`;

        break;

      case "Text":
        let Bold = el.bold === true ? "True" : "False";
        let Italic = el.italic === true ? "True" : "False";
        let Underline = el.underline === true ? "True" : "False";
        let Strike = el.strikethrough === true ? "True" : "False";
        params += `, text='${el.text}',
          font="assets/fonts/${el.fontFamily}/${
          el.fontFamily
        }.ttf", font_color=${normalizeRgba(el.color)}, font_size=${el.fontSize},
          bold=${Bold} , italic=${Italic}, underline=${Underline}, strikethrough=${Strike}, 
          bg_color=${normalizeRgba(el.bgColor)}, box_width=${
          el.boxWidth
        }, text_alignment="${el.textAlignment}",
          is_visible=${el.visibility === true ? `True` : `False`}, opacity=${
          el.opacity
        }, tag = ${
          el.name === null || el.name === "" ? `None` : `"${el.name}"`
        }`;
        break;

      case "Toggle":
        params += `, ${el.width}, ${el.height}, initial_state=${el.initialState}, 
                         border_color='${el.borderColor}', border_thickness=${el.borderThickness}, 
                         colors={'onColor': '${el.colors.onColor}', 'offColor': '${el.colors.offColor}', 'handleColor': '${el.colors.handleColor}'}, scale=${el.scale}`;
        break;

      case "Slider":
        params += `, ${el.width}, ${el.height}, min_value=${el.minValue}, 
                         max_value=${el.maxValue}, initial_value=${el.initialValue}, 
                         colors={'trackColor': '${el.colors.trackColor}', 'fillColor': '${el.colors.fillColor}', 'knobColor': '${el.colors.knobColor}'}, 
                         knob_size=${el.knobSize}, font_size=${el.fontSize}, 
                         text_color='${el.textColor}', text_offset=${el.textOffset}, 
                         show_text=${el.showText}`;
        break;

      case "Checkbox":
        params += `, ${el.width}, ${el.height}, checked=${el.checked}, 
                         border_color='${el.borderColor}', border_thickness=${el.borderThickness}, 
                         scale=${el.scale}`;
        break;

      case "RadioButton":
        params += `, ${el.size}, num_buttons=${el.numButtons}, selected_index=${
          el.selectedIndex
        }, 
                         layout='${el.layout}', gap=${el.gap}, scale=${
          el.scale
        }, 
                         border_color='${el.borderColor}', border_thickness=${
          el.borderThickness
        }, 
                         colors={'selectedColor': '${
                           el.colors.selectedColor
                         }', 'unselectedColor': '${
          el.colors.unselectedColor
        }'}, 
                         labels=${JSON.stringify(el.labels)}, font_size=${
          el.fontSize
        }, 
                         text_color='${el.textColor}', text_offset=${
          el.textOffset
        }`;
        break;

      case "DropdownMenu":
        params += `, ${el.width}, ${el.height}, options=${JSON.stringify(
          el.options
        )}, 
                         placeholder='${el.placeholder}', font_size=${
          el.fontSize
        }, 
                         text_color='${el.textColor}', bg_color='${
          el.bgColor
        }', 
                         border_color='${el.borderColor}', border_thickness=${
          el.borderThickness
        }, 
                         dropdown_bg_color='${
                           el.dropdownBgColor
                         }', hover_color='${el.hoverColor}', padding=${
          el.padding
        }`;
        break;

      case "ProgressBar":
        params += `, ${el.width}, ${el.height}, min_value=${el.minValue}, 
                         max_value=${el.maxValue}, initial_value=${el.initialValue}, 
                         scale=${el.scale}, font_size=${el.fontSize}, text_color='${el.textColor}', 
                         text_offset=${el.textOffset}, show_text=${el.showText}`;
        break;
      case "Image":
        params += `, image_path="assets/Images/image_${index + 1}.png", 
          scale=${el.scale_value}, is_visible=${
          el.visibility === false ? "False" : "True"
        }, opacity=${el.opacity}, tag=${
          el.name === null || el.name === "" ? `None` : `"${el.name}"`
        }`;
        break;
      case "Svg":
        params += `, image_path="assets/Images/image_${index + 1}.svg", scale=${
          el.scale_value
        }, visibility=${el.visibility === true ? `True` : `False`}, tag = ${
          el.name === null || el.name === "" ? `None` : `"${el.name}"`
        }`;
        break;

      case "ButtonImage":
        params += `, scale = ${el.scale}, text="${el.text}", 
          idle_image = "assets/Buttons/Button_${index + 1}/idle.png",
          hover_image = "assets/Buttons/Button_${index + 1}/hover.png",
          clicked_image = "assets/Buttons/Button_${index + 1}/clicked.png",
          font="assets/fonts/${el.fontFamily}/${
          el.fontFamily
        }.ttf", font_size=${el.fontSize},font_color="${normalizeRgba(
          el.textColor
        )}", visibility=${el.visibility === true ? `True` : `False`},
          on_hover=${
            el.onHover === null || el.onHover === "" ? "None" : el.onHover
          }, on_click=${
          el.onClick === null || el.onClick === "" ? "None" : el.onClick
        }, on_release=${
          el.onRelease === null || el.onRelease === "" ? "None" : el.onRelease
        }, 
          tag = ${
            el.name === null || el.name === "" ? `None` : `"${el.name}"`
          }`;
        break;

      case "Rect":
        params += `, width=${Math.floor(el.width)}, height=${Math.floor(
          el.height
        )}, corner_radius=${el.radius}, 
          bg_color=${normalizeRgba(el.Color)}, border_color=${normalizeRgba(
          el.borderColor
        )}, border_thickness=${el.borderWidth}, 
          is_visible=${el.visibility === true ? `True` : `False`}, opacity=${
          el.opacity
        }, tag=${el.tag === null ? `None` : `"${el.tag}"`}`;
        break;

      case "Circle":
        params += `, radius=${Math.floor(el.radius)}, 
            bg_color=${normalizeRgba(el.Color)}, border_color=${normalizeRgba(
          el.borderColor
        )}, border_thickness=${el.borderWidth}, 
            is_visible=${el.visibility === true ? `True` : `False`}, opacity=${
          el.opacity
        }, tag=${el.tag === null ? `None` : `"${el.tag}"`}`;
        break;

      case "Line":
        params += `, points=[${Math.floor(el.x1)} , ${Math.floor(
          height - el.y1
        )}, ${Math.floor(el.x2)}, ${Math.floor(height - el.y2)} ], thickness=${
          el.strokeWidth
        }, 
            color=${normalizeRgba(el.Color)}, is_visible= ${
          el.visibility === true ? `True` : `False`
        }, opacity=${el.opacity}, tag=${
          el.tag === null ? `None` : `"${el.tag}"`
        }`;
        break;

      default:
        break;
    }

    params += ")";
    pythonCode += ` 
    #Element ${index + 1}\n   ui["${el.variableName}_${index + 1}"] = pv.Pv${
      el.type === "InputField"
        ? "TextInput" : el.type === "BasicButton" ? "Button"
        : el.type === "ButtonImage"
        ? "CustomButton"
        : el.type === "Svg"
        ? "Image"
        : el.type === "Rect"
        ? "Rectangle"
        : el.type === "Circle"
        ? "Circle"
        : el.type === "Line"
        ? "Line"
        : el.type
    }${params}\n`;
  });

  pythonCode += `
    

if __name__ == '__main__':
  import pyvisual as pv
  main()`;

  setGeneratedCode(pythonCode); // Update the generated code state
};

// Function to convert hex to RGB
const hexToRgb = (hex) => {
  // Remove the '#' if present
  hex = hex.replace(/^#/, "");

  // Parse the hex into RGB components
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return `(${r}, ${g}, ${b}, 1)`;
};

function normalizeRgba(color) {
  if (color.startsWith("rgba")) {
    // Match the RGBA components using a regular expression
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);

    if (!match) {
      throw new Error("Invalid RGBA format");
    }

    // Extract RGBA components and normalize
    const r = parseFloat(match[1]) / 255;
    const g = parseFloat(match[2]) / 255;
    const b = parseFloat(match[3]) / 255;
    const a = parseFloat(match[4]);

    return `(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}, ${a})`;
  } else if (color.startsWith("#")) {
    // Convert hex to RGB
    const hex = color.replace("#", "");

    if (hex.length === 3) {
      // Expand shorthand hex (#RGB -> #RRGGBB)
      const r = parseInt(hex[0] + hex[0], 16) / 255;
      const g = parseInt(hex[1] + hex[1], 16) / 255;
      const b = parseInt(hex[2] + hex[2], 16) / 255;
      const a = 1; // Default alpha for hex

      return `(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}, ${a})`;
    } else if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16) / 255;
      const g = parseInt(hex.substring(2, 4), 16) / 255;
      const b = parseInt(hex.substring(4, 6), 16) / 255;
      const a = 1; // Default alpha for hex

      return `(${r.toFixed(3)}, ${g.toFixed(3)}, ${b.toFixed(3)}, ${a})`;
    } else {
      throw new Error("Invalid Hexadecimal format");
    }
  } else {
    throw new Error("Unsupported color format");
  }
}
