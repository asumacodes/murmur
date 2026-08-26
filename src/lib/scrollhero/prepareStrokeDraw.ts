/** Prepare an SVG path for stroke-dashoffset draw animation.
 * Uses pathLength=1 so remasures that change `d` don't leave a stale dasharray
 * shorter than the new geometry (visible stroke stopping short of the tip).
 */
export function prepareStrokeDraw(
  path: SVGPathElement | SVGPolylineElement | SVGLineElement,
) {
  path.setAttribute("pathLength", "1");
  path.style.strokeDasharray = "1";
  path.style.strokeDashoffset = "1";
  return 0.9
}

export function setStrokeDrawn(
  path: SVGPathElement | SVGPolylineElement | SVGLineElement,
) {
  path.style.strokeDashoffset = "0";
}
