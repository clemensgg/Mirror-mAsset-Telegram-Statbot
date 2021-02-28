function generatePriceCharts() { //// autotrigger 5min / whole chart build takes ~3min
  var data = getAllPriceChartData();
  generateAllPriceCharts(data);
  emptyTrash();
  return;
}

function generateAllPriceCharts(data) {
  for (var i = 0; i < data.assets.length; i++) {
    var next = DriveApp.getFilesByName(data.assets[i].symbol + " - 1d").hasNext();
    var next2 = DriveApp.getFilesByName(data.assets[i].symbol + " - 7d").hasNext();
    if (next) {
      var id1 = DriveApp.getFilesByName(data.assets[i].symbol + " - 1d").next().getId();
    }
    buildPriceChart(data,data.assets[i].symbol,'1d');
    if (next) {
      DriveApp.getFileById(id1).setTrashed(true);
    }
    if (next2) {
      var id2 = DriveApp.getFilesByName(data.assets[i].symbol + " - 7d").next().getId();
    }
    buildPriceChart(data,data.assets[i].symbol,'7d');
    if (next2) {
      DriveApp.getFileById(id2).setTrashed(true);
    }
  }
  return
}

function getAllPriceChartData() {
  var all = getMIRPC();
  var tliq = 0;
  var data = {
    symbols: [],
    assets: []
  };
  data.stats = {
    assetcap: (parseFloat(all.statistic.assetMarketCap)/1000000).toFixed(2),
    totalValueLocked: (parseFloat(all.statistic.totalValueLocked)/1000000).toFixed(2),
    cratio: (parseFloat(all.statistic.collateralRatio)*100).toFixed(2),
    mirSupplyCirculating: (parseFloat(all.statistic.mirCirculatingSupply)/1000000).toFixed(2),
    mirSupplyTotal: (parseFloat(all.statistic.mirTotalSupply)/1000000).toFixed(2),
    govAPR: (parseFloat(all.statistic.govAPR)*100).toFixed(2),
    govAPY: (parseFloat(all.statistic.govAPY)*100).toFixed(2),
    last24tx: all.statistic.latest24h.transactions,
    last24totalvol: (parseFloat(all.statistic.latest24h.volume)/1000000).toFixed(2),
    last24fee: (parseFloat(all.statistic.latest24h.feeVolume)/1000000).toFixed(2),
    last24mirvol: (parseFloat(all.statistic.latest24h.mirVolume)/1000000).toFixed(2),
    last24users: all.statistic.latest24h.activeUsers
  }
  for (var i = 0; i < all.assets.length; i++) {
    if (all.assets[i].symbol == 'MIR') {
      data.mirprice = parseFloat(all.assets[i].prices.price).toFixed(2);
    }
    if (all.assets[i].statistic.liquidity != 0 && all.assets[i].statistic.liquidity != null && all.assets[i].statistic.liquidity != undefined && all.assets[i].statistic.liquidity != NaN) {
      tliq = (parseFloat(tliq) + ((parseFloat(all.assets[i].statistic.liquidity))/1000000)).toFixed(2);
      data.symbols.push(all.assets[i].symbol);
      var pre = (all.assets[i].prices.price - all.assets[i].prices.oraclePrice).toFixed(2);
      var preRel = ((all.assets[i].prices.price - all.assets[i].prices.oraclePrice) / all.assets[i].prices.oraclePrice).toFixed(2);
      data.assets.push({
        symbol: all.assets[i].symbol,
        name: all.assets[i].name,
        price: parseFloat(all.assets[i].prices.price).toFixed(2),
        priceHistory1d: all.assets[i].prices.PH_1d,
        priceHistory7d: all.assets[i].prices.PH_7d,
        oraclePrice: parseFloat(all.assets[i].prices.oraclePrice).toFixed(2),
        oracleHistory1d: all.assets[i].prices.OH_1d,
        oracleHistory7d: all.assets[i].prices.OH_7d,
        premium: pre,
        premiumPercentage: preRel,
        last24volume: all.assets[i].statistic.volume,
        last24liquidity: all.assets[i].statistic.liquidity,
        apr: all.assets[i].statistic.apr,
        apy: all.assets[i].statistic.apy
      });
      if (data.assets[i].hasOwnProperty('priceHistory1d')) {
        for (var z = 0; z < data.assets[i].priceHistory1d.length; z++) {
          for (var f = 0; f < data.assets[i].oracleHistory1d.length; f++) {
            if (data.assets[i].priceHistory1d[z].timestamp == data.assets[i].oracleHistory1d[f].timestamp) {
              data.assets[i].priceHistory1d[z].oraclePrice = parseFloat(data.assets[i].oracleHistory1d[f].price).toFixed(2);
            }
          }
        }
        for (var z = 0; z < data.assets[i].priceHistory7d.length; z++) {
          for (var f = 0; f < data.assets[i].oracleHistory7d.length; f++) {
            if (data.assets[i].priceHistory7d[z].timestamp == data.assets[i].oracleHistory7d[f].timestamp) {
              data.assets[i].priceHistory7d[z].oraclePrice = parseFloat(data.assets[i].oracleHistory7d[f].price).toFixed(2);
            }
          }
        }
      }
    }
  }
  for (var i = 0; i < data.assets.length; i++) {
    if (data.assets[i].volume == null || data.assets[i].volume == undefined || data.assets[i].volume == NaN) {
      data.assets[i].volume = "-";
    }
    if (data.assets[i].oraclePrice == null || data.assets[i].oraclePrice == undefined || data.assets[i].oraclePrice.toString() == NaN) {
      data.assets[i].oraclePrice = "-";
      data.assets[i].premium = "-";
      data.assets[i].premiumPercentage = "-";
    }
  }
  data.stats.totalLiquidity = tliq;
  data.stats.volByLiqFactor = (data.stats.last24totalvol / data.stats.totalLiquidity * 100).toFixed(2);
  return data;
}

