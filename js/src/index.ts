import { WebSocketClient } from './wsClient';
import { ProtobufRoot } from './proto';
import { Dispatcher } from './dispatcher';
import {
    NAMESPACE_ID__UnityBrowserChannel,
    CLASS_ID_BaseMessages,
    METHOD_ID_ReceiveString
} from './dispatcher';

const FILE = 'index.ts';

WebSocketClient.gWsClient = new WebSocketClient();
//WebSocketClient.gWsClient.start();


export function  sendStringToUnity(str: string): void {
    const FUNC = 'sendStringToUnity()';
    try
    {
        // unity is running in editor, call wsClient

        let dispatcher: Dispatcher = WebSocketClient.gWsClient.dispatcher;

        let pbMessageHeader = WebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.MessageHeader');
        let pbMessageString = WebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.MessageString');

        let moMessageHeader = pbMessageHeader.create({namespaceId: NAMESPACE_ID__UnityBrowserChannel, classId: CLASS_ID_BaseMessages, methodId: METHOD_ID_ReceiveString});
        let moMessageString = pbMessageString.create({str: str});

        // encode message header
        let dataMessageHeader = dispatcher.encodeMessageObject(pbMessageHeader, moMessageHeader);
        let dataMessageString = dispatcher.encodeMessageObject(pbMessageString, moMessageString);

        // concatenate message header and message string
        let data = new Uint8Array(dataMessageHeader.byteLength + dataMessageString.byteLength);
        data.set(new Uint8Array(dataMessageHeader), 0);
        data.set(new Uint8Array(dataMessageString), dataMessageHeader.byteLength);

        WebSocketClient.gWsClient.send(moMessageHeader, data.buffer);
    } catch (err) {
        console.error(`${FILE}:${FUNC}: ${err}`);
    }
}

(window as any).GAO_SET_JWT_TOKEN = function(token: string): void {
    WebSocketClient.setJwtToken(token);
}