
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
        console.log(`${BaseMessages.CLASS_NAME}:${FUNC}: in browser: ${str}`);
        try {
            let json = JSON.parse(str);
            emitUnityMessageEvent(json);
        } catch (err) {
            console.error(`${BaseMessages.CLASS_NAME}:${FUNC}: in browser: ${err}`);
        }
    }

    static sendString(str: string): void {
        const FUNC = 'sendString()';
        try
        {
            if ((window as any).GAO_UnityBrowserChannel) {
                // unity is running in browser,call unity directly
                try
                {
                    if (!(window as any).GAO_UnityBrowserChannel) {
                        throw new Error('window.GAO_UnityBrowserChannel is not defined');
                    } 
                    if (!(window as any).GAO_UnityBrowserChannel.BaseMessages) {
                        throw new Error('window.GAO_UnityBrowserChannel.BaseMessages is not defined');
                    } 
                    if (!(window as any).GAO_UnityBrowserChannel.BaseMessages.sendString) {
                        throw new Error('window.GAO_UnityBrowserChannel.BaseMessages.sendString is not defined');
                    }
                    (window as any).GAO_UnityBrowserChannel.BaseMessages.sendString(str);
                } catch (err) {
                    console.error(`${BaseMessages.CLASS_NAME}:${FUNC}: in browser: error sending directly, ${err}`);
                }
            } else {
                try {
                    // unity is running in editor, call wsClient

                    let dispatcher: Dispatcher = WebSocketClient.gWsClient.dispatcher;

                    let pbMessageHeader = WebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.MessageHeader');
                    let pbStringMessage = WebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.StringMessage');

                    let moMessageHeader = pbMessageHeader.create({namespaceId: NAMESPACE_ID__UnityBrowserChannel, classId: CLASS_ID_BaseMessages, methodId: METHOD_ID_ReceiveString});
                    let moStringMessage = pbStringMessage.create({str: str});

                    // encode message header
                    let dataMessageHeader = Dispatcher.encodeMessageObject(pbMessageHeader, moMessageHeader);
                    let dataStringMessage = Dispatcher.encodeMessageObject(pbStringMessage, moStringMessage);

                    // concatenate message header and message string
                    let data = new Uint8Array(dataMessageHeader.byteLength + dataStringMessage.byteLength);
                    data.set(new Uint8Array(dataMessageHeader), 0);
                    data.set(new Uint8Array(dataStringMessage), dataMessageHeader.byteLength);

                    WebSocketClient.gWsClient.send(moMessageHeader, data.buffer);
                } catch (err) {
                    console.error(`${BaseMessages.CLASS_NAME}:${FUNC}: in browser: error sending via wsClient, ${err}`);
                }   
            }
        } catch (err) {
            console.error(`${BaseMessages.CLASS_NAME}:${FUNC}: in browser: ${err}`);
        }
    }
}
