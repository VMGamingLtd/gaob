import { ProtobufRoot } from './proto';
import { WebSocketClient } from './wsClient';
import { BaseMessages } from './messages/unityBrowserMessaging/BaseMessages';
import { WsAuthentication } from './messages/WsAuthentication';

const FILE = 'dispatcher.ts';

export const NAMESPACE_ID__WebSocket = 1;
export const CLASS_ID_Authenticate = 2;
export const METHOD_ID_AuthenticateRequest = 1;
export const METHOD_ID_AuthenticateResponse = 2;

export const NAMESPACE_ID__UnityBrowserChannel = 2;
export const CLASS_ID_BaseMessages = 1;
export const METHOD_ID_ReceiveString = 1;



export class Dispatcher
{
    private pbRoot: ProtobufRoot; 
    private wsClient: WebSocketClient;
    private pbMessageHeader: any;

    public constructor(pbRoot: ProtobufRoot, wsClient: WebSocketClient) {
        this.pbRoot = pbRoot;
        this.wsClient = wsClient;
        this.pbMessageHeader = pbRoot.root.lookupType('GaoProtobuf.MessageHeader');

    }

    readMessageObjectSize(message: ArrayBuffer, offset: number): number {
        let view = new DataView(message);
        return view.getUint32(offset, true);
    }

    encodeMessageObjectSize(size: number): ArrayBuffer {
        let data = new ArrayBuffer(4);
        let view = new DataView(data);
        view.setUint32(0, size, true);
        return data
    }

    readMessageObject(message: ArrayBuffer, offset: number, pbMessageObject: any): { moMessageObject: any, size: number} {
        const FUNC = 'readMessageObject()';
        try {
            let headerSize = this.readMessageObjectSize(message, offset);
            let data = new Uint8Array(message, offset + 4, headerSize);
            let moMessageObject = pbMessageObject.decode(data);
            return { moMessageObject, size: 4 + headerSize };
        } catch (err) {
            console.error(`${FILE}:${FUNC}: error`, err);
            throw new Error('readMessageHeader failed');
        }
    }

    encodeMessageObject(pbMessageObject: any, moMessageObject: any): ArrayBuffer {
        const FUNC = 'encodeMessageObject()';
        try {
            let dataMo = pbMessageObject.encode(moMessageObject).finish();
            let dataMoSize = this.encodeMessageObjectSize(dataMo.length);

            let data = new Uint8Array(dataMoSize.byteLength + dataMo.length);
            // serialize message object size to view
            data.set(new Uint8Array(dataMoSize), 0);
            // serialize message object to view
            data.set(dataMo, dataMoSize.byteLength);

            return data.buffer

        } catch (err) {
            console.error(FILE, FUNC, err);
            throw new Error('encodeMessageObject() failed');
        }
    }

    private _dispatch(message: ArrayBuffer, offset: number) {
        let { moMessageObject: moMessageHeader, size } = this.readMessageObject(message, offset, this.pbMessageHeader);
        offset += size;
        this.__dispatch(message, offset, moMessageHeader);
    }

    private __dispatch(message: ArrayBuffer, offset: number, moMessageHeader: any) {
        const FUNC = '__dispatch()';
        if (moMessageHeader.namespaceId === NAMESPACE_ID__UnityBrowserChannel) {

            if (moMessageHeader.classId === CLASS_ID_BaseMessages) {
                if (moMessageHeader.methodId === METHOD_ID_ReceiveString) {
                    let pbMessage = this.pbRoot.root.lookupType('GaoProtobuf.StringMessage');
                    let { moMessageObject: moMessage, size } = this.readMessageObject(message, offset, pbMessage);
                    BaseMessages.receiveString(moMessage.str);
                    offset += size;
                } else {
                    console.warn(`${FILE}:${FUNC}: unknown methodId: ${moMessageHeader.methodId}`);
                }
            } else {
                console.warn(`${FILE}:${FUNC}: unknown classId: ${moMessageHeader.classId}`);
            }

        } else if (moMessageHeader.namespaceId === NAMESPACE_ID__WebSocket) {

            if (moMessageHeader.classId === CLASS_ID_Authenticate) {
                if (moMessageHeader.methodId === METHOD_ID_AuthenticateResponse) {
                    let pbAuthenticateResponse = this.pbRoot.root.lookupType('GaoProtobuf.AuthenticateResponse');
                    let pbAuthenticationResultEnum = this.pbRoot.root.lookupType('GaoProtobuf.AuthenticationResult');
                    let { moMessageObject: moMessage, size } = this.readMessageObject(message, offset, pbAuthenticateResponse);
                } else {
                    console.warn(`${FILE}:${FUNC}: unknown methodId: ${moMessageHeader.methodId}`);
                }
            } else {
                console.warn(`${FILE}:${FUNC}: unknown classId: ${moMessageHeader.classId}`);
            }

        } else {
            console.warn(`${FILE}:${FUNC}: unknown namespaceId: ${moMessageHeader.namespaceId}`);
        }

        this.disposeRequests();
    }

    public dispatch(message: ArrayBuffer) {
        console.log('dispatching message:', message);
        this._dispatch(message, 0);
    }

    private disposeRequests() {
        // dispose requests
        WsAuthentication.diposeRequests();
    }


}

