function doPost(e) {  
  var update = JSON.parse(e.postData.contents); 
  if (update.hasOwnProperty('callback_query')) { 
    receiveCallback(update);
    return;
  }
  if (update.hasOwnProperty('callback_query') == false && update.hasOwnProperty('message')) { 
    if (update.message.hasOwnProperty('text')) {
      if (update.message.text.slice(0,1) == '/') {
        receiveBotCommand(update);
        return;
      }
    }
  }
  return;
}

function receiveCallback(update) {

  var callback = update.callback_query;
  var chattype = callback.message.chat.type;
  var msgid = callback.message.message_id;
  var chatid = parseInt(callback.message.chat.id);
  var callbackdata = callback.data; 

  if (callbackdata == 'info') {
    deleteMsg(msgid,chatid);
    bot_info(chatid,chattype);
    return;
  }
  if (callbackdata == 'mirstats') {
    deleteMsg(msgid,chatid);
    bot_mirStats(chatid,chattype);
    return;
  }
  if (callbackdata == 'all_p' || callbackdata == 'all_s') {
    deleteMsg(msgid,chatid);
    bot_allPricesStats(chatid,callbackdata.split('_')[1],chattype);
    return;
  }
  if (callbackdata == 'list_p' || callbackdata == 'list_s' || callbackdata == 'list_c1' || callbackdata == 'list_c7' || callbackdata == 'list_c3' || callbackdata == 'list_c1lp' || callbackdata == 'list_c7lp' || callbackdata == 'list_c3lp') {
    deleteMsg(msgid,chatid);
    bot_list(chatid,callbackdata.split('_')[1]);
    return;
  }
  if (callbackdata.includes('charts_')){
    deleteMsg(msgid,chatid);
    bot_charts(chatid,callbackdata.split('_')[1])
    return;
  }
  if (callbackdata.includes('GOV')){
    deleteMsg(msgid,chatid);
    bot_getStatChart(chatid,'GOV',callbackdata.split('_')[1],chattype)
    return;
  }
  if (callbackdata.includes('TVL')){
    deleteMsg(msgid,chatid);
    bot_getStatChart(chatid,'TVL',callbackdata.split('_')[1],chattype)
    return;
  }
  if (callbackdata.includes('LAST24')){
    deleteMsg(msgid,chatid);
    bot_getStatChart(chatid,'LAST24',callbackdata.split('_')[1],chattype)
    return;
  }
  if (callbackdata.split('_')[0] == 'p' || callbackdata.split('_')[0] == 's') {
    deleteMsg(msgid,chatid);
    bot_assetPricesStatsCallback(chatid,callbackdata.split('_')[0],callbackdata.split('_')[1])
    return;
  }
  if (callbackdata.slice(0,1) == 'c') {
    var data = bot_assetChartCallback(chatid,callbackdata)
    deleteMsg(msgid,chatid);
    var response = sendToTG(data);
    if(response.getResponseCode().toString().includes('40')) {
      bot_sryError(chatid,chattype);
    } 
    return;
  }
  if (callbackdata == 'back') {
    deleteMsg(msgid,chatid);
    bot_back(chatid);
    return;
  }
  return;  
}

