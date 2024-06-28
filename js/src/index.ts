import * as _ from 'lodash';
import { CWebSocketClient } from './wsClient';
import { CProtobufRoot } from './proto';
import { CDispatcher } from './dispatcher';
import {
    NAMESPACE_ID__UnityBrowserChannel,
    CLASS_ID_BaseMessages,
    METHOD_ID_ReceiveString
} from './dispatcher';

const FILE = 'index.ts';

CWebSocketClient.gWsClient.start();


export function  sendStringToUnity(str: string): void {
    const FUNC = 'sendStringToUnity()';
    try
    {
        if ((window as any).GAO_UnityBrowserChannel) {
            // unity is running in browser,call unity directly
        } else {
            // unity is running in editor, call wsClient

            let dispatcher: CDispatcher = CWebSocketClient.gWsClient.dispatcher;

            let pbMessageHeader = CWebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.MessageHeader');
            let pbMessageString = CWebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.MessageString');

            let moMessageHeader = pbMessageHeader.create({namespaceId: NAMESPACE_ID__UnityBrowserChannel, classId: CLASS_ID_BaseMessages, methodId: METHOD_ID_ReceiveString});
            let moMessageString = pbMessageString.create({str: str});

            // encode message header
            let dataMessageHeader = dispatcher.encodeMessageObject(pbMessageHeader, moMessageHeader);
            let dataMessageString = dispatcher.encodeMessageObject(pbMessageString, moMessageString);

            // concatenate message header and message string
            let data = new Uint8Array(dataMessageHeader.byteLength + dataMessageString.byteLength);
            data.set(new Uint8Array(dataMessageHeader), 0);
            data.set(new Uint8Array(dataMessageString), dataMessageHeader.byteLength);

            CWebSocketClient.gWsClient.send(data.buffer);
        }
    } catch (err) {
        console.error(`${FILE}:${FUNC}: ${err}`);
    }
}