function bot_info(chatid,chattype) { //// private only (public hint)
  if (chattype == 'private') {
    var text = infotext;
    var keyboard = keyboardMain();
    var data = loadMsgKey(chatid,text,keyboard);
  }
  if (chattype != 'private') {
    var text = dmmehint;
    var data = loadMsg(chatid,text);
  }
  sendToTG(data);
  return true;
}

function bot_mirStats(chatid,chattype) { //// public + private
  var text = generateMirrorStatsText();
  if (chattype == 'private') {
    var keyboard = keyboardMain();
    var data = loadMsgKey(chatid,text,keyboard);
  }
  if (chattype != 'private') {
    var data = loadMsg(chatid,text);
  }
  sendToTG(data);
  return true;
}

function bot_allPricesStats(chatid,method,chattype) { //// private only (public hint)
  if (chattype == 'private') {
    var text = infotext;
    if (method == 'p') {
      text = generateAllAssetsPriceText();
    }
    if (method == 's') {
      text = generateAllAssetsStatsText();
    }
    var keyboard = keyboardMain();
    var data = loadMsgKey(chatid,text,keyboard);
  }
  if (chattype != 'private') {
    var text = dmmehint;
    var data = loadMsg(chatid,text);
  }
  sendToTG(data);
  return true;
}

function bot_assetPricesStatsCallback(chatid,method,asset) { //// callback only
  if (method == 'p') {
    var text = generateAssetPriceText(asset);
  }
  if (method == 's') {
    var text = generateAssetStatsText(asset);
  }
  var keyboard = keyboardMain();
  var data = loadMsgKey(chatid,text,keyboard);
  sendToTG(data);  
  return true;
}

function bot_assetPricesStatsCommand(chatid,userinput,method,chattype) { //// public + private
  var data = getAllData();
    data.usersymbol = normalizeSymbol(userinput,data.symbols)
    if (data.usersymbol == false) {
      var text = tickerhint + "<i> » " + userinput + " « please check your spelling</i>";
      data = loadMsg(chatid,text);
      if (chattype == 'private') {
        keyboard = keyboardMain();
        data = loadMsgKey(chatid,text,keyboard);
      }
      sendToTG(data);
    }
    if (data.usersymbol != false) {
      if (method == 's') {
        var text = generateAssetStatsText(data.usersymbol);
      }
      if (method == 'p') {
        var text = generateAssetPriceText(data.usersymbol);
      }
      data = loadMsg(chatid,text);
      if (chattype == 'private') {
        keyboard = keyboardMain();
        data = loadMsgKey(chatid,text,keyboard);
      }
      sendToTG(data);
    }
    return;
}

function bot_assetChartCallback(chatid,callbackdata) { //// callback only
  var data = chatActionTyping(chatid);
  sendToTG(data);
  method = 'P';
  if (callbackdata.includes('lp')) {
    method = 'LP';
  }
  var all = getCache();
  var symbol = normalizeSymbol(callbackdata.split('_')[1],all.symbols);
  var timeframe = normalizeTimeframe(callbackdata.slice(1,2));
  var keyboard = keyboardMain();
  var text = chartwarntext;
  data = loadMsgKey(chatid,text,keyboard);
  if (symbol != false) {
    var chart = getChartBlob(method,symbol,timeframe);
    if (chart != false) {
      data = loadPicKey(chatid,caption,chart,keyboard);
    }
    if (chart == false) {
      text = charterror;
      data = loadMsgKey(chatid,text,keyboard);
    }
  }
  return data;
}

