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
