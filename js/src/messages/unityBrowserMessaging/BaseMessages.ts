
import { WebSocketClient } from '../../wsClient';
import { ProtobufRoot } from '../../proto';
import { Dispatcher } from '../../dispatcher';
import {
    NAMESPACE_ID__UnityBrowserChannel,
    CLASS_ID_BaseMessages,
    METHOD_ID_ReceiveString
} from '../../dispatcher';
import { emitUnityMessageEvent } from '../../events';

export class BaseMessages
{
    static  CLASS_NAME = 'BaseMessages';
    static receiveString(str: string): void {
        const FUNC = 'receiveString()';
        console.log(`${BaseMessages.CLASS_NAME}:${FUNC}: ${str}`);
        try {
            let json = JSON.parse(str);
            emitUnityMessageEvent(json);
        } catch (err) {
            console.error(`${BaseMessages.CLASS_NAME}:${FUNC}: ${err}`);
        }
    }

    static sendString(str: string): void {
        const FUNC = 'sendString()';
        console.log(`${BaseMessages.CLASS_NAME}:${FUNC}: ${str}`);
        try
        {
            if ((window as any).GAO_UnityBrowserChannel) {
                // unity is running in browser,call unity directly
            } else {
                // unity is running in editor, call wsClient

                let dispatcher: Dispatcher = WebSocketClient.gWsClient.dispatcher;

                let pbMessageHeader = WebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.MessageHeader');
                let pbMessageString = WebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.MessageString');

                let moMessageHeader = pbMessageHeader.create({namespaceId: NAMESPACE_ID__UnityBrowserChannel, classId: NAMESPACE_ID__UnityBrowserChannel, methodId: METHOD_ID_ReceiveString});
                let moMessageString = pbMessageString.create({str: str});

                // encode message header
                let dataMessageHeader = dispatcher.encodeMessageObject(pbMessageHeader, moMessageHeader);
                let dataMessageString = dispatcher.encodeMessageObject(pbMessageString, moMessageString);

                // concatenate message header and message string
                let data = new Uint8Array(dataMessageHeader.byteLength + dataMessageString.byteLength);
                data.set(new Uint8Array(dataMessageHeader), 0);
                data.set(new Uint8Array(dataMessageString), dataMessageHeader.byteLength);

                WebSocketClient.gWsClient.send(moMessageHeader, data.buffer);
            }
        } catch (err) {
            console.error(`${BaseMessages.CLASS_NAME}:${FUNC}: ${err}`);
        }
    }
}
