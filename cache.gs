//// Mirror Statbot utilizes GAS script cache as database / refresh rate 1min per time trigger

function writeCache() {    //////////////////////////// AUTOTRIGGER 1MIN
  var data = getAllData();
  cache.put("data", JSON.stringify(data));
  cacheMIRtokens();
  return;
}

function getCache() {   
  var data = JSON.parse(cache.get('data'));
  return data;
}

function cacheMIRtokens() {
  var payload = {
    'query': "{ assets {    symbol    token } } "
  }
  var assets = [];
  var options = formatPostRequest(payload);
  var all = UrlFetchApp.fetch(mirAPI, options);
  if (all.getResponseCode() == 200) {
    assets = JSON.parse(all.getContentText()).data.assets;
    cache.put('assets',JSON.stringify(assets));
    return true;
  }
  return false;
}

function getMIRtoken(symbol) {
  var assets = JSON.parse(cache.get('assets'));
  for (var i = 0; i < assets.length; i++) {
    if (symbol == assets[i].symbol) {
      return assets[i].token;
    }
  }
  return false;
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
      data.mirpriceChange24hPerc = ((parseFloat(all.assets[i].prices.price) - parseFloat(all.assets[i].prices.history[0].price)) / parseFloat(all.assets[i].prices.history[0].price) * 100).toFixed(2);
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
    data.assets[i].price24h = data.assets[i].price;
    data.assets[i].oraclePrice24h = data.assets[i].oraclePrice;
    if (all.assets[i].prices.hasOwnProperty('history') && all.assets[i].prices.history[0] != undefined) {
      var lowest = parseFloat(all.assets[i].prices.history[0].price).toFixed(2);
      var lowestts = parseFloat(all.assets[i].prices.history[0].timestamp);
    /*  for (var z = 0; z < all.assets[i].prices.history.length; z++) {
        if (parseFloat(all.assets[i].prices.history[z].timestamp) < lowestts) {
          lowest = parseFloat(all.assets[i].prices.history[z].price).toFixed(2);
        }
      }*/
      data.assets[i].price24h = lowest;
    }
    if (all.assets[i].prices.hasOwnProperty('oracleHistory') && all.assets[i].prices.oracleHistory[0] != undefined) {
      var lowest = parseFloat(all.assets[i].prices.oracleHistory[0].price).toFixed(2);
      var lowestts = parseFloat(all.assets[i].prices.oracleHistory[0].timestamp);
    /*  for (var z = 0; z < all.assets[i].prices.oracleHistory.length; z++) {
        if (parseFloat(all.assets[i].prices.oracleHistory[z].timestamp) < lowestts) {
          lowest = parseFloat(all.assets[i].prices.oracleHistory[z].price).toFixed(2);
        }
      }*/
      data.assets[i].oraclePrice24h = lowest;
    }
    data.assets[i].priceChange24h = (data.assets[i].price - data.assets[i].price24h).toFixed(2);
    data.assets[i].priceChange24hPerc = (data.assets[i].priceChange24h / data.assets[i].price24h * 100).toFixed(2);
    data.assets[i].oraclePriceChange24h = (data.assets[i].oraclePrice - data.assets[i].oraclePrice24h).toFixed(2);
    data.assets[i].oraclePriceChange24hPerc = (data.assets[i].oraclePriceChange24h / data.assets[i].oraclePrice24h * 100).toFixed(2);
  }
  data.stats.totalLiquidity = tliq;
  data.stats.volByLiqFactor = (data.stats.last24totalvol / data.stats.totalLiquidity * 100).toFixed(2);
  Logger.log(data)
  return data;
}

function getMIR() {
  var now = thismoment.getTime();
  var onedayago = subDaysFromDate(thismoment, 1).getTime();
  var payload = {
    'query': '{statistic(network: COMBINE) {assetMarketCap totalValueLocked collateralRatio mirCirculatingSupply mirTotalSupply govAPR govAPY latest24h {transactions volume feeVolume mirVolume activeUsers} govAPR govAPY} assets {symbol name prices {price oraclePrice history(interval: 1, from: ' + onedayago + ', to: ' + onedayago + ') { timestamp price } oracleHistory(interval: 1, from: ' + onedayago + ', to: ' + onedayago + ') { timestamp price }} statistic {volume liquidity apr apy}}}'
  }
  var options = formatPostRequest(payload);
  var response = UrlFetchApp.fetch(mirAPI, options);
  if (response.getResponseCode() == 200) {
    return JSON.parse(response.getContentText()).data;    
  }
  if (response.getResponseCode() != 200) {
    notifyAdmin('MIR Statbot ERROR','Mirror Statbot MIR API ERROR\n\nGraphql returned code: ' + response.getResponseCode());
    return;
  }
}
