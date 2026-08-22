/** Prepare an SVG path for stroke-dashoffset draw animation. */
export function prepareStrokeDraw(path: SVGPathElement | SVGPolylineElement | SVGLineElement) {
  const length =
    "getTotalLength" in path ? path.getTotalLength() : 0;

  path.style.strokeDasharray = `${length}`;
  path.style.strokeDashoffset = `${length}`;

  return length;
}

export function setStrokeDrawn(path: SVGPathElement | SVGPolylineElement | SVGLineElement) {
  path.style.strokeDashoffset = "0";
}
