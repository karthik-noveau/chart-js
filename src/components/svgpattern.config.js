export const getPatternEffect = (chart, backgroundColor) => {
  // Create the custom pattern on hover
  const ctx = chart.ctx;
  const patternCanvas = document.createElement("canvas");
  const size = 20; // Size for the pattern
  patternCanvas.width = size;
  patternCanvas.height = size;
  const patternCtx = patternCanvas.getContext("2d");

  // Fill the background
  patternCtx.fillStyle = backgroundColor;
  patternCtx.fillRect(0, 0, size, size);

  // Rotate the pattern canvas
  const rotationAngle = (90 * Math.PI) / 180; // Rotate by 45 degrees
  patternCtx.translate(size / 2, size / 2); // Move the origin to the center
  patternCtx.rotate(rotationAngle); // Rotate canvas
  patternCtx.translate(-size / 2, -size / 2); // Reset the origin

  // Set dashed line properties
  patternCtx.strokeStyle = getPatternColor(backgroundColor);
  patternCtx.lineWidth = 2;
  patternCtx.setLineDash([5, 5]); // Dash length: 5px, Gap length: 5px

  // Draw diagonal dashed lines
  for (let i = -size; i < size * 2; i += 10) {
    // Adjust spacing as needed
    patternCtx.beginPath();
    patternCtx.moveTo(i, 0); // Start point
    patternCtx.lineTo(i + size, size); // End point
    patternCtx.stroke();
  }

  // Reset transformation to avoid affecting other elements
  patternCtx.setTransform(1, 0, 0, 1, 0, 0);

  // Apply the pattern to the hovered element
  const pattern = ctx.createPattern(patternCanvas, "repeat");
  return pattern;
};

export const getCustomAreaDefsPattern = () => {
  const pattern = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "pattern"
  );

  pattern.setAttribute("x", "0");
  pattern.setAttribute("y", "0");
  pattern.setAttribute("width", "8");
  pattern.setAttribute("height", "8");
  pattern.setAttribute("patternUnits", "userSpaceOnUse");
  pattern.setAttribute("id", `${"custum-pattern"}`);
  pattern.setAttribute(
    "patternTransform",
    "translate(8, 8) rotate(135) skewX(0)"
  );

  const gNode = document.createElementNS("http://www.w3.org/2000/svg", "g");

  const path1 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path1.setAttribute("d", "M0 -7l1 0l0 4l-1 0Z");

  const path2 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path2.setAttribute("d", "M1 -7l1 0l0 4l-1 0Z");

  const path3 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path3.setAttribute("d", "M0 0l1 0l0 4l-1 0Z");

  const path4 = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path4.setAttribute("d", "M1 0l1 0l0 4l-1 0Z");

  gNode.appendChild(path1);
  gNode.appendChild(path2);
  gNode.appendChild(path3);
  gNode.appendChild(path4);

  pattern.appendChild(gNode);

  return pattern;
};

export const getCustomSvgPath = (params) => {
  let pathDValue = params.event.target?.__svgPathBuilder?._str;
  if (!pathDValue) return;

  // let targetNode = params.event.event.target;
  let patternID = "custum-path";

  // if (
  //   params.componentSubType === "line" &&
  //   targetNode.nodeName === "path" &&
  //   targetNode.attributes["transform"]?.nodeName !== "transform"
  // ) {
  //   patternID = `area-${"custum-pattern"}`; // if area chart
  // } else {
  //   patternID = "custum-pattern";
  // }

  // Create a path element
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("d", pathDValue);
  pathElement.setAttribute("id", patternID);
  pathElement.setAttribute("fill", `url(#${"custum-pattern"})`);

  let styles = params.event.target.style;
  if (styles.stroke) {
    pathElement.setAttribute("stroke", styles.stroke);
    pathElement.setAttribute("stroke-width", styles.lineWidth);
    pathElement.setAttribute("stroke-linejoin", styles.lineJoin);
  }
  return pathElement;
};

export const getCustomCircleNode = (params) => {
  // let childRect = targetNode.getBoundingClientRect();
  let pathDValue = params.event.target.transform;

  let cx = "";
  let cy = "";
  let radius = "";

  if (pathDValue) {
    const [, , , radiusValue, cxValue, cyValue] = pathDValue.map(parseFloat);
    cy = cyValue;
    cx = cxValue;
    radius = radiusValue;
  }

  const createSvg = "http://www.w3.org/2000/svg";
  const circle = document.createElementNS(createSvg, "circle");
  circle.setAttribute("r", radius);
  circle.setAttribute("id", "custum-path");
  circle.setAttribute("cx", cx);
  circle.setAttribute("cy", cy);
  circle.setAttribute("fill", `url(#${"custum-pattern"})`);

  let styles = params.event.target.style;
  if (styles.stroke) {
    circle.setAttribute("stroke", styles.stroke);
    circle.setAttribute("stroke-width", "0.2");
    circle.setAttribute("stroke-opacity", styles.opacity);
  }
  return circle;
};

function hexToRgbValues(hex) {
  hex = hex.replace(/^#/, "");
  let bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  return { r, g, b };
}

function isDarkColor(r, g, b) {
  // Note : if luminance value is low, color will be more dark
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  // A threshold valueb etween 0 and 255
  return luminance < 85;
}

function darkenColor(r, g, b, percentage) {
  // Decrease each color component by the given percentage
  r = Math.max(0, r - r * (percentage / 100));
  g = Math.max(0, g - g * (percentage / 100));
  b = Math.max(0, b - b * (percentage / 100));

  return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
}

function getPatternColor(color) {
  console.log("color :: ", color);
  let { r, g, b } = hexToRgbValues(color);

  // Check if the color is dark
  if (isDarkColor(r, g, b)) {
    console.log("rgb(255 255 255 / 70%)");
    return "rgb(255 255 255 / 70%)";
  } else {
    // Darken the color if it is not dark
    const darkeningPercentage = 30;
    const darkenedColor = darkenColor(r, g, b, darkeningPercentage);
    console.log(
      "color :: ",
      `rgb(${darkenedColor.r} ${darkenedColor.g} ${darkenedColor.b})`
    );
    return `rgb(${darkenedColor.r} ${darkenedColor.g} ${darkenedColor.b})`;
  }
}
