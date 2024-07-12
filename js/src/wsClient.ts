import { ProtobufRoot } from "./proto";
import { Dispatcher } from "./dispatcher";
import { WsAuthentication } from "./messages/WsAuthentication";
import { NAMESPACE_ID__UnityBrowserChannel } from "./dispatcher";
import { WEBSOCKET_SERVER_URL } from "./config"


export class WebSocketClient 
{
  static CLASS = 'WebSocketClient';

  ws: any;
  dispatcher: Dispatcher;
  private isAuthenticated: boolean

  static gPbRoot: ProtobufRoot = new ProtobufRoot(); 
  static gWsClient: WebSocketClient = new WebSocketClient();
  static jwtToken: string = null;

  constructor() {
    this.dispatcher = null;
    this.isAuthenticated = false;
  }

  static setJwtToken(token: string) { 
    WebSocketClient.jwtToken = token;
    if (WebSocketClient.gWsClient) {
      WsAuthentication.authenticate(WebSocketClient.gWsClient, WebSocketClient.jwtToken);
    }
  }

  start(): void {

    this.ws = new WebSocket(WEBSOCKET_SERVER_URL);
    this.ws.binaryType = 'arraybuffer';
    this.isAuthenticated = false;

    this.ws.onopen = () => {
      console.log('connected');
      this.dispatcher = new Dispatcher(WebSocketClient.gPbRoot, WebSocketClient.gWsClient);
      if (WebSocketClient.jwtToken) {
        WsAuthentication.authenticate(this, WebSocketClient.jwtToken);
      }
    };

    this.ws.onmessage = (e: any) => {
      const FUNC = 'onmessage()';
      if (e.data instanceof ArrayBuffer) {
        if (this.dispatcher) {
          this.dispatcher.dispatch(e.data);
        } else {
          console.warn(`${WebSocketClient.CLASS}:${FUNC}: dispatcher not ready, message ignored`);
        }
      } else {
        console.error(`${WebSocketClient.CLASS}:${FUNC}: received a non-arraybuffer message, ignored`)
      }
    };

    this.ws.onclose = () => {
      console.log('disconnected');
      setTimeout(() => {
        WebSocketClient.gWsClient = new WebSocketClient();
        WebSocketClient.gWsClient.start();
      }, 9000)
    };

  };

  checkIfAuthenticatedToSend(moMessageHeader: any): boolean {
    if (moMessageHeader.namespaceId === NAMESPACE_ID__UnityBrowserChannel) {
      return this.isAuthenticated;
    } else {
      return true;
    }
  }

  send(moMessageHeader: any, message: ArrayBuffer): void {
    const FUNC = 'send()';
    if (!this.checkIfAuthenticatedToSend(moMessageHeader)) {
      console.warn(`${WebSocketClient.CLASS}:${FUNC}: cannot send a message, websocket is not authenticated, message ignored`);
      return;
    }
    if (this.ws.readyState !== WebSocket.OPEN) {
        console.warn(`${WebSocketClient.CLASS}:${FUNC}: ws is not open, message ignored`);
        return;
    }
    this.ws.send(message);
  }

  setAuthenticated(): void {
    this.isAuthenticated = true;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
