import { WebSocketClient } from '../wsClient';
import {
    NAMESPACE_ID__WebSocket,
    CLASS_ID_Authenticate,
    METHOD_ID_AuthenticateRequest,
    METHOD_ID_AuthenticateResponse
} from '../dispatcher';
import { Dispatcher } from '../dispatcher';

import { v4 as uuidv4 } from 'uuid';


enum AuthenticationStatus {
    UNAUTHENTICATED = 0,
    AUTHENTICATING = 1,
    AUTHENTICATED = 2,
    ERROR = 3

}

export class WsAuthentication {
    static CLASS = 'WsAuthentication';
    authenticationStatus: AuthenticationStatus = AuthenticationStatus.UNAUTHENTICATED;

    static requests: {[key: string]: WsAuthentication} = {};
    public requestStartAt: Date;


    private wsClient: WebSocketClient;

    constructor(wsClient: WebSocketClient) {
        this.wsClient = wsClient;
    }


    public static authenticate(wsClient: WebSocketClient, token: string): void {
        const FUNC = 'authenticate()';
        console.log(`${WsAuthentication.CLASS}:${FUNC}: authenticating...`);

        let wsAuthentication = new WsAuthentication(wsClient);
        try {
            wsAuthentication.authenticationStatus = AuthenticationStatus.AUTHENTICATING;

            let pbMessageHeader = WebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.MessageHeader');
            let pbAuthenticateRequest = WebSocketClient.gPbRoot.root.lookupType('GaoProtobuf.AuthenticateRequest');

            let moMessageHeader = pbMessageHeader.create({namespaceId: NAMESPACE_ID__WebSocket, classId: CLASS_ID_Authenticate, methodId: METHOD_ID_AuthenticateRequest});
            let moAuthenticateRequest = pbAuthenticateRequest.create({
                token: token,
                requestId: uuidv4()
            });

            wsAuthentication.requestStartAt = new Date();
            WsAuthentication.requests[moAuthenticateRequest.requestId] = wsAuthentication;


            // encode message header
            let dataMessageHeader = Dispatcher.encodeMessageObject(pbMessageHeader, moMessageHeader);
            let dataAuthenticateRequest = Dispatcher.encodeMessageObject(pbAuthenticateRequest, moAuthenticateRequest);

            // concatenate message header and message string
            let data = new Uint8Array(dataMessageHeader.byteLength + dataAuthenticateRequest.byteLength);
            data.set(new Uint8Array(dataMessageHeader), 0);
            data.set(new Uint8Array(dataAuthenticateRequest), dataMessageHeader.byteLength);

            wsClient.send(moMessageHeader, data.buffer);
        } catch (err) {
            wsAuthentication.authenticationStatus = AuthenticationStatus.ERROR;
            console.error(`${WsAuthentication.CLASS}:${FUNC}: ${err}`);
        }

    }

    static receiveAuthenticateResponse(moAuthenticateReqponse: any, pbAuthenticationResultEnum: any): void {
        const FUNC = 'receiveAuthenticateResponse()';
        let requestId = moAuthenticateReqponse.requestId;

        // find the request
        let request = WsAuthentication.requests[requestId];
        if (request) {
            if (moAuthenticateReqponse.result == pbAuthenticationResultEnum.values.success) {
                request.authenticationStatus = AuthenticationStatus.AUTHENTICATED;
                console.log(`${WsAuthentication.CLASS}:${FUNC}: athenticated`);
                request.wsClient.setAuthenticated();
            } else if (moAuthenticateReqponse.result == pbAuthenticationResultEnum.values.unauthorized) {
                request.authenticationStatus = AuthenticationStatus.UNAUTHENTICATED
            } else if (moAuthenticateReqponse.result == pbAuthenticationResultEnum.values.error) {
                request.authenticationStatus = AuthenticationStatus.ERROR;
            } else {
                console.warn(`${WsAuthentication.CLASS}:${FUNC}: unknown result: ${moAuthenticateReqponse.result}`);
            }
            delete WsAuthentication.requests[requestId];
        }
        else {
            console.warn(`${WsAuthentication.CLASS}:${FUNC}: request not found`);
        }
    }

    static diposeRequests(): void {
        const FUNC = 'diposeRequests()';
        // dispose requests that are older than 10 seconds or have status other than AUTHENTICATING
        let now = new Date();
        for (let key in WsAuthentication.requests) {
            let request = WsAuthentication.requests[key];
            if (now.getTime() - request.requestStartAt.getTime() > 10000) { 
                  if (request.authenticationStatus != AuthenticationStatus.AUTHENTICATING) {
                    console.warn(`${WsAuthentication.CLASS}:${FUNC}: request timed out: ${key}`);
                  }
                delete WsAuthentication.requests[key];
            }
        }
    }


}