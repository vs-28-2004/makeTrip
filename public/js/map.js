
var map = L.map('map').setView([28.6139, 77.2090], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© OpenStreetMap contributors'
}).addTo(map);