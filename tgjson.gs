function loadMsg(chatid,text) {
  var data = {
      method: "post",
      payload: {
        method: "sendMessage",
        disable_web_page_preview: "true",
        chat_id: String(chatid),
        text: text,
        parse_mode: "html"
      },
      muteHttpExceptions: true
  }
  return data; 
}

function loadMsgKey(chatid,text,keyboard){
  var data = {
      method: "post",
      payload: {
        method: "sendMessage",
        disable_web_page_preview: "true",
        chat_id: String(chatid),
        text: text,
        parse_mode: "html",
        reply_markup: JSON.stringify(keyboard)
      },
      muteHttpExceptions: true
  }
  return data;
}

function deleteMsg(msgid,chatid) {
  var data = {
      method: "post",
      payload: {
        method: "deleteMessage",
        chat_id: chatid.toString(),
        message_id: msgid.toString()
      },
      muteHttpExceptions: true
  }
  sendToTG(data);
  return true;
}

function loadPic(chatid,cap,pic) {
  var data = {
      method: "post",
      payload: {
        method: "sendPhoto",
        photo: pic,
        chat_id: String(chatid),
        caption: cap,
        parse_mode: "html"
      },
      muteHttpExceptions: true
  }
  return data; 
}

function loadPicKey(chatid,cap,pic,keyboard) {
  var data = {
      method: "post",
      payload: {
        method: "sendPhoto",
        photo: pic,
        chat_id: String(chatid),
        caption: cap,
        parse_mode: "html",
        reply_markup: JSON.stringify(keyboard)
      },
      muteHttpExceptions: true
  }
  return data; 
}

function chatActionTyping(chatid) {
  var data = {
      method: "post",
      payload: {
        method: "sendChatAction",
        chat_id: chatid.toString(),
        action: "typing"
      },
      muteHttpExceptions: true
  }
  return data; 
}

function keyboardMain(){
  var keyboard ={
    inline_keyboard: [
      [
        {
          text: "mAsset prices",
          callback_data: "list_p"
        },
        {
          text: "mAsset stats",
          callback_data: "list_s"
        },
        {
          text: "platform stats",
          callback_data: "mirstats"
        }
      ],
      [
        {
          text: "1d charts",
          callback_data: "charts_1d"
        },
        {
          text: "7d charts",
          callback_data: "charts_7d"
        },
        {
          text: "info",
          callback_data: "info"
        }
      ]
    ],
    resize_keyboard:true,
    one_time_keyboard:true,
    selective: true
  }
  return keyboard;
}

function keyboardCharts(timeframe){
  var keyboard ={
    inline_keyboard: [
      [
        {
          text: "prices",
          callback_data: "list_c" + timeframe.slice(0,1)
        },
        {
          text: "stats (LP)",
          callback_data: 'list_c' + timeframe.slice(0,1) + 'lp'
        },
        {
          text: "mAssets TVL",
          callback_data: "TVL_" + timeframe
        }
      ],
      [
        {
          text: "GOV",
          callback_data: "GOV_" + timeframe
        },
        {
          text: "last 24h",
          callback_data: "LAST24_" + timeframe
        },
        {
          text: "< back",
          callback_data: "back"
        }
      ]
    ],
    resize_keyboard:true,
    one_time_keyboard:true,
    selective: true
  }
  return keyboard;
}

function keyboardList(method,symbols){
  var keyboard = {
    inline_keyboard: [[]],
    resize_keyboard:true,
    one_time_keyboard:true,
    selective: true
  }
  var z = 0;
  if (method.includes('c') == false) {
    keyboard = {
      inline_keyboard: [[{
        text: 'list all',
        callback_data: 'all_' + method
      }]],
      resize_keyboard:true,
      one_time_keyboard:true,
      selective: true
    }
    z = 1;
  }
  var line = 0;
  for (var i = 0; i < symbols.length; i++) {
    keyboard.inline_keyboard[line].push({
      text: symbols[i],
      callback_data: method + '_' + symbols[i]
    });
    z++;
    if (method.slice(0,1) == 'c' && method.includes('lp') == false && symbols[i] == 'MIR') {
      keyboard.inline_keyboard[line].pop();
      z--;
    }
    if (z == 3) {
      keyboard.inline_keyboard.push([]);
      line++;
      z = 0;
    }
  }
  keyboard.inline_keyboard[line].push({
    text: '< back',
    callback_data: "back"
  });
  return keyboard;
}
