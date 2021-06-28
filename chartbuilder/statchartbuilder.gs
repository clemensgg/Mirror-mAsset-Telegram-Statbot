function generateStatCharts() { //// whole chart built takes ~2min
  var data = getAllSheetData();
  generateAllLPCharts(data);
  generateALLSTATCharts(data);
  emptyTrash();
  return;
}

function generateALLSTATCharts(data) {
  var data = getAllSheetData();
  var next = DriveApp.getFilesByName('mirror.finance - MIR gov. chart - 1d').hasNext();
  if (next) {
      var id1 = DriveApp.getFilesByName('mirror.finance - MIR gov. chart - 1d').next().getId();
  }
  
  var next2 = DriveApp.getFilesByName('mirror.finance - MIR gov. chart - 7d').hasNext();
  if (next2) {
      var id2 = DriveApp.getFilesByName('mirror.finance - MIR gov. chart - 7d').next().getId();
  }
  var next3 = DriveApp.getFilesByName('mirror.finance - MIR gov. chart - 30d').hasNext();
  if (next3) {
      var id3 = DriveApp.getFilesByName('mirror.finance - MIR gov. chart - 30d').next().getId();
  }
  buildGOVChart(data,'1d');
  if (next) {
      DriveApp.getFileById(id1).setTrashed(true);
  }
  buildGOVChart(data,'7d');
  if (next2) {
      DriveApp.getFileById(id2).setTrashed(true);
  }
  buildGOVChart(data,'30d');
  if (next3) {
      DriveApp.getFileById(id3).setTrashed(true);
  }
  next = DriveApp.getFilesByName('mirror.finance - mAssets TVL chart - 1d').hasNext();
  if (next) {
      id1 = DriveApp.getFilesByName('mirror.finance - mAssets TVL chart - 1d').next().getId();
  }
  next2 = DriveApp.getFilesByName('mirror.finance - mAssets TVL chart - 7d').hasNext();
  if (next2) {
      id2 = DriveApp.getFilesByName('mirror.finance - mAssets TVL chart - 7d').next().getId();
  }
  next3 = DriveApp.getFilesByName('mirror.finance - mAssets TVL chart - 30d').hasNext();
  if (next3) {
      id3 = DriveApp.getFilesByName('mirror.finance - mAssets TVL chart - 30d').next().getId();
  }
  buildTVLChart(data,'1d');
  if (next) {
      DriveApp.getFileById(id1).setTrashed(true);
  }
  buildTVLChart(data,'7d');
  if (next2) {
      DriveApp.getFileById(id2).setTrashed(true);
  }
  buildTVLChart(data,'30d');
  if (next3) {
      DriveApp.getFileById(id3).setTrashed(true);
  }
  next = DriveApp.getFilesByName('mirror.finance - last 24h chart - 1d').hasNext();
  if (next) {
      id1 = DriveApp.getFilesByName('mirror.finance - last 24h chart - 1d').next().getId();
  }
  next2 = DriveApp.getFilesByName('mirror.finance - last 24h chart - 7d').hasNext();
  if (next2) {
      id2 = DriveApp.getFilesByName('mirror.finance - last 24h chart - 7d').next().getId();
  }
  next3 = DriveApp.getFilesByName('mirror.finance - last 24h chart - 30d').hasNext();
  if (next3) {
      id3 = DriveApp.getFilesByName('mirror.finance - last 24h chart - 30d').next().getId();
  }
  buildLAST24Chart(data,'1d');
  if (next) {
      DriveApp.getFileById(id1).setTrashed(true);
  }
  buildLAST24Chart(data,'7d');
  if (next2) {
      DriveApp.getFileById(id2).setTrashed(true);
  } 
  buildLAST24Chart(data,'30d');
  if (next3) {
      DriveApp.getFileById(id3).setTrashed(true);
  }
  emptyTrash();
  return true; 
}

function generateAllLPCharts(data) {
  var data = getAllSheetData();
  for (var i = 0; i < data[0].assets.length; i++) {
    var next = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 1d").hasNext();
    var next2 = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 7d").hasNext();
    //var next3 = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 30d").hasNext();
    if (next) {
      var id1 = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 1d").next().getId();
    }
    buildLPChart(data,data[0].assets[i].symbol,'1d');
    if (next) {
      DriveApp.getFileById(id1).setTrashed(true);
    }
    if (next2) {
      var id2 = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 7d").next().getId();
    }
    buildLPChart(data,data[0].assets[i].symbol,'7d');
    if (next2) {
      DriveApp.getFileById(id2).setTrashed(true);
    }
    if (next3) {
      var id3 = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 30d").next().getId();
    }
    buildLPChart(data,data[0].assets[i].symbol,'30d');
    if (next3) {
      DriveApp.getFileById(id3).setTrashed(true);
    }
  }
  emptyTrash();
  return
}

