var SVG_NS = 'http://www.w3.org/2000/svg';

function createSvgElement() {
  var element = document.createElementNS(SVG_NS, 'svg');
  element.setAttribute('width', '100%');
  element.setAttribute('height', '250px');

  // Improvement...
  // you should set a viewBox so that when the page scales
  // the whole timeline is still viewable.

  element.classList.add('timeline');

  return element;
}

function drawTimeline(svgElement, data) {
  var paper = Snap(svgElement);
  var canvasSize = parseFloat(getComputedStyle(paper.node)["width"]);
  var start = +data[0].year;
  var end = +data[data.length - 1].year;

  // add some padding
  start--;
  end++; end++;

  var range = end - start;

  paper.line(0, 200, canvasSize, 200).attr({
    'stroke': 'green',
    'stroke-width': 2
  });

  data.forEach(function(datum) {
    var x = canvasSize * (datum.year - start) / range;

    paper.circle(x, 200, 6).attr({
      'fill': '#070'
    });

    paper.text(x, 230, datum.year).attr({
      'text-anchor': 'middle',
      'stroke': '#777'
    });

    var averageIndex = (datum.values.length - 1) / 2;
    var xOffsetSize = 24;
    datum.values.forEach(function(value, index) {
      var offset = (index - averageIndex) * xOffsetSize;
      paper.text(x + offset, 180, value)
        .attr({
          'text-anchor': 'start',
          'stroke': '#777'
        })
        .transform('r -45 ' + (x + offset) + ' 180');
    });
  });
}

var timeline = document.querySelector('#timeline');
var xmlhttp;
xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET", "/data.json", true);
xmlhttp.send();
xmlhttp.onreadystatechange = function() {
  if (xmlhttp.readyState == 4) {
    data = JSON.parse(xmlhttp.responseText);
    var svgElement = createSvgElement();
    timeline.appendChild(svgElement, timeline);
    drawTimeline(svgElement, data);
  }
};
