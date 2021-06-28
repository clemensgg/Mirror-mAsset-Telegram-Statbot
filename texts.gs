var linebreak = '\n\n';
var bothandle = '@mirror_statbot';
var mirrorurl = "mirror.finance";
var headfinance = '<b>mirror.finance statistics</b>\n\n<i>networks: Terra + ETH</i>';
var tickerhint = "<i>i don't know this mAsset/ticker</i>";
var pricehint = 'use <code>/p mAsset</code> to show prices for a specific mAsset <i>(non case-sensitive, use tickers like mETH, mAAPL, mtsla...)</i>';
var statshint = 'use <code>/s mAsset</code> to show statistics for a specific mAsset <i>(non case-sensitive, use tickers like mETH, mAAPL, mtsla...)</i>';
var charthint = 'use <code>/c mAsset timeframe</code> to print the chart for a specific mAsset <i>(timeframes: 1d, 7d, 30d)</i>';
var chartwarntext = '<i>chart not available at the moment. please try later</i>'
var dmmehint = '<i>dm me for full functionality</i> @mirror_statbot';
var infotext = '<b>MIRROR STATBOT by the Mirror community</b>\n\ncommands:\n<code>/stats</code> - mirror.finance statistics\n<code>/p mAsset</code> - prices for specific mAsset\n<code>/p all</code> - prices for all mAssets\n<code>/s mAsset</code> - swap statistics (mAsset)\n<code>/s all</code> - swap statistics (all)\n<code>/c mAsset timeframe</code> - price chart\n<code>/c mAsset timeframe LP</code> - LP chart\n<code>/c TVL timeframe</code> - TVL chart\n<code>/c GOV timeframe</code> - governance chart\n<code>/c LAST24 timeframe</code> - last24h chart\n<code>/info</code> - bot info\n\n<i>mAsset input is non case-sensitive (use tickers like mETH, mAAPL, mtsla...) - timeframes: 1d, 7d, 30d</i>\n\nadmin: @clemensg' + linebreak + 'participate: ' + mirrorurl;
var choosetext = '<i>choose mAsset</i>';
var choosecharttext = '<i>choose chart layout</i>';
var caption = bothandle;
var charterror = '<i>sorry, this chart is currently not available, please try again later.</i>';
var sryerror = '<i>sorry, an error occurred, please try again later. error-report sent.</i>';
var livecharterror = '<i>an error ocurred while generating the live-chart. trying to get cached chart...</i>';
var offtext = '📱 <a href="https://mirrorwallet.com/">buy & trade mAssets on your mobile</a>';

function generateMirrorStatsText() {
  var data = getCache();
  var stats = data.stats;
  var assets = data.assets;
  var text = '';
  var body = '';
  if (assets != false) {
    var mir = 'MIR/UST price: ' + data.mirprice + ' <code>(' + getTrendPrefix(data.mirpriceChange24hPerc) + data.mirpriceChange24hPerc + ' %)</code>';
    body = mir + linebreak + 'MIR total supply: ' + parseFloat(stats.mirSupplyTotal).toLocaleString() + '\nMIR circ. supply: ' + parseFloat(stats.mirSupplyCirculating).toLocaleString() + '\nMIR staked: ' + parseFloat(stats.mirSupplyStaked).toLocaleString() + '\nMIR in LP: ' + parseFloat(stats.mirSupplyLiquidity).toLocaleString() + '\n\nMIR staked: ' + (parseFloat(stats.mirSupplyStaked)/parseFloat(stats.mirSupplyCirculating)*100).toLocaleString() + ' %\nMIR gov APY (active): ' + (parseFloat(stats.govAPY)).toLocaleString() + ' %';
    body = body + linebreak + 'total mAsset cap:\n' + parseFloat(stats.assetcap).toLocaleString() + ' UST\ntotal pool liquidity:\n' + parseFloat(stats.totalLiquidity).toLocaleString() + ' UST\ntotal value locked:\n' + parseFloat(stats.totalValueLocked).toLocaleString() + ' UST\ncollateral-ratio: ' + (parseFloat(stats.cratio)).toLocaleString() + ' %';
    body = body + linebreak + '<b>last 24h</b>\nusers: ' + parseFloat(stats.last24users).toLocaleString() + '\ntransactions: ' + parseFloat(stats.last24tx).toLocaleString() + '\nvol. total: ' + parseFloat(stats.last24totalvol).toLocaleString() + ' UST\nvol. MIR: ' + parseFloat(stats.last24mirvol).toLocaleString() + ' UST\nfees payed: ' + parseFloat(stats.last24fee).toLocaleString() + ' UST\n24h volume / liquidity: ' + data.stats.volByLiqFactor + ' %';
    text = headfinance + linebreak + body + linebreak + offtext;
  }
  return text;
}

