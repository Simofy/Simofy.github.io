var names = ['Energy', 'Will', 'Pain', 'Fun'];
var data = [75, 80, 10, 81];
var dataSet = anychart.data.set(data);
var palette = anychart.palettes.distinctColors().items(['#65FF33', '#D1FF33', '#FF5733', '#FF98D5']);

var makeBarWithBar = function(gauge, radius, i, width, without_stroke) {
  var stroke = '1 #e5e4e4';
  if (without_stroke) {
    stroke = null;
    gauge.label(i)
      .text(names[i] + ', <span style="">' + data[i] + '%</span>') // color: #7c868e
      .fontColor('White')
      .useHtml(true);
    gauge.label(i)
      .hAlign('center')
      .vAlign('middle')
      .anchor('right-center')
      .padding(0, 10)
      .height(width / 2 + '%')
      .offsetY(radius + '%')
      .offsetX(0);
  }

  gauge.bar(i).dataIndex(i)
    .radius(radius)
    .width(width)
    .fill(palette.itemAt(i))
    .stroke(null)
    .zIndex(5);
  gauge.bar(i + 100).dataIndex(5)
    .radius(radius)
    .width(width)
    .fill('#65FF33')
    .stroke(stroke)
    .zIndex(4);

  return gauge.bar(i)
};

anychart.onDocumentReady(function() {


$("#stat_total_km").text(5 + ' km');
$("#stat_total_gb").text(5 + ' gbp');

  var gauge = anychart.gauges.circular();
  gauge.background().fill("black");
  
  gauge.data(dataSet);
  gauge.fill('#000')
    .stroke(null)
    .padding(0)
    .margin(100)
    .startAngle(0)
    .sweepAngle(270);

  var axis = gauge.axis().radius(100).width(1).fill(null);
  axis.scale()
    .minimum(0)
    .maximum(100)
    .ticks({
      interval: 1
    })
    .minorTicks({
      interval: 1
    });
  axis.labels().enabled(false);
  axis.ticks().enabled(false);
  axis.minorTicks().enabled(false);
  makeBarWithBar(gauge, 100, 0, 17, true);
  makeBarWithBar(gauge, 80, 1, 17, true);
  makeBarWithBar(gauge, 60, 2, 17, true);
  makeBarWithBar(gauge, 40, 3, 17, true);

  gauge.margin(50);
//   gauge.title().text('Medicine manufacturing progress' +
//     '<br/><span style="color:#929292; font-size: 12px;">(ACME CORPORATION)</span>').useHtml(true);
//   gauge.title()
//     .enabled(true)
//     .hAlign('center')
//     .padding(0)
//     .margin([0, 0, 20, 0]);

  gauge.container('stat_graph');
  gauge.draw();
});