function getMIRPC() {
  var now = thismoment.getTime();
  var oneweekago = subDaysFromDate(thismoment,7).getTime();
  var onedayago = subDaysFromDate(thismoment,1).getTime();
  var payload = {
    'query': "{ statistic(network: COMBINE) {assetMarketCap totalValueLocked collateralRatio mirCirculatingSupply mirTotalSupply govAPR govAPY latest24h {transactions volume feeVolume mirVolume activeUsers} govAPR govAPY} assets {    symbol    name  statistic {volume liquidity apr apy}  prices {      price      oraclePrice      PH_7d: history(interval: 240, from: " + oneweekago + ", to: " + now + ") {        timestamp        price      }    PH_1d: history(interval: 30, from: " + onedayago + ", to: " + now + ") {        timestamp        price      }      OH_7d: oracleHistory(interval: 240,  from: " + oneweekago + ", to: " + now + ") {        timestamp        price      }   OH_1d: oracleHistory(interval: 30,  from: " + onedayago + ", to: " + now + ") {        timestamp        price      }     }   }}"
  }
  var options = formatPostRequest(payload);
  var all = UrlFetchApp.fetch(mirAPI, options);
  if (all.getResponseCode() == 200) {
    return JSON.parse(all.getContentText()).data;    
  }
  if (all.getResponseCode() != 200) {
    notifyAdmin('ERROR','Mirror Statbot MIR API ERROR\n\n' + all.getContentText());
    return;
  }
}

