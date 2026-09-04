function normalizeUrl(u) {
  u = u.trim();
  if (!u) return null;
  if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
  return u;
}

function loadPane(n) {
  var input = document.getElementById('url' + n);
  var url = normalizeUrl(input.value);
  if (!url) return;
  document.getElementById('frame' + n).src = url;
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
