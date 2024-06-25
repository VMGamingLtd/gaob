import { IWebSocketClient } from './wsClient';
import { IProtobufRoot } from './proto';

const FILE = 'dispatcher.ts';

export interface IDispatcher {
    dispatch: (message: ArrayBuffer) => void;
}

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


export function makeDispatcher(pbRoot: IProtobufRoot, wsClient: IWebSocketClient): IDispatcher {
    let pbMessageHeader = pbRoot.root.lookupType('GaoProtobuf.MessageHeader');

    function _dispatch(message: ArrayBuffer, offset: number) {

        let { moMessageObject: moMessageHeader, size } = readMessageObject(message, offset, pbMessageHeader);
        offset += size;
        __dispatch(message, offset, moMessageHeader);
    }

    function __dispatch(message: ArrayBuffer, offset: number, moMessageHeader: any) {
    }


    let dispatcher: IDispatcher = {
        dispatch: function(message: ArrayBuffer) {
            console.log('dispatching message:', message);
        },
    }
    return dispatcher;
}