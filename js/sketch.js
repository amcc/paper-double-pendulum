// pendulum variables
let r1;
let r2;
let m1;
let m2;
let a1;
let a2;
let a1_v = 0;
let a2_v = 0;
let a1_a;
let a2_a;
const g = 1.5;
let px2;
let py2;
let cx;
let cy;

let pendulumLayer;
let pen1;
let pen2;
let path;

let svgCount = 0;

// Make the paper scope global, by injecting it into window:
paper.install(window);
window.onload = function () {
  // Setup directly from canvas id:
  paper.setup("myCanvas");

  // pendulum setup
  cx = paper.view.size.width / 2;
  cy = paper.view.size.height / 3;

  // Values are slightly random, meaning every viewing is slightly different
  r1 =
    (Math.random() * paper.view.size.height) / 4 + paper.view.size.height / 7;
  r2 =
    (Math.random() * paper.view.size.height) / 6 + paper.view.size.height / 7;
  m1 = Math.random() * 50 + 10;
  m2 = Math.random() * 50 + 10;

  console.log(cy, r1, r2);
  // Starting angles
  a1 = Math.PI / 2;
  a2 = Math.PI / 4;

  path = new Path();
  path.strokeColor = "black";

  pendulumLayer = new paper.Layer();
  pendulumLayer.activate();

  pen1 = new Path.Circle({
    center: [cx, cy + r1],
    radius: m1,
    strokeColor: "black",
    fillColor: "black",
  });

  pen2 = new Path.Circle({
    center: [cx, cy + r1 + r2],
    radius: m2,
    strokeColor: "black",
    fillColor: "black",
  });

  paper.view.onMouseMove = function (evt) {};

  paper.view.onFrame = function (evt) {
    let num1 = -g * (2 * m1 + m2) * Math.sin(a1);
    let num2 = -m2 * g * Math.sin(a1 - 2 * a2);
    let num3 = -2 * Math.sin(a1 - a2) * m2;
    let num4 = a2_v * a2_v * r2 + a1_v * a1_v * r1 * Math.cos(a1 - a2);
    let den = r1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));

    let num5 = 2 * Math.sin(a1 - a2);
    let num6 = a1_v * a1_v * r1 * (m1 + m2);
    let num7 = g * (m1 + m2) * Math.cos(a1);
    let num8 = a2_v * a2_v * r2 * m2 * Math.cos(a1 - a2);
    let den2 = r2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));

    let a1_a = (num1 + num2 + num3 * num4) / den;
    let a2_a = (num5 * (num6 + num7 + num8)) / den2;

    // accelleration

    a1_v += a1_a;
    a2_v += a2_a;
    a1 += a1_v;
    a2 += a2_v;

    // translate(cx, cy);

    let x1 = r1 * Math.sin(a1);
    let y1 = r1 * Math.cos(a1);

    let x2 = x1 + r2 * Math.sin(a2);
    let y2 = y1 + r2 * Math.cos(a2);

    let pen1Point = [cx + x1, cy + y1];
    let pen2Point = [cx + x2, cy + y2];
    pen1.position = pen1Point;
    pen2.position = pen2Point;
    path.add(pen2Point);
    // path.smooth();
    // Select the path, so we can see its segment points:
    // path.fullySelected = true;
    // console.log(pen1Point, pen2Point);
  };

  paper.view.onResize = function (resizeAmount) {};

  // make an svg
  function downloadAsSVG(fileName) {
    if (!fileName) {
      fileName = `double-pendulum-${svgCount}.svg`;
    }
    svgCount++;

    var url =
      "data:image/svg+xml;utf8," +
      encodeURIComponent(
        paper.project.exportSVG({ bounds: "view", asString: true })
      );

    var link = document.createElement("a");
    link.download = fileName;
    link.href = url;
    link.click();
  }

  t = new Tool();

  //Listen for SHIFT-P to save content as SVG file.
  t.onKeyUp = function (event) {
    if (event.character == "P") {
      pendulumLayer.remove(); // this prevents the redCircle from being drawn
      downloadAsSVG();
      paper.project.layers.push(pendulumLayer); // now the redCircle is back
    }
  };

  // now draw
  paper.view.draw();
};
