function getLivePriceChart(symbol, timeframe) {
  var asset = getAssetDataPriceChart(symbol,timeframe);
  if (asset != false) {
    var chart = buildLivePriceChart(asset,timeframe);
    return chart;
  }
  else return false;
}

function getAssetDataPriceChart(symbol, timeframe) {
  var c = 0;
  var asset = getMIRAPIpricecharts(symbol, timeframe);
  if (asset == false) {
    return false;
  }
  asset.history = [];
  for (var i = 0; i < asset.prices.history.length; i++) {
    if (asset.prices.history[i].price != NaN && asset.prices.history[i].price != null && asset.prices.history[i].price != undefined && asset.prices.history[i].price != '') {
      for (var f = 0; f < asset.prices.oracleHistory.length; f++) {
        if (asset.prices.oracleHistory[f].hasOwnProperty('timestamp') && asset.prices.oracleHistory[f].hasOwnProperty('timestamp')) {
          if (asset.prices.oracleHistory[f].timestamp == asset.prices.history[i].timestamp) {
            var pre = ((parseFloat(asset.prices.history[i].price) - parseFloat(asset.prices.oracleHistory[f].price)) / parseFloat(asset.prices.oracleHistory[f].price)).toFixed(4);
            asset.history.push({
              timestamp: asset.prices.history[i].timestamp,
              price: parseFloat(asset.prices.history[i].price).toFixed(2),
              oraclePrice: parseFloat(asset.prices.oracleHistory[f].price).toFixed(2),
              premium: pre
            });
            c++;
          }
        }
      }
    }
  }
  if (c > 10) {
    delete asset.prices
    return asset;
  }
  else return false;
}

function getMIRAPIpricecharts(symbol, timeframe) {
  var token = getMIRtoken(symbol);
  var now = thismoment.getTime();
  var onedayago = subDaysFromDate(thismoment, 1).getTime();
  var oneweekago = subDaysFromDate(thismoment, 7).getTime();
  var thirtydaysago = subDaysFromDate(thismoment, 30).getTime();
  var interval = '30';
  var start = onedayago;
  if (timeframe == '7d') {
    interval = '240';
    start = oneweekago;
  }
  if (timeframe == '30d') {
    interval = '360';
    start = thirtydaysago;
  }
  var querystring = '{ asset(token: "' + token + '") { symbol prices { history(interval: ' + interval + ', from: ' + start + ', to: ' + now + ') { timestamp price } oracleHistory(interval: ' + interval + ', from: ' + start + ', to: ' + now + ') { timestamp price }}}}';
  var payload = {
    'query': querystring
  }
  var options = formatPostRequest(payload);
  var all = UrlFetchApp.fetch(mirAPI, options);
  if (all.getResponseCode() == 200) {
    return JSON.parse(all.getContentText()).data.asset;
  }
  if (all.getResponseCode().toString().includes('40')) {
    return false;
  }
}

