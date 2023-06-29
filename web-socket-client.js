class WebSocketClient {	
	#connection = null
	
	#events = []
	
	#states = {
		CONNECTING: 0,
		OPEN: 1,
		CLOSING: 2,
		CLOSED: 3
	}
	
	#webSocketAsync(url) {
		return new Promise((resolve, reject) => {
			const ws = new WebSocket(url);
			ws.onopen = () => { resolve(ws) }
			ws.onerror = e => { reject(e) }
		});
	}
	
	async connect(url, timeout) {
		if (this.isConnecting() || this.isConnected() ) {
			return
		}
		
		try {
			this.#connection = await this.#webSocketAsync(url)
			console.info('Websocket: %cConnected!', 'color: #28a745')
			this.#events.forEach(event => {
				this.#connection.addEventListener(event.type, event.callback)
			})
			this.#connection.addEventListener('close', e => {
				console.info('Websocket: %cConnection terminated!', 'color: #dc3545')
				if (!e.wasClean) {
					console.info('Websocket: %cTrying to reconnect...', 'color: #ffc107')
					setTimeout(async () => await this.connect(url), timeout)
				}
			})
		} catch (e) {
			console.info('Websocket: %cTrying to connect...', 'color: #ffc107')
			setTimeout(async () => await this.connect(url), timeout)
		}
	}
	
	addEventListener(type, callback) {
		this.#events.push({type, callback})
		this.#connection?.addEventListener(type, callback)
	}
	
	removeAllListener() {
		this.#events.forEach(event => {
			this.#connection?.removeEventListener(event.type, event.callback)
		})
		this.#events = []
	}
	
	send(name, data = null) {
		this.#connection?.send(JSON.stringify({name, data}))
	}
	
	disconnect() {
		this.#connection?.close()
	}
	
	isConnecting() {
		return this.#connection?.readyState === this.#states.CONNECTING
	}
	
	isConnected() {
		return this.#connection?.readyState === this.#states.OPEN
	}
	
	isClosing() {
		return this.#connection?.readyState === this.#states.CLOSING
	}
	
	isClosed() {
		return this.#connection?.readyState === this.#states.CLOSED
	}
}
