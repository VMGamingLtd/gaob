import { CProtobufRoot } from './proto';
import { CWebSocketClient } from './wsClient';
import { BaseMessages } from './messages/unityBrowserMessaging/BaseMessages';

const FILE = 'dispatcher.ts';

export const NAMESPACE_ID__UnityBrowserChannel = 2;
export const CLASS_ID_BaseMessages = 1;
export const METHOD_ID_ReceiveString = 1;

/*
function readMessageObjectSize(message: ArrayBuffer, offset: number): number {
    let view = new DataView(message);
    return view.getUint32(offset, true);
}

function writeMessageObjectSize(message: ArrayBuffer, offset: number,  size: number) {
    let view = new DataView(message);
    view.setUint32(offset, size, true);
}

function readMessageObject(message: ArrayBuffer, offset: number, pbMessageObject: any): { moMessageObject: any, size: number} {
    const FUNC = 'readMessageObject()';
    try {
        let headerSize = readMessageObjectSize(message, offset);
        let data = new Uint8Array(message, offset + 4, headerSize);
        let moMessageObject = pbMessageObject.decode(data);
        return { moMessageObject, size: 4 + headerSize };
    } catch (err) {
        console.error(`${FILE}:${FUNC}: error`, err);
        throw new Error('readMessageHeader failed');
    }
}

function writeMessageObject(message: ArrayBuffer, offset: number, pbMessageObject: any, moMessageObject: any): number {
    const FUNC = 'writeMessageObject()';
    try {
        let data = pbMessageObject.encode(moMessageObject).finish();
        writeMessageObjectSize(message, offset, data.length);
        let view = new Uint8Array(message, offset + 4, data.length);
        view.set(data);
        return 4 + data.length;
    } catch (err) {
        console.error(FILE, FUNC, err);
        throw new Error('writeMessageHeader failed');
    }
}
    */

export class CDispatcher
{
    private pbRoot: CProtobufRoot; 
    private wsClient: CWebSocketClient;
    private pbMessageHeader: any;

    public constructor(pbRoot: CProtobufRoot, wsClient: CWebSocketClient) {
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
        const FUNC = 'writeMessageObject()';
        try {
            let dataMo = pbMessageObject.encode(moMessageObject).finish();
            let dataMoSize = this.encodeMessageObjectSize(dataMo.length);

            let data = new Uint8Array(dataMoSize.byteLength + dataMo.length);
            // copy dataMoSize to view
            data.set(new Uint8Array(dataMoSize), 0);
            // copy dataMo to view
            data.set(dataMo, dataMoSize.byteLength);

            return data.buffer

        } catch (err) {
            console.error(FILE, FUNC, err);
            throw new Error('writeMessageHeader failed');
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
            console.log('dispatching message:', moMessageHeader);
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
        } else {
            console.warn(`${FILE}:${FUNC}: unknown namespaceId: ${moMessageHeader.namespaceId}`);
        }
    }

    public dispatch(message: ArrayBuffer) {
        console.log('dispatching message:', message);
    }


}

