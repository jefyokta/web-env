export type SensorMessage = {
  temperature: number;
  dust: number;
  lux: number;
  crisp: number;
};

export type Message<T = SensorMessage> = {
    event : string;
    message: T

}

class WSClient {
    private static instance: WebSocket | null = null

    static getInstance(): WebSocket {
        const wshost = window.location.hostname;
        const isSecure = window.location.protocol === "https:";
        const port = window.location.port || (isSecure ? 443 : 80);
        const protocol = isSecure ? "wss" : "ws";
        const url = `${protocol}://${wshost}:${port}`;
        if (!WSClient.instance || WSClient.instance.readyState === WebSocket.CLOSED) {
            WSClient.instance = new WebSocket(url)
        }
        return WSClient.instance
    }
}

export default WSClient