function bot_assetChartCommand(chatid,msgtext,chattype) { //// public + private
  var data = chatActionTyping(chatid);
  sendToTG(data);
  var all = getCache();
  if (msgtext.split(' ')[1] == undefined || msgtext.split(' ')[2] == undefined) {
    var text = charthint;
    var data = loadMsg(chatid,text);
    if (chattype == 'private') {
        var keyboard = keyboardMain();
        data = loadMsgKey(chatid,text,keyboard);   
    }
    sendToTG(data);
    return;
  }
  var symbol = normalizeSymbol(msgtext.split(' ')[1],all.symbols);
  var timeframe = false;
  if (msgtext.split(' ')[2] != undefined) {
    timeframe = normalizeTimeframe(msgtext.split(' ')[2]);
  }
  if (symbol == false) {
    var text = tickerhint +  "<i> » " + msgtext.split(' ')[1] + " « please check your spelling</i>";
    var data = loadMsg(chatid,text);
    if (chattype == 'private') {
      var keyboard = keyboardMain();
      data = loadMsgKey(chatid,text,keyboard);   
    }
    sendToTG(data);
    return;
  }
  if (timeframe == false) {
    var text = charthint;
    var data = loadMsg(chatid,text);
    if (chattype == 'private') {
        var keyboard = keyboardMain();
        data = loadMsgKey(chatid,text,keyboard);   
    }
    sendToTG(data);
    return;
  }
  if (symbol != false && timeframe != false) {
    var method = 'P';
    if (msgtext.split(' ')[3] != undefined && msgtext.split(' ')[3] != null && msgtext.split(' ')[3] != NaN) {
      if (msgtext.split(' ')[3].toLowerCase() == 'lp') {
        method = 'LP';
      }
    }
    var chart = getChartBlob(method,symbol,timeframe);
    if (chart != false) {
      var data = loadPic(chatid,caption,chart);
      if (chattype == 'private') {
        var keyboard = keyboardMain();
        data = loadPicKey(chatid,caption,chart,keyboard);        
      }
      var response = sendToTG(data);
      if(response.getResponseCode().toString().includes('40')) {
        bot_sryError(chatid,chattype);
      } 
    }
    if (chart == false) {
      text = charterror;
      data = loadMsg(chatid,text);
      if (chattype == 'private') {
        var keyboard = keyboardMain();
        data = loadMsgKey(chatid,text,keyboard);        
      }
      sendToTG(data); 
    }
  }
  return true;
}

function bot_getStatChart(chatid,method,timeframe,chattype) {
  var data = chatActionTyping(chatid);
  sendToTG(data);
  var chart = getChartBlob(method,'MIR',timeframe);
  if (chart != false) {
    var data = loadPic(chatid,caption,chart);
    if (chattype == 'private') {
      var keyboard = keyboardMain();
      data = loadPicKey(chatid,caption,chart,keyboard);        
    }
    var response = sendToTG(data);
    if(response.getResponseCode().toString().includes('40')) {
      bot_sryError(chatid,chattype);
    } 
  }
  if (chart == false) {
    text = charterror;
    data = loadMsg(chatid,text);
    if (chattype == 'private') {
      var keyboard = keyboardMain();
      data = loadMsgKey(chatid,text,keyboard);        
    }
    sendToTG(data); 
  }
  return true;
}

function bot_sryError(chatid,chattype) {
  var text = sryerror;
  var data = loadMsg(chatid,text);
  if (chattype == 'private') {
    var keyboard = keyboardMain();
    data = loadMsgKey(chatid,text,keyboard);        
  }
  sendToTG(data); 
  return true;
}

function bot_hint(chatid,method,chattype) { //// public + private
  if (method == 'price') {
    var text = pricehint;
  }
  if (method == 'ticker') {
    var text = tickerhint;
  }
  if (method == 'chart') {
    var text = charthint;
  }
  if (method == 'stats') {
    var text = statshint;
  }
  var data = loadMsg(chatid,text);
    if (chattype == 'private') {
      var keyboard = keyboardMain();
      data = loadMsgKey(chatid,text,keyboard);
    }
  sendToTG(data);
  return true;
}

function bot_list(chatid,method) { //// callback only
  var symbols = getCache().symbols;
  var text = choosetext;
  var keyboard = keyboardList(method,symbols);
  var data = loadMsgKey(chatid,text,keyboard);
  sendToTG(data);
  return true;
}

function bot_charts(chatid,timeframe) { //// callback only
  var text = choosecharttext;
  var keyboard = keyboardCharts(timeframe);
  var data = loadMsgKey(chatid,text,keyboard);
  sendToTG(data);
  return true;
}

function bot_back(chatid){ //// callback only
  var text = infotext;
  var keyboard = keyboardMain();
  var data = loadMsgKey(chatid,text,keyboard);
  sendToTG(data);
  return true;
}

function bot_echoGroupID(chatid,userid){ //// public + private (hidden command)
  var text = "Current Group-ID:\n\n" + chatid + "\n\nYour User-ID:\n\n" + userid;
  var data = loadMsg(chatid,text);
  sendToTG(data);
  return true;
}
