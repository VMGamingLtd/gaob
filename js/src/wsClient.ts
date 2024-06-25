import { IProtobufRoot } from "./proto";

export interface IWebSocketClient {
  inboundMessages: ArrayBuffer[];
  outboundMessages: ArrayBuffer[];
}

export function init(pbRoot: IProtobufRoot) {

  var ws = new WebSocket('ws://localhost:8080');
  ws.binaryType = 'arraybuffer';

  ws.onopen = function() {
    console.log('connected');
    ws.send('Hello Server!');
  };

  ws.onmessage = function(e) {
    console.log('message:', e.data);
  };

  ws.onclose = function() {
    console.log('disconnected');
  };
}