import { BaseMessages } from './messages/unityBrowserMessaging/BaseMessages';

const FILE = 'indexJsLib.ts';

if (!(window as any).GAO_UnityBrowserChannel) {
    (window as any).GAO_UnityBrowserChannel = {}
} 
if (!(window as any).GAO_UnityBrowserChannel.BaseMessages) {
    (window as any).GAO_UnityBrowserChannel.BaseMessages = {}
} 

(window as any).GAO_UnityBrowserChannel.BaseMessages.receiveString = function (str: string) {
    BaseMessages.receiveString(str);
}


export function  sendStringToUnity(str: string): void {
    const FUNC = 'sendStringToUnity()';
    try
    {
        BaseMessages.sendString(str);
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
        sendStringToUnity(msg);
    }, 5000)

}

// @@@@@@@@@@@@@@@@@@@@@@@@@@@
if (false) {
    keepPinging();
}
// @@@@@@@@@@@@@@@@@@@@@@@@@@@