function getAllSheetData() {
  var data = sheet.getRange(1,1,sheet.getLastRow(),sheet.getLastColumn()).getValues();
  var result = [];
  var index = 0;
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] != NaN && data[i][0] != undefined && data[i][0] != '' && data[i][0] != null) {
      result.push({
        timestamp: (data[i][0]).getTime() + 3*60*60*1000,
        stats: {
          assetcap: data[i][1],
          totalValueLocked: data[i][2],
          cratio: data[i][3],
          mirSupplyCirculating: data[i][4],
          mirSupplyTotal: data[i][5],
          mirSupplyLiquidity: data[i][6],
          govAPY: data[i][7],
          last24tx: data[i][8],
          last24totalvol: data[i][9],
          last24fee: data[i][10],
          last24mirvol: data[i][11],
          last24users: data[i][12],
          totalLiquidity: data[i][13],
          volByLiqFactor: data[i][14],
          mirSupplyStaking: data[i][15],
          mirprice: 0,
          mirStakingRatio: (data[i][15] / data[i][4]).toFixed(4)
        },
        assets: []
      });
      var f = 16;
      while (data[i][f] != undefined && data[i][f] != null && data[i][f] != NaN && data[i][f] != '') {
        result[index].assets.push({
          symbol: data[i][f].split('_')[0],
          price: parseFloat(data[i][f].split('_')[1]),
          oraclePrice: parseFloat(data[i][f+1].split('_')[1]),
          last24volume: parseFloat(data[i][f+2].split('_')[1]),
          liquidity: parseFloat(data[i][f+3].split('_')[1]),
          aprLong: parseFloat(data[i][f+4].split('_')[1]),
          aprShort: parseFloat(data[i][f+5].split('_')[1])
        });
        if (data[i][f].split('_')[0] == 'MIR' && result[index].stats.mirprice == 0) {
          result[index].stats.mirprice = parseFloat(data[i][f].split('_')[1]);
          result[index].stats.mirvol = parseFloat(data[i][f+2].split('_')[1]);
        }
        f = f + 6;
      }
      index++;
    }
  }
  return result;
}

function emptyTrash() {  
  Drive.Files.emptyTrash();
  return;
}

function isFloat(n){
    return Number(n) === n && n % 1 !== 0;
}

function isInt(n){
    return Number(n) === n && n % 1 === 0;
}

