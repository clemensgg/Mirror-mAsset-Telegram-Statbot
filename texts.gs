var linebreak = '\n\n';
var bothandle = '@mirror_statbot';
var mirrorurl = "mirror.finance";
var headfinance = '<b>MIRROR.FINANCE STATS</b>';
var tickerhint = "<i>i don't know this mAsset/ticker</i>";
var pricehint = 'use <code>/p mAsset</code> to show prices for a specific mAsset <i>(non case-sensitive, use tickers like mETH, mAAPL, mtsla...)</i>';
var statshint = 'use <code>/s mAsset</code> to show statistics for a specific mAsset <i>(non case-sensitive, use tickers like mETH, mAAPL, mtsla...)</i>';
var charthint = 'use <code>/c mAsset timeframe</code> to print the chart for a specific mAsset <i>(timeframes: 1d, 7d)</i>';
var chartwarntext = '<i>chart not available at the moment. please try later</i>'
var dmmehint = '<i>dm me for full functionality</i> @mirror_statbot';
var infotext = '<b>MIRROR STATBOT by the Mirror community</b>\n\ncommands:\n<code>/stats</code> - mirror.finance statistics\n<code>/p mAsset</code> - prices for specific mAsset\n<code>/p all</code> - prices for all mAssets\n<code>/s mAsset</code> - swap statistics (mAsset)\n<code>/s all</code> - swap statistics (all)\n<code>/c mAsset timeframe</code> - price chart\n<code>/c mAsset timeframe LP</code> - LP chart\n<code>/info</code> - bot info\n\n<i>mAsset input is non case-sensitive (use tickers like mETH, mAAPL, mtsla...) / timeframes: 1d, 7d\n\n</i>🙏 Proposal #71 on mirror.finance has passed! Further development of @mirror_statbot is ensured. Thank you to everyone who voted!\n\nadmin: @clemensg' + linebreak + 'participate: ' + mirrorurl;
var choosetext = '<i>choose mAsset</i>';
var choosecharttext = '<i>choose chart layout\n\nplease note that some 7-day charts are still building from initial logging start</i>';
var caption = bothandle;
var offtext = '📱 <a href="https://mirrorwallet.com/">buy & trade mAssets on your mobile</a>';

function generateMirrorStatsText() {
  var data = getCache();
  var stats = data.stats;
  var assets = data.assets;
  var text = '';
  var body = '';
  if (assets != false) {
    var mir = 'MIR/UST price: ' + data.mirprice;
    body = mir + linebreak + 'MIR circ. supply: ' + parseFloat(stats.mirSupplyCirculating).toLocaleString() + '\nMIR total supply: ' + parseFloat(stats.mirSupplyTotal).toLocaleString() + '\nMIR gov APY: ' + (parseFloat(stats.govAPY)).toLocaleString() + ' %';
    body = body + linebreak + 'tot. mAsset cap: ' + parseFloat(stats.assetcap).toLocaleString() + ' UST\ntot. liquidity: ' + parseFloat(stats.totalLiquidity).toLocaleString() + ' UST\ntot. value locked: ' + parseFloat(stats.totalValueLocked).toLocaleString() + ' UST\ncollateral-ratio: ' + (parseFloat(stats.cratio)).toLocaleString() + ' %';
    body = body + linebreak + '<b>last 24h</b>\nusers: ' + parseFloat(stats.last24users).toLocaleString() + '\ntransactions: ' + parseFloat(stats.last24tx).toLocaleString() + '\nvol. total: ' + parseFloat(stats.last24totalvol).toLocaleString() + ' UST\nvol. MIR: ' + parseFloat(stats.last24mirvol).toLocaleString() + '\nfees payed: ' + parseFloat(stats.last24fee).toLocaleString() + ' UST\n24h volume / liquidity: ' + data.stats.volByLiqFactor + ' %';
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
    var mir = 'MIR/UST price: ' + data.mirprice;
    for (var i = 0; i < assets.length; i++) {
      if (assets[i].symbol != 'MIR') {
        body = body + '<b>' + assets[i].symbol + '</b>\nswap price: ' + assets[i].price.toLocaleString() + '\noracle price: ' + assets[i].oraclePrice.toLocaleString() + '\n';
        body = body + 'premium: ' + assets[i].premium.toLocaleString() + ' UST (' + assets[i].premiumPercentage + ' %)' + linebreak;
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
      body = body + '<b>' + assets[i].symbol + '</b>\n' + assets[i].name + '\nliquidity: ' + parseFloat(assets[i].liquidity).toLocaleString() + ' UST\n24h volume: ' + parseFloat(assets[i].volume).toLocaleString() + ' UST\nAPR: ' + assets[i].apr + ' %\nAPY: ' + assets[i].apy + ' %' + linebreak;
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
      var mir = 'MIR/UST price: ' + data.mirprice;
      return mir;
    }
    body = '<b>' + asset.symbol + '</b>\nswap price: ' + asset.price.toLocaleString() + '\noracle price: ' + asset.oraclePrice.toLocaleString() + '\n';
    body = body + 'premium: ' + asset.premium.toLocaleString() + ' UST (' + asset.premiumPercentage + ' %)'
    text = body + '\n' + bothandle;
  }
  return text;
}

function generateAssetStatsText(asset) {
  var data = getCache();
  data.usersymbol = asset;
  var assets = data.assets;
  var symbols = data.symbols;
  var text = '';
  var body = '';
  var asset = false;
  for (var i = 0; i < assets.length; i++) {
    if (assets[i].symbol == data.usersymbol) {
      asset = assets[i];
    }
  }
  if (asset != false) {
    body = '<b>' + asset.symbol + '</b>\n' + asset.name + '\nliquidity: ' + parseFloat(asset.liquidity).toLocaleString() + ' UST\n24h volume: ' + parseFloat(asset.volume).toLocaleString() + ' UST\nAPR: ' + asset.apr + ' %\nAPY: ' + asset.apy + ' %';
    text = body + '\n' + bothandle;
  }
  return text;
}