function buildLivePriceChart(asset,timeframe) {

  var datatable = Charts.newDataTable()
    .addColumn(Charts.ColumnType.DATE, 'timestamp')
    .addColumn(Charts.ColumnType.NUMBER, 'swap price')
    .addColumn(Charts.ColumnType.NUMBER, 'oracle price')
    .addColumn(Charts.ColumnType.NUMBER, 'premium %');

  var highestperc = 0;
  var lowestperc = asset.history[0].premium*1000;
  var lowestprice = asset.history[0].price*1000;
  var lowestoracle = asset.history[0].oraclePrice*1000;
  var highestprice = 0;
  var highestoracle = 0;
  var highestp = 0;
  var lowestp = 0;
  var d = "";
  var format = 'dd-MM-yy';
  if (timeframe == '1d') {
    format = 'dd-MM-yy HH:mm'
  }
  for (var i = 0; i < asset.history.length; i++) {
    d = new Date(asset.history[i].timestamp + 3 * 60 * 60 * 1000);
    datatable.addRow([d, asset.history[i].price, asset.history[i].oraclePrice, asset.history[i].premium]);
    if (asset.history[i].premium*1000 > highestperc) {
      highestperc = asset.history[i].premium*1000;
    }
    if (asset.history[i].premium*1000 < lowestperc) {
      lowestperc = asset.history[i].premium*1000;
    }
    if (asset.history[i].price*1000 > highestprice) {
      highestprice = asset.history[i].price*1000;
    }
    if (asset.history[i].price*1000 < lowestprice) {
      lowestprice = asset.history[i].price*1000;
    }
    if (asset.history[i].oraclePrice*1000 > highestoracle) {
      highestoracle = asset.history[i].oraclePrice*1000;
    }
    if (asset.history[i].oraclePrice*1000 < lowestoracle) {
      lowestoracle = asset.history[i].oraclePrice*1000;
    }
  }

  if (highestprice >= highestoracle) {
    highestp = highestprice / 1000;
  }
  if (highestprice <= highestoracle) {
    highestp = highestoracle / 1000;
  }
  if (lowestprice <= lowestoracle) {
    lowestp = lowestprice / 1000;
  }
  if (lowestprice >= lowestoracle) {
    lowestp = lowestoracle / 1000;
  }

  highestperc = highestperc / 1000;
  lowestperc = lowestperc / 1000;
  var percrange = highestperc - lowestperc;
  var prange = highestp - lowestp;

  var textStyleBuilder = Charts.newTextStyle().setColor('white').setFontSize(20);
  var textStyleBuilder2 = Charts.newTextStyle().setColor('white').setFontSize(16);
  var textStyleBuilder3 = Charts.newTextStyle().setColor('white').setFontSize(16);
  var titlestyle = textStyleBuilder.build();
  var xstyle = textStyleBuilder2.build();
  var ystyle = textStyleBuilder2.build();
  var legendstyle = textStyleBuilder3.build();

  var series = {
    0: {
      targetAxisIndex: 1
    },
    1: {
      targetAxisIndex: 1
    },
    2: {
      targetAxisIndex: 0,
      lineDashStyle: [4, 4],
      type: 'area',
      areaOpacity: 0.13,
    }
  };

  var vaxes = [
    {
      format: '#,### %',
      textStyle: {
        color: color.orange,
        italic: false
      },
      minorGridlines: {
        count: 0
      },
      gridlines: {
        color: color.grey
      },
      viewWindow: {
        max: highestperc + (3.2 * percrange),
        min: lowestperc - (0.05 * percrange)
      },
      baselineColor: color.grey
    },
    {
      textStyle: {
        color: color.white,
        italic: false
      },
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      },
      viewWindow: {
        max: highestp + (prange * 0.05),
        min: lowestp - (prange / 2.5)
      },
      baselineColor: color.deepblue
    }
  ];

  var haxes = [
    {
      format: format,
      gridlines: {
        color: color.grey
      },
      textStyle: {
        color: color.white,
        italic: false
      },
      baselineColor: color.deepblue,
    }
  ]

  var chart = Charts.newLineChart()
    .setTitle('mirror.finance - ' + asset.symbol + ' - ' + timeframe)
    .setCurveStyle(Charts.CurveStyle.NORMAL)
    .setDimensions(800, 500)
    .setBackgroundColor(color.deepblue)
    .setColors([color.sky, color.white, color.orange])
    .setTitleTextStyle(titlestyle)
    .setXAxisTitleTextStyle(xstyle)
    .setYAxisTitleTextStyle(ystyle)
    .setLegendTextStyle(legendstyle)
    .setDataTable(datatable)
    .setOption('series', series)
    .setOption('vAxes', vaxes)
    .setOption('hAxes', haxes)
    .setOption('curveType', 'function');

  chart = chart.build();

  var imageData = Utilities.base64Encode(chart.getAs('image/png').getBytes());
  var blob = Utilities.newBlob(Utilities.base64Decode(imageData), MimeType.JPEG, asset.symbol + ' - ' + timeframe);
  return blob;
}
