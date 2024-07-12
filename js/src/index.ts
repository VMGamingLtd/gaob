import { WebSocketClient } from './wsClient';
import { ProtobufRoot } from './proto';
import { Dispatcher } from './dispatcher';
import {
    NAMESPACE_ID__UnityBrowserChannel,
    CLASS_ID_BaseMessages,
    METHOD_ID_ReceiveString
} from './dispatcher';
import { BaseMessages } from './messages/unityBrowserMessaging/BaseMessages'

const FILE = 'index.ts';

WebSocketClient.gWsClient = new WebSocketClient();
WebSocketClient.gWsClient.start();


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
        let dataMessageHeader = Dispatcher.encodeMessageObject(pbMessageHeader, moMessageHeader);
        let dataMessageString = Dispatcher.encodeMessageObject(pbMessageString, moMessageString);

        // concatenate message header and message string
        let data = new Uint8Array(dataMessageHeader.byteLength + dataMessageString.byteLength);
        data.set(new Uint8Array(dataMessageHeader), 0);
        data.set(new Uint8Array(dataMessageString), dataMessageHeader.byteLength);

        WebSocketClient.gWsClient.send(moMessageHeader, data.buffer);
    } catch (err) {
        console.error(`${FILE}:${FUNC}: ${err}`);
    }
}

function keepPinging() {
    setInterval(() => {
        let msg = JSON.stringify(
            {
                message: "Hello from browser!"
            }
        );
        BaseMessages.sendString(msg);
    }, 5000)

}

(window as any).GAO_SET_JWT_TOKEN = function(token: string): void {
    WebSocketClient.setJwtToken(token);
    keepPinging();
}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@
const jwt = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJCcm9vZDkyODMwIiwiZXhwIjo0ODc0Mjk4OTY4LCJ1c2VyX2lkIjo3NiwidXNlcl90eXBlIjoiR3Vlc3RVc2VyIiwiZGV2aWNlX2lkIjoxfQ.GXDlQG6HhVscnr3MzbK3vS5NQrP8paC2lJ2Fp1tHAp_YlT85PMdgWPywzzgNDAGVCIdDF46pfeWOnv6yWZVsSVU0xkOk35y3npBERrc8t6xsHbXTlmWYZeD52DVqkF2jHmqzA_nWCD_Nwb3JvdMrzbuRrgnEiJCTiqksFik-Sm5VYP-cSsaB4Y8Xg5tqX1by5Hd6oVRs1QcKLFy-c9Z3GGJUls9HI0BfgWEanGEPKsKjK7vQxSqSIH8Yo7G5BGNpcC74S5Y7KC-Q3VGJNf8seT0pYON6RsnLik6IOASLsb_7bsNe-fDKlSz5d5mpe8nYnhSzhzhjGyXp49576pKIBLZtd5pby6oIiYSfGG4gFNFcDraU1RiHWq0zvmnutfwXq0oQUOkUcU-7ps3rHcERxVxOQB4jIcSW2TaMPVeEwxePhKzXpImgyKgIm4BxIZIoetKXammPbFMwKfCgziw5raCAh1G2MULKw5peKoV43Fimz0qB4b51Kim873Mq7174LTATKJaTafYFHOEynWCXLsxM1vB1IiNbY2mnZJF-s26RPqbyhThoLaO4_4_eEbGEm7FFYvwtgWdfsOMr2gO1iN1ZLwWzWjvOrCuNqUMNu5Uhoowb5_v4GmFHfFr_zNaQ--94cCxcKJCIN3XCUNngJBysVbZErKURPhFzBwVkf9M';
WebSocketClient.setJwtToken(jwt);
keepPinging();
console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ cp 351: jwt was set');
// @@@@@@@@@@@@@@@@@@@@@@@@@@@
