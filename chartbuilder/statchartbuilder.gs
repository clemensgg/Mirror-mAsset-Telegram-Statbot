function generateStatCharts() { //// whole chart built takes ~2min
  var data = getAllSheetData();
  generateAllLPCharts(data);
  generateALLSTATCharts(data);
  emptyTrash();
  return;
}

function generateALLSTATCharts(data) {
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
  return true; 
}

function generateAllLPCharts(data) {
  for (var i = 0; i < data[0].assets.length; i++) {
    var next = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 1d").hasNext();
    var next2 = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 7d").hasNext();
    var next3 = DriveApp.getFilesByName(data[0].assets[i].symbol + " - LP chart - 30d").hasNext();
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
          govAPR: data[i][6],
          govAPY: data[i][7],
          last24tx: data[i][8],
          last24totalvol: data[i][9],
          last24fee: data[i][10],
          last24mirvol: data[i][11],
          last24users: data[i][12],
          totalLiquidity: data[i][13],
          volByLiqFactor: data[i][14],
          mirStaking: data[i][15],
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
          apr: parseFloat(data[i][f+4].split('_')[1]),
          apy: parseFloat(data[i][f+5].split('_')[1])
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
        d.push([data[i].timestamp,data[i].assets[f].apr,data[i].assets[f].liquidity/1000000,data[i].assets[f].last24volume/1000000,data[i].stats.mirprice]);
      }
    }
  }
  var datatable = Charts.newDataTable()
  .addColumn(Charts.ColumnType.DATE, 'timestamp')
  .addColumn(Charts.ColumnType.NUMBER, '24h volume')
  .addColumn(Charts.ColumnType.NUMBER, 'Liquidity')
  .addColumn(Charts.ColumnType.NUMBER, 'APR %')
  .addColumn(Charts.ColumnType.NUMBER, 'MIR price');
  
  var highestapr = 0;
  var lowestapr = d[0][1];
  var highestliq = 0;
  var highestvol = 0;
  var tf = 12;
  var format = 'dd-MM-yy HH:mm'
  if (timeframe == '7d') {
    tf = 48;
    format = 'dd-MM-yy';
  }
  if (timeframe == '30d') {
    tf = 192;
    format = 'dd-MM-yy';
  }
  highestliq = d[0][2];
  highestvol = d[0][3];
  for (var i = 0; i < d.length; i = i+tf) {
    var apr = d[i][1];
    var liq = d[i][2];
    var vol = d[i][3];
    var mir = d[i][4];
    var ts = new Date(d[i][0]);
    if (timeframe == '1d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= oneday) {
      datatable.addRow([ts,vol,liq,apr,mir]);
      if (vol > highestvol) {
        highestvol = vol;
      }
      if (liq > highestliq) {
        highestliq = liq;
      }
      if (apr > highestapr) {
        highestapr = apr;
      }
      if (apr < lowestapr) {
        lowestapr = apr;
      }
    }
    if (timeframe == '7d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= sevendays) {
      datatable.addRow([ts,vol,liq,apr,mir]);
      if (vol > highestvol) {
        highestvol = vol;
      }
      if (liq > highestliq) {
        highestliq = liq;
      }
      if (apr > highestapr) {
        highestapr = apr;
      }
      if (apr < lowestapr) {
        lowestapr = apr;
      }
    }
    if (timeframe == '30d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= thirtydays) {
      datatable.addRow([ts,vol,liq,apr,mir]);
      if (vol > highestvol) {
        highestvol = vol;
      }
      if (liq > highestliq) {
        highestliq = liq;
      }
      if (apr > highestapr) {
        highestapr = apr;
      }
      if (apr < lowestapr) {
        lowestapr = apr;
      }
    }
  }
  
  var textStyleBuilder = Charts.newTextStyle().setColor('white').setFontSize(20);
  var textStyleBuilder2 = Charts.newTextStyle().setColor('white').setFontSize(16);
  var textStyleBuilder3 = Charts.newTextStyle().setColor('white').setFontSize(16);
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
      targetAxisIndex: 2,
      type: 'line',
      curveType: 'function',
      lineDashStyle: [4, 4]
    }
  }
  
  var vaxes = {
    0: {
      format: '#,### %',
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
        max: highestapr*1.05,
        min: lowestapr*0.95
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
    },
    2: {
      textColor: color.orange,
      format: '#.##',
      textPosition: 'in',
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      },
      baselineColor: color.deepblue,
      gridlines: {
        color: color.deepblue
      }
    } 
  }
  
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

