import { CProtobufRoot } from "./proto";
import { CDispatcher } from "./dispatcher";


export class CWebSocketClient 
{
  ws: any;
  dispatcher: CDispatcher;
  isClosed: boolean;

  static gPbRoot: CProtobufRoot = new CProtobufRoot(); 
  static gWsClient: CWebSocketClient = new CWebSocketClient();

  constructor() {
    this.dispatcher = null;
    this.isClosed = false;
  }

  start(): void {

    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.binaryType = 'arraybuffer';

    this.ws.onopen = () => {
      console.log('connected');
      this.dispatcher = new CDispatcher(CWebSocketClient.gPbRoot, CWebSocketClient.gWsClient);
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
      CWebSocketClient.gWsClient = new CWebSocketClient();
      CWebSocketClient.gWsClient.start();
    };

  };

  send(message: ArrayBuffer): void {
    if (!this.isClosed) {
      this.ws.send(message);
    } else {
      console.warn('cannot send a message, websocket is closed, message ignored');
    }
  }
}
