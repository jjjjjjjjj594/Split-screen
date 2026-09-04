function normalizeUrl(u) {
  u = u.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u;
}

function loadPane(n) {
  var input = document.getElementById('url' + n);
  var raw = input.value.trim();

  if (/tradingview/i.test(raw)) {
    loadTradingViewWidget(n, raw);
    return;
  }

  var url = normalizeUrl(raw);
  if (!url) return;
  restoreIframe(n);
  document.getElementById('frame' + n).src = url;
}

function restoreIframe(n) {
  var holder = document.getElementById('holder' + n);
  if (document.getElementById('frame' + n)) return;
  holder.innerHTML = '<iframe id="frame' + n + '"></iframe>';
}

function loadTradingViewWidget(n, raw) {
  var holder = document.getElementById('holder' + n);
  var symbolMatch = raw.match(/tradingview:?\s*([a-zA-Z0-9:]+)?/i);
  var symbol = 'NASDAQ:AAPL';
  if (symbolMatch && symbolMatch[1] && symbolMatch[1].toLowerCase() !== 'tradingview') {
    symbol = symbolMatch[1].toUpperCase();
  }

  holder.innerHTML =
    '<div class="tradingview-widget-container" style="height:100%;width:100%">' +
      '<div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>' +
    '</div>';

  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
  script.async = true;
  script.text = JSON.stringify({
    autosize: true,
    symbol: symbol,
    interval: 'D',
    timezone: 'Etc/UTC',
    theme: 'dark',
    style: '1',
    locale: 'en',
    enable_publishing: false,
    allow_symbol_change: true,
    support_host: 'https://www.tradingview.com'
  });
  holder.querySelector('.tradingview-widget-container').appendChild(script);
}

function openNewTab(n) {
  var input = document.getElementById('url' + n);
  var url = normalizeUrl(input.value);
  if (url) window.open(url, '_blank');
}

['url1', 'url2'].forEach(function(id, i) {
  document.getElementById(id).addEventListener('keydown', function(e) {
    if (e.key === 'Enter') loadPane(i + 1);
  });
});

document.getElementById('layoutSelect').addEventListener('change', function(e) {
  var container = document.getElementById('container');
  container.className = e.target.value;
});

// Draggable divider
var divider = document.getElementById('divider');
var container = document.getElementById('container');
var pane1 = document.getElementById('pane1');
var dragging = false;

divider.addEventListener('mousedown', function() {
  dragging = true;
  document.body.style.userSelect = 'none';
});
window.addEventListener('mouseup', function() {
  dragging = false;
  document.body.style.userSelect = '';
});
window.addEventListener('mousemove', function(e) {
  if (!dragging) return;
  var rect = container.getBoundingClientRect();
  if (container.classList.contains('vertical')) {
    var pct = ((e.clientX - rect.left) / rect.width) * 100;
    pct = Math.min(85, Math.max(15, pct));
    pane1.style.flex = 'none';
    pane1.style.width = pct + '%';
  } else {
    var pct = ((e.clientY - rect.top) / rect.height) * 100;
    pct = Math.min(85, Math.max(15, pct));
    pane1.style.flex = 'none';
    pane1.style.height = pct + '%';
  }
});

// Touch support for mobile dragging
divider.addEventListener('touchstart', function() { dragging = true; });
window.addEventListener('touchend', function() { dragging = false; });
window.addEventListener('touchmove', function(e) {
  if (!dragging) return;
  var t = e.touches[0];
  var rect = container.getBoundingClientRect();
  if (container.classList.contains('vertical')) {
    var pct = ((t.clientX - rect.left) / rect.width) * 100;
    pct = Math.min(85, Math.max(15, pct));
    pane1.style.flex = 'none';
    pane1.style.width = pct + '%';
  } else {
    var pct = ((t.clientY - rect.top) / rect.height) * 100;
    pct = Math.min(85, Math.max(15, pct));
    pane1.style.flex = 'none';
    pane1.style.height = pct + '%';
  }
});
