# WebSocketClient
 Javascript WebSocket with reconnect

## Installing

### Local
```html
<script src="/path-to-file/web-socket-client.js"></script>
```

## Example

### Sending and receiving data in JSON format
```js
var wsClient = new WebSocketClient();
wsClient.useJSON(true);

// Instant connection
/*(async () => {
	await wsClient.connect('ws://127.0.0.1:8006')
	wsClient.addEventListener('message', (e) => {
		const message = JSON.parse(e.data)
		console.log('onmessage', message)
	});
})();*/

async function connect() {
	await wsClient.connect('ws://127.0.0.1:8006', 5000)
	
	wsClient.removeAllListener()
	wsClient.addEventListener('message', (e) => {
		const message = JSON.parse(e.data)
		console.log('onmessage', message)
	});
}

function state() {
	console.info('isConnecting: ' + wsClient.isConnecting())
	console.info('isConnected: ' + wsClient.isConnected())
	console.info('isClosing: ' + wsClient.isClosing())
	console.info('isClosed: ' + wsClient.isClosed())
}

function send() {
	wsClient.send({ name: 'selectFolder' });
}

function disconnect() {
	wsClient.disconnect();
}
```

### Without JSON format
```js
var wsClient = new WebSocketClient();
wsClient.useJSON(false);

async function connect() {
	await wsClient.connect('ws://127.0.0.1:8006', 5000)
	
	wsClient.removeAllListener()
	wsClient.addEventListener('message', (e) => {
		const message = e.data
		console.log('onmessage', message)
	});
}

...

function send() {
	wsClient.send('selectFolder);
}

...
```

## License

[MIT](LICENSE)
