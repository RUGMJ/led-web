const Root = document.querySelector(':root');

const Color = document.querySelector('#color');
const Hex = document.querySelector('#hex');

Color?.addEventListener('change', e => {
	e.preventDefault();
	setProperties(e.target.value);
	SetHexValue(e.target.value);
});

function setProperties(hex) {
	Root.style.setProperty('--background', hex);
	Root.style.setProperty('--text', invertColor(hex, true));
	Hex.innerText = hex;
}

async function SetHexValue(hex) {
	await fetch(`/api/${hex.replace('#', '')}`);
}

async function Refresh() {
	const res = await fetch('/api');
	const hex = await res.json();
	Color.value = `#${hex}`;
	setProperties(`#${hex}`);
}

Refresh();

setInterval(() => Refresh(), 100);

function invertColor(hex, bw) {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	// convert 3-digit hex to 6-digits.
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	var r = parseInt(hex.slice(0, 2), 16),
		g = parseInt(hex.slice(2, 4), 16),
		b = parseInt(hex.slice(4, 6), 16);
	if (bw) {
		// https://stackoverflow.com/a/3943023/112731
		return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
	}
	// invert color components
	r = (255 - r).toString(16);
	g = (255 - g).toString(16);
	b = (255 - b).toString(16);
	// pad each with zeros and return
	return '#' + padZero(r) + padZero(g) + padZero(b);
}
