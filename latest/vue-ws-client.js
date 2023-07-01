export default class WebSocketClient {
    _connection = null

    _events = []

    _useJSON = false

    constructor() {
        //
    }

    useJSON(value) {
        this._useJSON = value
    }

    _webSocketAsync(url) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url);
            ws.onopen = () => { resolve(ws) }
            ws.onerror = e => { reject(e) }
        });
    }

    async connect(url, timeout = 3000) {
        if (this.isConnecting() || this.isConnected()) {
            return
        }

        try {
            this._connection = await this._webSocketAsync(url)
            console.info('Websocket: %cConnected!', 'color: #28a745')
            this._events.forEach(event => {
                this._connection.addEventListener(event.type, event.callback)
            })
            this._connection.addEventListener('close', e => {
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
        this._events.push({type, callback})
        this._connection?.addEventListener(type, callback)
    }

    removeAllListener() {
        this._events.forEach(event => {
            this._connection?.removeEventListener(event.type, event.callback)
        })
        this._events = []
    }

    send(data) {
        if (this._useJSON) {
            data = JSON.stringify(data)
        }
        this._connection?.send(data)
    }

    disconnect() {
        this._connection?.close()
        this._connection = null
    }

    isConnecting() {
        return this._connection?.readyState === WebSocket.CONNECTING
    }

    isConnected() {
        return this._connection?.readyState === WebSocket.OPEN
    }

    isClosing() {
        return this._connection?.readyState === WebSocket.CLOSING
    }

    isClosed() {
        return this._connection?.readyState === WebSocket.CLOSED
    }
}
