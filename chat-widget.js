/* Pixel North website assistant widget. Needs /api/chat (functions/api/chat.js).
   To switch it off, remove the <script src="/chat-widget.js"> tag from the page. */
(function () {
  "use strict";
  if (window.__pnChat) return;
  window.__pnChat = true;

  var CSS =
    "#pn-chat-btn{position:fixed;right:16px;bottom:16px;z-index:2147482000;display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;background:#5B21E6;color:#fff;font:500 16px/1 'DM Sans',system-ui,sans-serif;padding:14px 20px;border-radius:999px;box-shadow:0 6px 20px rgba(26,16,51,.3)}" +
    "#pn-chat-btn:hover{background:#4A18C4}#pn-chat-btn:focus-visible,#pn-chat input:focus-visible,#pn-chat button:focus-visible{outline:3px solid #FF3D8B;outline-offset:2px}" +
    "#pn-chat-btn i{display:block;width:9px;height:9px;background:#FF3D8B}" +
    "#pn-chat{position:fixed;right:16px;bottom:16px;z-index:2147482001;width:min(380px,calc(100vw - 32px));height:min(540px,calc(100dvh - 32px));display:none;flex-direction:column;background:#fff;color:#1A1033;border-radius:20px;overflow:hidden;box-shadow:0 12px 40px rgba(26,16,51,.35);font:400 15px/1.45 'DM Sans',system-ui,sans-serif;color-scheme:light}" +
    "#pn-chat.open{display:flex}" +
    "#pn-chat header{background:#5B21E6;color:#fff;padding:14px 16px;display:flex;align-items:center;justify-content:space-between}" +
    "#pn-chat header b{font:700 18px 'Outfit',system-ui,sans-serif;letter-spacing:-.3px}#pn-chat header span{display:block;font-size:12.5px;opacity:.85}" +
    "#pn-chat header button{background:transparent;border:0;color:#fff;font-size:26px;line-height:1;cursor:pointer;padding:2px 8px;border-radius:8px}" +
    "#pn-chat .log{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;background:#F1EBFF}" +
    "#pn-chat .m{max-width:86%;padding:10px 14px;border-radius:16px;white-space:pre-wrap;overflow-wrap:anywhere}" +
    "#pn-chat .m.bot{background:#fff;align-self:flex-start;border-bottom-left-radius:4px}" +
    "#pn-chat .m.me{background:#5B21E6;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}" +
    "#pn-chat .m a{color:inherit;text-decoration:underline}" +
    "#pn-chat .m.wait{color:#6B5B95}" +
    "#pn-chat .note{font-size:12.5px;color:#4A3F6B;background:#fff;border-top:1px solid #E3D9FA;padding:8px 14px}" +
    "#pn-chat form{display:flex;gap:8px;padding:10px 12px;background:#fff;border-top:1px solid #E3D9FA}" +
    "#pn-chat input{flex:1;min-width:0;font:inherit;font-size:16px;padding:10px 14px;border:2px solid #CFC0F5;border-radius:999px;color:#1A1033}" +
    "#pn-chat form button{border:0;cursor:pointer;background:#FF3D8B;color:#1A1033;font:700 15px 'DM Sans',system-ui,sans-serif;padding:0 18px;border-radius:999px}" +
    "#pn-chat form button:disabled{opacity:.5;cursor:default}" +
    "@media (max-width:480px){#pn-chat{right:8px;bottom:8px;width:calc(100vw - 16px);height:calc(100dvh - 16px)}}";

  var st = document.createElement("style");
  st.textContent = CSS;
  document.head.appendChild(st);

  var btn = document.createElement("button");
  btn.id = "pn-chat-btn";
  btn.type = "button";
  btn.setAttribute("aria-haspopup", "dialog");
  btn.setAttribute("aria-expanded", "false");
  btn.innerHTML = "<i></i>Ask a question";

  var box = document.createElement("div");
  box.id = "pn-chat";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Ask Pixel North a question");
  box.innerHTML =
    '<header><div><b>Ask Pixel North</b><span>AI assistant, not James</span></div><button type="button" aria-label="Close chat">&times;</button></header>' +
    '<div class="log" role="log" aria-live="polite"></div>' +
    '<div class="note">AI answers can be wrong, and quotations only come from James. Please don’t share personal details here. <a href="/privacy.html">Privacy</a></div>' +
    '<form><input type="text" maxlength="500" placeholder="Type your question" aria-label="Your question" autocomplete="off"><button type="submit">Send</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(box);

  var log = box.querySelector(".log");
  var form = box.querySelector("form");
  var input = box.querySelector("input");
  var send = form.querySelector("button");
  var closeBtn = box.querySelector("header button");
  var history = [];
  var busy = false;

  function add(text, cls) {
    var d = document.createElement("div");
    d.className = "m " + cls;
    d.textContent = text;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function fallback() {
    var d = add("Sorry, I can’t answer right now. Please use the contact form, or email ", "bot");
    var a = document.createElement("a");
    a.href = "mailto:jedarlington@live.co.uk";
    a.textContent = "jedarlington@live.co.uk";
    d.appendChild(a);
    d.appendChild(document.createTextNode("."));
  }

  function open() {
    box.classList.add("open");
    btn.style.display = "none";
    btn.setAttribute("aria-expanded", "true");
    if (!log.children.length) add("Hi, I’m the Pixel North website assistant. Ask me about the services, how quotes work, or how to get in touch.", "bot");
    input.focus();
  }

  function close() {
    box.classList.remove("open");
    btn.style.display = "";
    btn.setAttribute("aria-expanded", "false");
    btn.focus();
  }

  btn.addEventListener("click", open);
  closeBtn.addEventListener("click", close);
  box.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var q = input.value.trim();
    if (!q || busy) return;
    busy = true;
    send.disabled = true;
    input.value = "";
    add(q, "me");
    history.push({ role: "user", content: q });
    var wait = add("Thinking…", "bot wait");

    fetch("/api/chat", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-6) })
    })
      .then(function (r) { return r.ok ? r.json() : Promise.reject(new Error("bad status")); })
      .then(function (data) {
        if (!data || !data.reply) throw new Error("empty");
        wait.className = "m bot";
        wait.textContent = data.reply;
        history.push({ role: "assistant", content: data.reply });
      })
      .catch(function () {
        wait.remove();
        history.pop();
        fallback();
      })
      .then(function () {
        busy = false;
        send.disabled = false;
        log.scrollTop = log.scrollHeight;
        input.focus();
      });
  });
})();
