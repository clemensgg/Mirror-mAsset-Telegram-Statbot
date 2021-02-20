//// Mirror Statbot utilizes GAS script cache as database / refresh rate 1min per time trigger

function writeCache() {    //////////////////////////// AUTOTRIGGER 1MIN
  var data = getAllData();
  cache.put("data", JSON.stringify(data));
  return;
}

function getCache() {   
  var data = JSON.parse(cache.get('data'));
  return data;
}

function getAllData() {
  var all = getMIR();
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
      var preRel = ((all.assets[i].prices.price - all.assets[i].prices.oraclePrice) / all.assets[i].prices.oraclePrice * 100).toFixed(2);
      data.assets.push({
        symbol: all.assets[i].symbol,
        name: all.assets[i].name,
        price: parseFloat(all.assets[i].prices.price).toFixed(2),
        oraclePrice: parseFloat(all.assets[i].prices.oraclePrice).toFixed(2),
        premium: pre,
        premiumPercentage: preRel,
        liquidity: ((parseFloat(all.assets[i].statistic.liquidity))/1000000).toFixed(2),
        volume: ((parseFloat(all.assets[i].statistic.volume))/1000000).toFixed(2),
        apr: (parseFloat(all.assets[i].statistic.apr)*100).toFixed(2),
        apy: (parseFloat(all.assets[i].statistic.apy)*100).toFixed(2)
      });
    }
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

function getMIR() {
  var payload = {
    'query': "{statistic(network: COMBINE) {assetMarketCap totalValueLocked collateralRatio mirCirculatingSupply mirTotalSupply govAPR govAPY latest24h {transactions volume feeVolume mirVolume activeUsers} govAPR govAPY} assets {symbol name prices {price oraclePrice} statistic {volume liquidity apr apy}}}"
  }
  var options = formatPostRequest(payload);
  var response = UrlFetchApp.fetch(mirAPI, options);
  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText()).data;    
  }
  if (response.getResponseCode() != 200) {
    notifyAdmin('MIR Statbot ERROR','Mirror Statbot MIR API ERROR\n\n' + response.getContentText());
    return;
  }
}