function receiveBotCommand(update) {

  var msg = update.message;
  var msgid = msg.message_id;
  var msgtext = msg.text;
  var userid = msg.from.id;
  var chat = msg.chat;
  var chattype = chat.type;
  var chatid = chat.id;

  var chartcommand = false;

  if (msgtext == '/echoGroupID') {
    bot_echoGroupID(chatid,userid);
    return;
  }
  if (msgtext == '/help' || msgtext == '/help@mirror_statbot' || msgtext == '/start' || msgtext == '/start@mirror_statbot' || msgtext == '/commands' || msgtext == '/commands@mirror_statbot' || msgtext == '/info' || msgtext == '/info@mirror_statbot') {
    bot_info(chatid,chattype);
    return;
  }
  if (msgtext == '/stats' || msgtext == '/stats@mirror_statbot' || msgtext == '/mirstats' || msgtext == '/mirstats@mirror_statbot') {
    bot_mirStats(chatid,chattype);
    return;
  }
  if (msgtext == '/p' || msgtext == '/p@mirror_statbot' || msgtext == '/price' || msgtext == '/price@mirror_statbot') {
    bot_hint(chatid,'price',chattype);
    return;
  }
  if (msgtext == '/s' || msgtext == '/s@mirror_statbot' || msgtext == '/stats' || msgtext == '/stats@mirror_statbot') {
    bot_hint(chatid,'stats',chattype);
    return;
  }
  if (msgtext == '/c' || msgtext == '/c@mirror_statbot' || msgtext == '/chart' || msgtext == '/chart@mirror_statbot') {
    chartcommand = true;
    bot_hint(chatid,'chart',chattype);
    return;
  }
  if (msgtext == '/p all' || msgtext == '/p@mirror_statbot all' || msgtext == '/price all' || msgtext == '/price@mirror_statbot all') {
    bot_allPricesStats(chatid,'p',chattype);
    return;
  }
  if (msgtext == '/s all' || msgtext == '/s@mirror_statbot all' || msgtext == '/stats all' || msgtext == '/stats@mirror_statbot all') {
    bot_allPricesStats(chatid,'s',chattype);
    return;
  }
  if (msgtext.slice(0,7) == '/stats ' || msgtext.includes('/stats@mirror_statbot ') || msgtext.slice(0,3) == '/s ' || msgtext.includes('/s@mirror_statbot ')) {
    bot_assetPricesStatsCommand(chatid,msgtext.split(' ')[1],'s',chattype);
    return;
  }
  if (msgtext.slice(0,3) == '/p ' || msgtext.includes('/p@mirror_statbot '|| msgtext.slice(0,7) == '/price ' || msgtext.includes('/price@mirror_statbot '))) {
    bot_assetPricesStatsCommand(chatid,msgtext.split(' ')[1],'p',chattype);
    return;
  }
  if (msgtext.toLowerCase().includes('/c gov ') || msgtext.toLowerCase().includes('/c@mirror_statbot gov ') || msgtext.toLowerCase().includes('/chart gov ') || msgtext.toLowerCase().includes('/chart@mirror_statbot gov ')) {
    if (chartcommand == false) {
      chartcommand = true;
      var timeframe = normalizeTimeframe(msgtext.toLowerCase().split(' ')[2]);
      if (timeframe == false) {
        bot_hint(chatid,'chart',chattype);
      }
      if (timeframe != false) {
        bot_getStatChart(chatid,'GOV',timeframe,chattype);
      }
    }
    return;
  }
  if (msgtext.toLowerCase().includes('/c tvl ') || msgtext.toLowerCase().includes('/c@mirror_statbot tvl ')) {
    if (chartcommand == false) {
      chartcommand = true;
      var timeframe = normalizeTimeframe(msgtext.toLowerCase().split(' ')[2]);
      if (timeframe == false) {
        bot_hint(chatid,'chart',chattype);
      }
      if (timeframe != false) {
        bot_getStatChart(chatid,'TVL',timeframe,chattype);
      }
    }
    return;
  }
  if ((msgtext.toLowerCase().includes('/c ') || msgtext.toLowerCase().includes('/c@mirror_statbot ')) && (msgtext.includes('24 ') || msgtext.includes('24 ') || msgtext.includes('24h ') || msgtext.includes('24h '))) {
    if (chartcommand == false) {
      chartommand = true;
      var timeframe = normalizeTimeframe(msgtext.toLowerCase().split(' ')[2]);
      if (timeframe == false) {
        bot_hint(chatid,'chart',chattype);
      }
      if (timeframe != false) {
        bot_getStatChart(chatid,'LAST24',timeframe,chattype);
      }
    }
    return;
  }
  if (msgtext.slice(0,3) == '/c ' || msgtext.includes('/c@mirror_statbot ') || msgtext.slice(0,7) == '/chart ' || msgtext.includes('/chart@mirror_statbot ')) {
    if (chartcommand == false) {
      bot_assetChartCommand(chatid,msgtext,chattype);
    }
  }
  return;
}