// totalValueLocked + cratio + [last24htotalvol]

function buildTVLChart(data,timeframe) { // totalValueLocked + cratio + last24htotalvol
  var d = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].timestamp != null && data[i].timestamp != undefined && data[i].timestamp != NaN) {
      d.push([data[i].timestamp,Math.floor(data[i].stats.last24totalvol),data[i].stats.totalValueLocked,(data[i].stats.cratio/100).toFixed(2)]);
    }
  }
  var datatable = Charts.newDataTable()
  .addColumn(Charts.ColumnType.DATE, 'timestamp')
  .addColumn(Charts.ColumnType.NUMBER, '24h vol')
  .addColumn(Charts.ColumnType.NUMBER, 'TVL')
  .addColumn(Charts.ColumnType.NUMBER, 'c-ratio %');
  
  var highestcr = 0;
  var lowestcr = d[0][3];
  var highestvol = 0;
  var lowestvol = d[0][1];
  var tf = 12;
  var last = 0;
  var format = 'dd-MM-yy HH:mm'
  if (timeframe == '7d') {
    tf = 48;
    format = 'dd-MM-yy';
  }
  if (timeframe == '30d') {
    tf = 192;
    format = 'dd-MM-yy';
  }
  for (var i = 0; i < d.length; i = i+tf) {
    var vol = d[i][1];
    var tvl = d[i][2];
    var cr = d[i][3];
    var ts = new Date(d[i][0]);
    if (timeframe == '1d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= oneday) {
      if (ts != NaN && vol != NaN && tvl != NaN && cr != NaN) {
        datatable.addRow([ts,vol,tvl,cr]);
        if (cr > highestcr) {
          highestcr = cr;
        }
        if (cr < lowestcr) {
          lowestcr = cr;
        }
        if (ts < last) {
          last = ts;
        }
        if (vol < lowestvol) {
          lowestvol = vol;
        }
        if (vol > highestvol) {
          highestvol = vol;
        }
      }
    }
    if (timeframe == '7d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= sevendays) {
      if (ts != NaN && vol != NaN && tvl != NaN && cr != NaN) {
        datatable.addRow([ts,vol,tvl,cr]);
        if (cr > highestcr) {
          highestcr = cr;
        }
        if (cr < lowestcr) {
          lowestcr = cr;
        }
        if (ts < last) {
          last = ts;
        }
        if (vol < lowestvol) {
          lowestvol = vol;
        }
        if (vol > highestvol) {
          highestvol = vol;
        }
      }
    }
    if (timeframe == '30d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= thirtydays) {
      if (ts != NaN && vol != NaN && tvl != NaN && cr != NaN) {
        datatable.addRow([ts,vol,tvl,cr]);
        if (cr > highestcr) {
          highestcr = cr;
        }
        if (cr < lowestcr) {
          lowestcr = cr;
        }
        if (ts < last) {
          last = ts;
        }
        if (vol < lowestvol) {
          lowestvol = vol;
        }
        if (vol > highestvol) {
          highestvol = vol;
        }
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
      targetAxisIndex: 2,
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
    }
  }
  
  var vaxes = {
    0: {
      format: '#.## %',
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
        max: highestcr*1.02,
        min: lowestcr*0.98
      },
      baselineColor: color.deepblue
    },
    1: {
      textStyle: {
        format: '# M',
        color: color.sky,
        italic: false
      },
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      },
      baselineColor: color.deepblue
    },
    2: {
      textColor: color.grey,
      textPosition: 'in',
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      },
      baselineColor: color.deepblue,
      viewWindow: {
        max: highestvol*3,
        min: 0
      },
      ticks: [0,(highestvol/2).toFixed(0),highestvol],
      gridlines: {
        color: color.deepblue
      }
    } 
  }

  var now = new Date();
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
  .setTitle('mirror.finance - mAssets TVL chart - ' + timeframe)
  .setDimensions(800, 500)
  .setBackgroundColor(color.deepblue)
  .setColors([color.grey,color.sky,color.white])
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
  var blob = Utilities.newBlob(Utilities.base64Decode(imageData), MimeType.JPEG, 'mirror.finance - mAssets TVL chart - ' + timeframe);
  if (timeframe == '1d') {
    statcharts1d.createFile(blob);
    return true;
  }
  if (timeframe == '7d') {
    statcharts7d.createFile(blob);
    return true;
  }
  if (timeframe == '30d') {
    statcharts30d.createFile(blob);
    return true;
  }
}

