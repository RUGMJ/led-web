import express from 'express';
import { Client } from '@paradise-pi/e131';

const app = express();

app.use(express.static('/home/dietpi/led-web/public'));

app.listen(3000);

const client = new Client('192.168.1.73');

let color = '000000';

app.get('/api/', (req, res) => {
	res.json(color);
});

app.get('/api/:hex', (req, res) => {
	color = req.params.hex;
	console.log(color);
	const { r, g, b } = hex_to_RGB(color);
	updateLeds(r, g, b);

	res.json(req.params.hex);
});

function updateLeds(r, g, b) {
	// 🚧 WIP 🚧
	const packet = client.createPacket(170 * 3);
	packet.setUniverse(0x01);
	const slotsData = packet.getSlotsData();

	const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

	for (let i = 2; i < 170 * 3; i += 3) {
		slotsData[i - 2] = clamp(r, 0, 255);
		slotsData[i - 1] = clamp(g, 0, 255);
		slotsData[i - 0] = clamp(b, 0, 255);
	}
	client.send(packet, err => {
		console.log('Sent Packet');
		console.log(err);
	});
}

function hex_to_RGB(hex) {
	var m = hex.match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
	return {
		r: parseInt(m[1], 16),
		g: parseInt(m[2], 16),
		b: parseInt(m[3], 16),
	};
}