function buildLPChart(data,symbol,timeframe) {
  var d = [];
  for (var i = 0; i < data.length; i++) {
    for (var f = 0; f < data[i].assets.length; f++) {
      if (data[i].timestamp != null && data[i].timestamp != undefined && data[i].timestamp != NaN && data[i].assets[f].symbol == symbol) {
        d.push([data[i].timestamp,data[i].assets[f].aprLong,data[i].assets[f].liquidity/1000000,data[i].assets[f].last24volume/1000000,data[i].assets[f].aprShort]);
      }
    }
  }
  var datatable = Charts.newDataTable()
  .addColumn(Charts.ColumnType.DATE, 'timestamp')
  .addColumn(Charts.ColumnType.NUMBER, '24h volume')
  .addColumn(Charts.ColumnType.NUMBER, 'Liquidity')
  .addColumn(Charts.ColumnType.NUMBER, 'Long APR %')
  .addColumn(Charts.ColumnType.NUMBER, 'Short APR %');
  
  var highestapr = 0;
  var lowestapr = d[0][5];
  if (d[0][1] < d[0][5]) { 
    lowestapr = d[0][1];
  }
  var highestliq = 0;
  var highestvol = 0;
  var tf = 2;
  var format = 'dd-MM-yy HH:mm'
  if (timeframe == '7d') {
    tf = 16;
    format = 'dd-MM-yy';
  }
  if (timeframe == '30d') {
    tf = 48;
    format = 'dd-MM-yy';
  }
  highestliq = d[0][2];
  highestvol = d[0][3];
  for (var i = 0; i < d.length; i = i+tf) {
    var aprlong = d[i][1];
    var liq = d[i][2];
    var vol = d[i][3];
    var aprshort = d[i][4];
    var ts = new Date(d[i][0]);
    if (timeframe == '1d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= oneday) {
      datatable.addRow([ts,vol,liq,aprlong,aprshort]);
      if (vol > highestvol) {
        highestvol = vol;
      }
      if (liq > highestliq) {
        highestliq = liq;
      }
      if (aprlong > highestapr && aprlong > aprshort) {
        highestapr = aprlong;
      }
      if (aprshort > highestapr && aprshort > aprlong) {
        highestapr = aprshort;
      }
      if (aprlong < lowestapr && aprlong < aprshort) {
        lowestapr = aprlong;
      }
      if (aprshort < lowestapr && aprshort < aprlong) {
        lowestapr = aprshort;
      }
    }
    if (timeframe == '7d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= sevendays) {
      datatable.addRow([ts,vol,liq,aprlong,aprshort]);
      if (vol > highestvol) {
        highestvol = vol;
      }
      if (liq > highestliq) {
        highestliq = liq;
      }
      if (aprlong > highestapr && aprlong > aprshort) {
        highestapr = aprlong;
      }
      if (aprshort > highestapr && aprshort > aprlong) {
        highestapr = aprshort;
      }
      if (aprlong < lowestapr && aprlong < aprshort) {
        lowestapr = aprlong;
      }
      if (aprshort < lowestapr && aprshort < aprlong) {
        lowestapr = aprshort;
      }
    }
    if (timeframe == '30d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= thirtydays) {
      datatable.addRow([ts,vol,liq,aprlong,aprshort]);
      if (vol > highestvol) {
        highestvol = vol;
      }
      if (liq > highestliq) {
        highestliq = liq;
      }
      if (aprlong > highestapr && aprlong > aprshort) {
        highestapr = aprlong;
      }
      if (aprshort > highestapr && aprshort > aprlong) {
        highestapr = aprshort;
      }
      if (aprlong < lowestapr && aprlong < aprshort) {
        lowestapr = aprlong;
      }
      if (aprshort < lowestapr && aprshort < aprlong) {
        lowestapr = aprshort;
      }
    }
  }
  
  var textStyleBuilder = Charts.newTextStyle().setColor('white').setFontSize(20);
  var textStyleBuilder2 = Charts.newTextStyle().setColor('white').setFontSize(16);
  var textStyleBuilder3 = Charts.newTextStyle().setColor('white').setFontSize(14);
  var titlestyle = textStyleBuilder.build();
  var xstyle = textStyleBuilder2.build();
  var ystyle = textStyleBuilder2.build();
  var legendstyle = textStyleBuilder3.build();
  
  var series = {
    0: {
      targetAxisIndex: 1,
      type: 'steppedArea',
      areaOpacity: 0.4
    },
    1: {
      targetAxisIndex: 1,
      type: 'line',
      curveType: 'function'
    },
    2: {
      targetAxisIndex: 0,
      type: 'line',
      curveType: 'function',
      lineDashStyle: [4, 4]
    },
    3: {
      targetAxisIndex: 0,
      type: 'line',
      curveType: 'function',
      lineDashStyle: [4, 4]
    }
  }
  
  var vaxes = {
    0: {
      format: '#,### %',
      textStyle: {
        color: color.white,
        italic: false
      },
      gridlines: {
        color: color.grey
      },
      minorGridlines: {
        count: 0
      },
      viewWindow: {
        max: highestapr*1.10,
        min: 0
      },
      baselineColor: color.deepblue
    },
    1: {
      textStyle: {
        format: '#.### M',
        color: color.white,
        italic: false
      },
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      },
      baselineColor: color.deepblue
    }
  }
  
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
  .setTitle('mirror.finance - ' + symbol + ' - LP chart - ' + timeframe)
  .setDimensions(800, 500)
  .setBackgroundColor(color.deepblue)
  .setColors([color.grey,color.white,color.sky,color.orange])
  .setTitleTextStyle(titlestyle)
  .setXAxisTitleTextStyle(xstyle)
  .setYAxisTitleTextStyle(ystyle)
  .setLegendTextStyle(legendstyle)
  .setDataTable(datatable)
  .setOption('series', series)
  .setOption('vAxes', vaxes)
  .setOption('hAxes', haxes);
  
  chart = chart.build();
  
  var imageData = Utilities.base64Encode(chart.getAs('image/png').getBytes());
  var blob = Utilities.newBlob(Utilities.base64Decode(imageData), MimeType.JPEG, symbol + ' - LP chart - ' + timeframe);
  if (timeframe == '1d') {
    drive1dcharts.createFile(blob);
    return true;
  }
  if (timeframe == '7d') {
    drive7dcharts.createFile(blob);
    return true;
  }
  if (timeframe == '30d') {
    drive30dcharts.createFile(blob);
    return true;
  }
}
