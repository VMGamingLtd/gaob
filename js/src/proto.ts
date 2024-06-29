import ptotobufJsonDescriptor from './bundle.json';
import * as protobuf from 'protobufjs';

/*
export interface IProtobufRoot {
    root: any;
} 


export function getProtobufRoot(): IProtobufRoot {
    return{
        root: protobuf.Root.fromJSON(ptotobufJsonDescriptor)
    }
}
    */

export class ProtobufRoot {
    public root: any;
    ProtobufRoot() {
        this.root = protobuf.Root.fromJSON(ptotobufJsonDescriptor);
    }
}