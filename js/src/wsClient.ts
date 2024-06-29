import { ProtobufRoot } from "./proto";
import { Dispatcher } from "./dispatcher";
import { NAMESPACE_ID__UnityBrowserChannel } from "./dispatcher";


export class WebSocketClient 
{
  static CLASS_NAME = 'WebSocketClient';

  ws: any;
  dispatcher: Dispatcher;
  private isClosed: boolean;
  private isAuthenticated: boolean

  static gPbRoot: ProtobufRoot = new ProtobufRoot(); 
  static gWsClient: WebSocketClient = new WebSocketClient();

  constructor() {
    this.dispatcher = null;
    this.isClosed = false;
    this.isAuthenticated = false;
  }

  start(): void {

    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      console.log('connected');
      this.dispatcher = new Dispatcher(WebSocketClient.gPbRoot, WebSocketClient.gWsClient);
    };

    this.ws.onmessage = (e: any) => {
      if (e.data instanceof ArrayBuffer) {
        console.log('message:', e.data);
        if (this.dispatcher) {
          this.dispatcher.dispatch(e.data);
        } else {
          console.warn('dispatcher not ready, message ignored');
        }
      } else {
        console.error('received a non-arraybuffer message, ignored')
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
    if (!this.checkIfAuthenticatedToSend(moMessageHeader)) {
      console.warn('cannot send a message, websocket is not authenticated, message ignored');
      return;
    }
    if (!this.isClosed) {
      this.ws.send(message);
    } else {
      console.warn('cannot send a message, websocket is closed, message ignored');
    }
  }

  setAuthenticated(): void {
    this.isAuthenticated = true;
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }
}
