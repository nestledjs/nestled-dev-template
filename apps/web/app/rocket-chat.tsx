import React from 'react'

export function RocketChatScript() {
  const scriptContent = `
    (function(w, d, s, u) {
      // Initialize the RocketChat object and its properties
      w.RocketChat = w.RocketChat || function(c) { w.RocketChat._.push(c); };
      w.RocketChat._ = w.RocketChat._ || [];
      w.RocketChat.url = u;

      // Create and insert the script element
      var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.async = true;
      j.src = 'https://nestled-templatenow.rocket.chat/livechat/rocketchat-livechat.min.js?_=201903270000';
      h.parentNode.insertBefore(j, h);
    })(window, document, 'script', 'https://nestled-templatenow.rocket.chat/livechat');
  `

  return <script dangerouslySetInnerHTML={{ __html: scriptContent }} />
}