function generateAllAssetsPriceText() {
  var data = getCache();
  var assets = data.assets;
  var text = '';
  var body = '';
  if (assets != false) {
    var mir = 'MIR/UST price: ' + data.mirprice + ' <code>(' + getTrendPrefix(data.mirpriceChange24hPerc) + data.mirpriceChange24hPerc + ' %)</code>';
    for (var i = 0; i < assets.length; i++) {
      if (assets[i].symbol != 'MIR') {
        body = body + '<b>' + assets[i].symbol + '</b>\nswap price: ' + assets[i].price.toLocaleString() + ' <code>(' + getTrendPrefix(assets[i].priceChange24hPerc) + assets[i].priceChange24hPerc + ' %)</code>\noracle price: ' + assets[i].oraclePrice.toLocaleString() + ' <code>(' + getTrendPrefix(assets[i].oraclePriceChange24hPerc) + assets[i].oraclePriceChange24hPerc + ' %)</code>\n';
        body = body + '<b>premium: ' + assets[i].premiumPercentage + ' %</b>' + linebreak;
      }
    }
    body = body.slice(0,-2);
    text = (mir + linebreak + body + linebreak + offtext);
  }
  return text;
}

function generateAllAssetsStatsText() {
  var data = getCache();
  var assets = data.assets;
  var text = '';
  var body = '';
  if (assets != false) {
    for (var i = 0; i < assets.length; i++) {
      body = body + '<b>' + assets[i].symbol + '</b>\n' + assets[i].name + '\nliquidity: ' + parseFloat(assets[i].liquidity).toLocaleString() + ' UST\n24h volume: ' + parseFloat(assets[i].volume).toLocaleString() + ' UST\nlong farm (APR/APY): ' + assets[i].aprLong.toLocaleString() + ' / ' + assets[i].apyLong.toLocaleString() + ' %\nshort farm (APR/APY): ' + assets[i].aprShort.toLocaleString() + ' / ' + assets[i].apyShort.toLocaleString() + ' %' + linebreak;
    }
    body = body.slice(0,-2);
    text = (body + linebreak + offtext);
  }
  return text;
}

function generateAssetPriceText(asset) {
  var data = getCache();
  data.usersymbol = asset;
  var assets = data.assets;
  var text = '';
  var body = '';
  var asset = false;
  for (var i = 0; i < assets.length; i++) {
    if (assets[i].symbol == data.usersymbol) {
      asset = assets[i];
    }
  }
  if (asset != false) {
    if (asset.symbol == 'MIR') {
      var mir = 'MIR/UST price: ' + data.mirprice + ' <code>(' + getTrendPrefix(data.mirpriceChange24hPerc) + data.mirpriceChange24hPerc + ' %)</code>';
      return mir;
    }
    body = '<b>' + asset.symbol + '</b>\nswap price: ' + asset.price.toLocaleString() +' <code>(' + getTrendPrefix(asset.priceChange24hPerc) + asset.priceChange24hPerc + ' %)</code>\noracle price: ' + asset.oraclePrice.toLocaleString() + ' <code>(' + getTrendPrefix(asset.oraclePriceChange24hPerc) + asset.oraclePriceChange24hPerc + ' %)</code>\n';
    body = body + '<b>premium: ' + asset.premiumPercentage + ' %</b>';
    text = body + '\n' + bothandle;
  }
  return text;
}

function generateAssetStatsText(asset) {
  var data = getCache();
  data.usersymbol = asset;
  var assets = data.assets;
  var body = '';
  var asset = false;
  for (var i = 0; i < assets.length; i++) {
    if (assets[i].symbol == data.usersymbol) {
      asset = assets[i];
    }
  }
  if (asset != false) {
    body =  '<b>' + asset.symbol + '</b>\n' + asset.name + '\nliquidity: ' + parseFloat(asset.liquidity).toLocaleString() + ' UST\n24h volume: ' + parseFloat(asset.volume).toLocaleString() + ' UST\nlong farm (APR/APY): ' + asset.aprLong.toLocaleString() + ' / ' + asset.apyLong.toLocaleString() + ' %\nshort farm (APR/APY): ' + asset.aprShort.toLocaleString() + ' / ' + asset.apyShort.toLocaleString() + ' %';
  }
  return body;
}
