# WebSocketClient
 Javascript WebSocket with reconnect

## Installing

### CDN
```html
<script src="https://cdn.statically.io/gh/obius-byte/ws-client/master/latest/ws-client.min.js"></script>
```

## Example

### Sending and receiving data in JSON format
```js
const ws = new WebSocketClient({
    useJSON: true,
    timeouts: [
        1000,
        5000,
        10000,
        30000,
        60000
    ]
});

// Instant connection
/*(async () => {
	await ws.connect('ws://127.0.0.1:8006')
	ws.addListener('message', (e) => {
		const message = JSON.parse(e.data)
		console.log('onmessage', message)
	});
})();*/

async function connect() {
	await ws.connect('ws://127.0.0.1:8006')	
	ws.addListener('message', (e) => {
		const message = JSON.parse(e.data)
		console.log('onmessage[lambda]', message)
	});
}

function state() {
	console.info('isConnecting: ' + ws.isConnecting())
	console.info('isConnected: ' + ws.isConnected())
	console.info('isClosing: ' + ws.isClosing())
	console.info('isClosed: ' + ws.isClosed())
}

function onMessage(e) {
    const message = JSON.parse(e.data)
    console.log('onmessage[function]', message)
}

function addListener() {
    ws.addListener('message', onMessage)
}

function removeListener() {
    ws.removeListener('message', onMessage)
}

function send() {
	ws.send({ name: 'selectFolder' });
}

function disconnect() {
    ws.removeAllListener()
	ws.disconnect();
}
```

### Without JSON format
```js
const ws = new WebSocketClient({
    useJSON: false,
    timeouts: [
        1000,
        5000,
        10000,
        30000,
        60000
    ]
});

async function connect() {
	await ws.connect('ws://127.0.0.1:8006')	
	ws.addListener('message', (e) => {
		const message = e.data
		console.log('onmessage', message)
	});
}

function send() {
	ws.send('selectFolder')
}
```

### Vue
```js
import WebSocketClient from './libs/vue-ws-client.js'

const ws = new WebSocketClient({
    useJSON: true,
    timeouts: [
        1000,
        5000,
        10000,
        30000,
        60000
    ]
});

export default {
    mounted() {
        (async () => {
            await this.connect()
            this.addListener() 
        })();
    },
    unmounted() {
        this.disconnect()
    },
    methods: {
        async connect() {
            await ws.connect('ws://127.0.0.1:8006')  
        },
        addListener() {
            ws.addListener('message', this.onMessage)
        },
        removeListener() {
            ws.removeListener('message', this.onMessage)
        },   
        removeAllListener() {
            ws.removeAllListener()
        },       
        onMessage(e) {
            const message = JSON.parse(e.data)
            console.log('onmessage', message)
        },
        send() {
            ws.send({ name: 'selectFolder' })
        },
        disconnect() {
            ws.disconnect()
        }
    }
}
```

## License

[MIT](LICENSE)
