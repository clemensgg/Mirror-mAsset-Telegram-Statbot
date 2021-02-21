function logAllData(data) { //////// 5min trigger
  var data = getAllData();
  var dataformatted = formatSheetData(data);
  sheet.insertRowsBefore(1,1);
  sheet.getRange(1,1,1,dataformatted[0].length).setValues(dataformatted);
  if (sheet.getLastRow() >= 36000) {
    sheet.deleteRows(31000,sheet.getLastRow()-31000);
  }
  return true;
}

function getAllDataLOG() {
  var all = getMIRLOG();
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

function getMIRLOG() {
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

function formatSheetData(d) {
  var data = [[
    thismoment,
    d.stats.assetcap,
    d.stats.totalValueLocked,
    d.stats.cratio,
    d.stats.mirSupplyCirculating,
    d.stats.mirSupplyTotal,
    d.stats.govAPR,
    d.stats.govAPY,
    d.stats.last24tx,
    d.stats.last24totalvol,
    d.stats.last24fee,
    d.stats.last24mirvol,
    d.stats.last24users,
    d.stats.totalLiquidity,
    d.stats.volByLiqFactor
  ]];
  for (var i = 0; i < d.assets.length; i++) {
    var s = d.assets[i].symbol + '_';
    data[0].push(s+d.assets[i].price,
                 s+d.assets[i].oraclePrice,
                 s+d.assets[i].last24volume,
                 s+d.assets[i].last24liquidity,
                 s+d.assets[i].apr,
                 s+d.assets[i].apy,
                );
  }
  return data;
}
