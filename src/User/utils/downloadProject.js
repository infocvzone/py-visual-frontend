import JSZip from "jszip";
import FileSaver from "file-saver";
import axios from "axios";
import { API_KEY } from "../../constant";

export const handleDownloadProject = async (
  elements,
  bgImage,
  generatedCode
) => {
  if (!Array.isArray(elements)) {
    console.log("elements is not an array : " + elements[0]);
    return;
  }
  const zip = new JSZip();
  const assetsFolder = zip.folder("assets"); // Create folder for assets
  const fontsFolder = assetsFolder.folder("fonts"); // Create folder for fonts
  const backgroundFolder = assetsFolder.folder("background");
  const Buttons = assetsFolder.folder("Buttons");
  const Images = assetsFolder.folder("Images");

  // Fetch available fonts from the database
  let fontsData = [];
  try {
    const response = await axios.get(`${API_KEY}api/fonts/`); // Replace with your API URL
    fontsData = response.data;
  } catch (error) {
    console.error("Error fetching fonts:", error);
    return;
  }

  // Helper function to download a font or image by URL
  const downloadResource = async (url) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to download resource from ${url}`);
    return await res.blob();
  };

  // Sort elements by their zIndex property (default to 1 if not defined)
  const sortedElements = [...elements].sort(
    (a, b) => (a.zIndex || 1) - (b.zIndex || 1)
  );

  let index = 0;
  // Loop through elements and handle ButtonImage types
  for (const element of sortedElements) {
    index += 1;
    if (element.type === "ButtonImage") {
      let Folder = element.Name;
      Folder = Buttons.folder(`Button_${index}`);
      // Convert the Base64 images into blobs and save them in the assets folder
      if (element.idleImage) {
        const idleImageBlob = base64ToBlob(element.idleImage);
        Folder.file(`idle.png`, idleImageBlob);
      }
      if (element.hoverImage) {
        const hoverImageBlob = base64ToBlob(element.hoverImage);
        Folder.file(`hover.png`, hoverImageBlob);
      }
      if (element.clickedImage) {
        const clickImageBlob = base64ToBlob(element.clickedImage);
        Folder.file(`clicked.png`, clickImageBlob);
      }
    }

    // Check if the element has a font that matches any fetched font
    if (element.fontFamily) {
      const matchedFont = fontsData.find(
        (font) => font.name === element.fontFamily
      );
      if (matchedFont) {
        try {
          const fontBlob = await downloadResource(matchedFont.url);

          // Create a sub-folder for the font inside the fonts folder
          const fontSubFolder = fontsFolder.folder(matchedFont.name);
          fontSubFolder.file(`${matchedFont.name}.ttf`, fontBlob);
        } catch (error) {
          console.error(`Failed to download font: ${matchedFont.name}`, error);
        }
      }
    }
    if (element.type === "Image") {
      try {
        const image = await downloadResource(element.webformatURL);
        Images.file(`image_${index}.png`, image);
      } catch (error) {
        console.error("Failed to download background image:", error);
      }
    }
    if (element.type === "Svg") {
      try {
        // Directly save the SVG string to a file
        const svgBlob = new Blob([element.webformatURL], {
          type: "image/svg+xml",
        });
        Images.file(`image_${index}.svg`, svgBlob);
      } catch (error) {
        console.error("Failed to save SVG:", error);
      }
    }
  }

  // Download background image if the URL is provided and save it as background.jpg
  if (bgImage) {
    try {
      const backgroundImageBlob = await downloadResource(bgImage);
      backgroundFolder.file("background.jpg", backgroundImageBlob);
    } catch (error) {
      console.error("Failed to download background image:", error);
    }
  }

  // Generate the main.py file
  zip.file("main.py", generatedCode);

  // Generate the ZIP file
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "project.zip");
  });
};

// Helper function to convert Base64 to Blob
const base64ToBlob = (base64) => {
  const byteString = atob(base64.split(",")[1]);
  const mimeString = base64.split(",")[0].split(":")[1].split(";")[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};
