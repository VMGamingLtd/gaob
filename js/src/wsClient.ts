import { ProtobufRoot } from "./proto";
import { Dispatcher } from "./dispatcher";
import { WsAuthentication } from "./messages/WsAuthentication";
import { NAMESPACE_ID__UnityBrowserChannel } from "./dispatcher";


export class WebSocketClient 
{
  static CLASS = 'WebSocketClient';

  ws: any;
  dispatcher: Dispatcher;
  private isClosed: boolean;
  private isAuthenticated: boolean

  static gPbRoot: ProtobufRoot = new ProtobufRoot(); 
  static gWsClient: WebSocketClient = new WebSocketClient();
  static jwtToken: string = null;

  constructor() {
    this.dispatcher = null;
    this.isClosed = false;
    this.isAuthenticated = false;
  }

  static setJwtToken(token: string) { 
    WebSocketClient.jwtToken = token;
    if (WebSocketClient.gWsClient) {
      WsAuthentication.authenticate(WebSocketClient.gWsClient, WebSocketClient.jwtToken);
    }
  }

  start(): void {

    this.ws = new WebSocket('ws://localhost:8080');
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
        console.log('message:', e.data);
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
      this.isClosed = true;
      WebSocketClient.gWsClient = new WebSocketClient();
      WebSocketClient.gWsClient.start();
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
    if (!this.isClosed) {
      this.ws.send(message);
    } else {
      console.warn(`${WebSocketClient.CLASS}:${FUNC}: cannot send a message, websocket is closed, message ignored`);
    }
  }

  setAuthenticated(): void {
    this.isAuthenticated = true;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