// govAPY + mirLockedRatio + mirPrice + [mirVol]

function buildGOVChart(data,timeframe) { 
  var d = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].timestamp != null && data[i].timestamp != undefined && data[i].timestamp != NaN) {
      var mirLockedRatio = 0;
      if (data[i].stats.mirStaking != '' && data[i].stats.mirStaking != undefined && data[i].stats.mirStaking != NaN && data[i].stats.mirStaking != null && data[i].stats.mirStaking != 0) {
        mirLockedRatio = data[i].stats.mirStakingRatio;
      }
      d.push([data[i].timestamp,(data[i].stats.govAPY/100).toFixed(4),mirLockedRatio,data[i].stats.mirprice,Math.floor(data[i].stats.mirvol/1000000)]);
    }
  }
  var datatable = Charts.newDataTable()
  .addColumn(Charts.ColumnType.DATE, 'timestamp')
  .addColumn(Charts.ColumnType.NUMBER, 'MIR 24h vol')
  .addColumn(Charts.ColumnType.NUMBER, 'MIR price')
  .addColumn(Charts.ColumnType.NUMBER, 'MIR staked %')
  .addColumn(Charts.ColumnType.NUMBER, 'gov APY %');
  
  var highestapy = 0;
  var lowestapy = d[0][1];
  var higheststaking = 0;
  var loweststaking = d[0][2];
  var highestvol = 0;
  var lowestvol = d[0][4];
  var highestwindow = 0;
  var lowestwindow = lowestapy;
  var tf = 12;
  var last = 0;
  var format = 'dd-MM-yy HH:mm'
  if (timeframe == '7d') {
    tf = 48;
    format = 'dd-MM-yy';
  }
  if (timeframe == '30d') {
    tf = 192;
    format = 'dd-MM-yy';
  }
  for (var i = 0; i < d.length; i = i+tf) {
    var apy = d[i][1];
    var staking = d[i][2];
    var mirprice = d[i][3];
    var vol = d[i][4];
    var ts = new Date(d[i][0]);
    if (timeframe == '1d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= oneday) {
      if (staking != 0 && apy != NaN) {
        datatable.addRow([ts,vol,mirprice,staking,apy]);
        if (apy > highestapy) {
          highestapy = apy;
        }
        if (apy < lowestapy) {
          lowestapy = apy;
        }
        if (ts < last) {
          last = ts;
        }
        if (staking < loweststaking) {
          loweststaking = staking;
        }
        if (staking > higheststaking) {
          higheststaking = staking;
        }
        if (vol < lowestvol) {
          lowestvol = vol;
        }
        if (vol > highestvol) {
          highestvol = vol;
        }
      }
    }
    if (timeframe == '7d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= sevendays) {
      if (staking != 0 && apy != NaN) {
        datatable.addRow([ts,vol,mirprice,staking,apy]);
        if (apy > highestapy) {
          highestapy = apy;
        }
        if (apy < lowestapy) {
          lowestapy = apy;
        }
        if (ts < last) {
          last = ts;
        }
        if (staking < loweststaking) {
          loweststaking = staking;
        }
        if (staking > higheststaking) {
          higheststaking = staking;
        }
        if (vol < lowestvol) {
          lowestvol = vol;
        }
        if (vol > highestvol) {
          highestvol = vol;
        }
      }
    }
    if (timeframe == '30d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= thirtydays) {
      if (staking != 0 && apy != NaN) {
        datatable.addRow([ts,vol,mirprice,staking,apy]);
        if (apy > highestapy) {
          highestapy = apy;
        }
        if (apy < lowestapy) {
          lowestapy = apy;
        }
        if (ts < last) {
          last = ts;
        }
        if (staking < loweststaking) {
          loweststaking = staking;
        }
        if (staking > higheststaking) {
          higheststaking = staking;
        }
        if (vol < lowestvol) {
          lowestvol = vol;
        }
        if (vol > highestvol) {
          highestvol = vol;
        }
      }
    }
  }

  if (highestapy > higheststaking) {
    highestwindow = highestapy;
  }
  if (highestapy < higheststaking) {
    highestwindow = higheststaking;
  }
  if (lowestapy < loweststaking) {
    lowestwindow = lowestapy;
  }
  if (lowestapy > loweststaking) {
    lowestwindow = loweststaking;
  }
  
  var textStyleBuilder = Charts.newTextStyle().setColor('white').setFontSize(20);
  var textStyleBuilder2 = Charts.newTextStyle().setColor('white').setFontSize(16);
  var textStyleBuilder3 = Charts.newTextStyle().setColor('white').setFontSize(13);
  var titlestyle = textStyleBuilder.build();
  var xstyle = textStyleBuilder2.build();
  var ystyle = textStyleBuilder2.build();
  var legendstyle = textStyleBuilder3.build();
 
  
  var series = {
    0: {
      targetAxisIndex: 2,
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
      format: '#.## %',
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
        max: highestwindow*1.04,
        min: lowestwindow*0.96
      },
      baselineColor: color.deepblue
    },
    1: {
      textStyle: {
        format: '# M',
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
    },
    2: {
      textColor: color.grey,
      textPosition: 'in',
      gridlines: {
        count: 0
      },
      minorGridlines: {
        count: 0
      },
      baselineColor: color.deepblue,
      viewWindow: {
        max: highestvol*3,
        min: 0
      },
      ticks: [0,(highestvol/2).toFixed(0),highestvol],
      gridlines: {
        color: color.deepblue
      }
    } 
  }

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
  .setTitle('mirror.finance - MIR gov. chart - ' + timeframe)
  .setDimensions(800, 500)
  .setBackgroundColor(color.deepblue)
  .setColors([color.grey,color.white,color.orange,color.sky])
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
  var blob = Utilities.newBlob(Utilities.base64Decode(imageData), MimeType.JPEG, 'mirror.finance - MIR gov. chart - ' + timeframe);
  if (timeframe == '1d') {
    statcharts1d.createFile(blob);
    return true;
  }
  if (timeframe == '7d') {
    statcharts7d.createFile(blob);
    return true;
  }
  if (timeframe == '30d') {
    statcharts30d.createFile(blob);
    return true;
  }
}

