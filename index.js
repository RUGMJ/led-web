import express from 'express';

const app = express();

app.use(express.static('./public'));

app.listen(3000);

let color = '#000000';

app.get('/api/', (req, res) => {
	res.json(color);
});

app.post('/api/:hex', (req, res) => {
	color = req.params.hex;

	updateLeds(color);

	res.json(req.params.hex);
});

function updateLeds(hex) {
	// TODO
}