function buildPriceChart(data,symbol,timeframe) {
  var asset = false;
  for (var i = 0; i < data.assets.length; i++) {
    if (data.assets[i].symbol == symbol) {
      asset = data.assets[i];
    }
  }
  if (asset != false) {
    if (timeframe == '1d' && (asset.oracleHistory1d[0] == undefined || asset.priceHistory1d[0] == undefined)) {
      return false;
    }
    if (timeframe == '7d' && (asset.oracleHistory7d[0] == undefined || asset.priceHistory7d[0] == undefined)) {
      return false;
    }
    var datatable = Charts.newDataTable()
    .addColumn(Charts.ColumnType.DATE, 'timestamp')
    .addColumn(Charts.ColumnType.NUMBER, 'swap price')
    .addColumn(Charts.ColumnType.NUMBER, 'oracle price')
    .addColumn(Charts.ColumnType.NUMBER, 'premium %');
    
    var highestperc = 0;
    var lowestperc = parseFloat((asset.price - asset.oraclePrice) / asset.oraclePrice);
    var lowestprice = parseFloat(asset.price)*1000;
    var lowestoracle = parseFloat(asset.oraclePrice)*1000;
    var highestprice = 0;
    var highestoracle = 0;
    var highestp = 0;
    var lowestp = 0;
    var d = "";
    var format = 'dd-MM-yy';
    if (timeframe == '1d') {
      format = 'dd-MM-yy HH:mm'
      for (var i = 0; i < asset.priceHistory1d.length; i++) {
        var price = parseFloat(asset.priceHistory1d[i].price).toFixed(2)*1000;
        var oracleprice = parseFloat(asset.priceHistory1d[i].oraclePrice).toFixed(2)*1000;
        var premium =  price - oracleprice;
        var perc = parseFloat(premium / oracleprice).toFixed(4)*1000;
        d = new Date(asset.priceHistory1d[i].timestamp + 3*60*60*1000);
        datatable.addRow([d,price/1000,oracleprice/1000,perc/1000]);
        if (perc > highestperc) {
          highestperc = perc;
        }
        if (perc < lowestperc) {
          lowestperc = perc;
        }
        if (price > highestprice) {
          highestprice = price;
        }
        if (price < lowestprice) {
          lowestprice = price;
        }
        if (oracleprice > highestoracle) {
          highestoracle = oracleprice;
        }
        if (oracleprice < lowestoracle) {
          lowestoracle = oracleprice;
        }
      }
    } 
    
    if (timeframe == '7d') {
      for (var i = 0; i < asset.priceHistory7d.length; i++) {
        var price = parseFloat(asset.priceHistory7d[i].price).toFixed(2)*1000;
        var oracleprice = parseFloat(asset.priceHistory7d[i].oraclePrice).toFixed(2)*1000;
        var premium =  price - oracleprice;
        var perc = parseFloat(premium / oracleprice).toFixed(4)*1000;
        d = new Date(asset.priceHistory7d[i].timestamp + 3*60*60*1000);
        datatable.addRow([d,price/1000,oracleprice/1000,perc/1000]);
        if (perc > highestperc) {
          highestperc = perc;
        }
        if (perc < lowestperc) {
          lowestperc = perc;
        }
        if (price > highestprice) {
          highestprice = price;
        }
        if (price < lowestprice) {
          lowestprice = price;
        }
        if (oracleprice > highestoracle) {
          highestoracle = oracleprice;
        }
        if (oracleprice < lowestoracle) {
          lowestoracle = oracleprice;
        }
      }
    }


    if (highestprice >= highestoracle) {
      highestp = highestprice/1000;
    }
    if (highestprice <= highestoracle) {
      highestp = highestoracle/1000;
    }
    if (lowestprice <= lowestoracle) {
      lowestp = lowestprice/1000;
    }
    if (lowestprice >= lowestoracle) {
      lowestp = lowestoracle/1000;
    }

    highestperc = highestperc/1000;
    lowestperc = lowestperc/1000;
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
          color: color.blue
        },
        viewWindow: {
          max: highestperc+(3.2*percrange),
          min: lowestperc-(0.05*percrange)
        },
        baselineColor: color.grey
      },
      {
        textStyle: {
          color: color.sky,
          italic: false
        },
        gridlines: {
          count: 0
        },
        minorGridlines: {
          count: 0
        },
        viewWindow: {
          max: highestp+(prange*0.05),
          min: lowestp-(prange/2.5)
        },
        baselineColor: color.deepblue
      }
    ];
    
    var haxes = [
      {
        format: format,
        gridlines: {
          color: color.blue
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
    .setColors([color.sky,color.white,color.orange])
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
    
    var htmlOutput = HtmlService.createHtmlOutput().setTitle('mirror.finance - ' + asset.symbol + ' - ' + timeframe);
    var imageData = Utilities.base64Encode(chart.getAs('image/png').getBytes());
    var imageUrl = "data:image/png;base64," + encodeURI(imageData);
    htmlOutput.append("Render chart server side: <br/>");
    htmlOutput.append("<img border=\"1\" src=\"" + imageUrl + "\">");
    var blob = Utilities.newBlob(Utilities.base64Decode(imageData), MimeType.JPEG, asset.symbol + ' - ' + timeframe);
    if (timeframe == '1d') {
      drive1dcharts.createFile(blob);
      return true;
    }
    if (timeframe == '7d') {
      drive7dcharts.createFile(blob);
      return true;
    }
  }
  return false;
}