// liquidity + volByLiqFactor + last24htotalvol + [last24tx]

function buildLAST24Chart(data,timeframe) {
  var d = [];
  for (var i = 0; i < data.length; i++) {
    if (data[i].timestamp != null && data[i].timestamp != undefined && data[i].timestamp != NaN) {
      d.push([data[i].timestamp,data[i].stats.totalLiquidity,data[i].stats.last24totalvol,data[i].stats.volByLiqFactor/100,data[i].stats.last24tx]);
    }
  }
  var datatable = Charts.newDataTable()
  .addColumn(Charts.ColumnType.DATE, 'timestamp')
  .addColumn(Charts.ColumnType.NUMBER, '24h tx')
  .addColumn(Charts.ColumnType.NUMBER, '24h vol')
  .addColumn(Charts.ColumnType.NUMBER, 'vol-by-liquidity factor %');
  
  var highesttx = 0;
  var lowesttx = d[0][4];
  var highestvolbyliq = 0;
  var lowestvolbyliq = d[0][3];
  var tf = 12;
  var format = 'dd-MM-yy HH:mm'
  if (timeframe == '7d') {
    tf = 48;
    format = 'dd-MM-yy';
  }
  if (timeframe == '30d') {
    tf = 192;
    format = 'dd-MM-yy';
  }
  for (var i = 0; i < d.length; i = i+tf) {
    var vol = d[i][2];
    var volbyliq = d[i][3];
    var tx = d[i][4];
    var ts = new Date(d[i][0]);
    if (timeframe == '1d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= oneday) {
      if (ts != NaN && (isFloat(volbyliq) || isInt(volbyliq)) && isInt(tx)) {
        datatable.addRow([ts,tx,vol,volbyliq]);
        if (tx > highesttx) {
          highesttx = tx;
        }
        if (tx < lowesttx) {
          lowesttx = tx;
        }
        if (volbyliq < lowestvolbyliq) {
          lowestvolbyliq = volbyliq;
        }
        if (volbyliq > highestvolbyliq) {
          highestvolbyliq = volbyliq;
        }
      }
    }
    if (timeframe == '7d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= sevendays) {
      if (ts != NaN && (isFloat(volbyliq) || isInt(volbyliq)) && isInt(tx)) {
        datatable.addRow([ts,tx,vol,volbyliq]);
        if (tx > highesttx) {
          highesttx = tx;
        }
        if (tx < lowesttx) {
          lowesttx = tx;
        }
        if (volbyliq < lowestvolbyliq) {
          lowestvolbyliq = volbyliq;
        }
        if (volbyliq > highestvolbyliq) {
          highestvolbyliq = volbyliq;
        }
      }
    }
    if (timeframe == '30d' && (thismoment - (d[i][0] - 3*60*60*1000)) <= thirtydays) {
      if (ts != NaN && (isFloat(volbyliq) || isInt(volbyliq)) && isInt(tx)) {
        datatable.addRow([ts,tx,vol,volbyliq]);
        if (tx > highesttx) {
          highesttx = tx;
        }
        if (tx < lowesttx) {
          lowesttx = tx;
        }
        if (volbyliq < lowestvolbyliq) {
          lowestvolbyliq = volbyliq;
        }
        if (volbyliq > highestvolbyliq) {
          highestvolbyliq = volbyliq;
        }
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
      targetAxisIndex: 2,
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
    }
  }
  
  var vaxes = {
    0: {
      format: '#.## %',
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
      baselineColor: color.deepblue
    },
    1: {
      textStyle: {
        format: '#',
        color: color.sky,
        italic: false
      },
      gridlines: {
        color: color.deepblue
      },
      minorGridlines: {
        color: color.deepblue
      },
      baselineColor: color.deepblue
    },
    2: {
      textStyle: {
        format: '#',
        color: color.grey,
        italic: false
      },
      textPosition: 'in',
      ticks: [0,(highesttx/2).toFixed(0),highesttx],
      gridlines: {
        color: color.deepblue
      },
      minorGridlines: {
        color: color.deepblue
      },
      viewWindow: {
        max: highesttx*3,
        min: 0
      },
      baselineColor: color.deepblue
    }
  }

  var now = new Date();
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
  .setTitle('mirror.finance - last 24h chart - ' + timeframe)
  .setDimensions(800, 500)
  .setBackgroundColor(color.deepblue)
  .setColors([color.grey,color.sky,color.white])
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
  var blob = Utilities.newBlob(Utilities.base64Decode(imageData), MimeType.JPEG, 'mirror.finance - last 24h chart - ' + timeframe);
  if (timeframe == '1d') {
    statcharts1d.createFile(blob);
    return true;
  }
  if (timeframe == '7d') {
    statcharts7d.createFile(blob);
    return true;
  }
  if (timeframe == '30d') {
    statcharts30d.createFile(blob);
    return true;
  }
}
