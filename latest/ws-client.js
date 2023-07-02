class WebSocketClient {
    _ws = null

    _events = []

    _connectionAttempts = 0

    _options = {}

    constructor(options = {}) {
        this._options = {
            useJSON: options.useJSON ?? false,
            timeouts: options.timeouts ?? [ 5000 ]
        }
    }

    _webSocketAsync(url) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url);
            ws.onopen = () => { resolve(ws) }
            ws.onerror = e => { reject(e) }
        });
    }

    async connect(url) {
        if (this.isConnecting() || this.isConnected()) {
            return
        }

        try {
            this._ws = await this._webSocketAsync(url)
            this._connectionAttempts = 0
            console.info('ws-client: %cConnected!', 'color: green')
            this._events.forEach(event => {
                this._ws?.addEventListener(event.type, event.callback)
            })
            this._ws?.addEventListener('close', e => {
                console.info('ws-client: %cConnection terminated!', 'color: red')
                if (!e.wasClean) {
                    console.info(`ws-client: %cTrying to reconnect...`, 'color: orange')
                    this.connect(url)
                }
            })
        } catch (e) {
            console.info('ws-client: %cFailed to connect!', 'color: red')
            const connectionAttemptLimit = this._options.timeouts?.length ?? 1
            if (this._connectionAttempts >= connectionAttemptLimit) {
                console.info('ws-client: %cConnection attempts limit reached!', 'color: orange')
                this._connectionAttempts = 0
                return
            }

            const timeout = this._options.timeouts[this._connectionAttempts++] ?? 5000

            console.info(`ws-client: %cNext connection attempt in ${timeout / 1000} sec.`, 'color: orange')
            setTimeout(async () => {
                await this.connect(url)
            }, timeout)
        }
    }

    addListener(type, callback) {
        this._events.push({type, callback})
        this._ws?.addEventListener(type, callback)
    }

    removeListener(type, callback) {
        this._events = this._events.filter(e => e.callback !== callback)
        this._ws?.removeEventListener(type, callback)
    }

    removeAllListener() {
        this._events.forEach(event => {
            this._ws?.removeEventListener(event.type, event.callback)
        })
        this._events = []
    }

    send(data) {
        if (this._options.useJSON) {
            data = JSON.stringify(data)
        }
        this._ws?.send(data)
    }

    disconnect() {
        this._ws?.close()
        this._ws = null
    }

    isConnecting() {
        return this._ws?.readyState === WebSocket.CONNECTING
    }

    isConnected() {
        return this._ws?.readyState === WebSocket.OPEN
    }

    isClosing() {
        return this._ws?.readyState === WebSocket.CLOSING
    }

    isClosed() {
        return this._ws?.readyState === WebSocket.CLOSED
    }
}
