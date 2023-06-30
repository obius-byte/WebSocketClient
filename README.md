# WebSocketClient
 Javascript WebSocket with reconnect

## Installing

### Local
```html
<script src="/ws-client.min.js"></script>
```

## Example

### Sending and receiving data in JSON format
```js
const ws = new WebSocketClient();
ws.useJSON(true);

// Instant connection
/*(async () => {
	await ws.connect('ws://127.0.0.1:8006', 5000)
	ws.addEventListener('message', (e) => {
		const message = JSON.parse(e.data)
		console.log('onmessage', message)
	});
})();*/

async function connect() {
	await ws.connect('ws://127.0.0.1:8006', 5000)	
	ws.removeAllListener()
	ws.addEventListener('message', (e) => {
		const message = JSON.parse(e.data)
		console.log('onmessage', message)
	});
}

function state() {
	console.info('isConnecting: ' + ws.isConnecting())
	console.info('isConnected: ' + ws.isConnected())
	console.info('isClosing: ' + ws.isClosing())
	console.info('isClosed: ' + ws.isClosed())
}

function send() {
	ws.send({ name: 'selectFolder' });
}

function disconnect() {
	ws.disconnect();
}
```

### Without JSON format
```js
const ws = new WebSocketClient();
ws.useJSON(false);

async function connect() {
	await ws.connect('ws://127.0.0.1:8006', 5000)	
	ws.removeAllListener()
	ws.addEventListener('message', (e) => {
		const message = e.data
		console.log('onmessage', message)
	});
}

function send() {
	ws.send('selectFolder')
}

```

## License

[MIT](LICENSE)
