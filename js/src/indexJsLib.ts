import { BaseMessages } from './messages/unityBrowserMessaging/BaseMessages';

const FILE = 'indexJsLib.ts';

if (!(window as any).GAO_UnityBrowserChannel) {
    (window as any).GAO_UnityBrowserChannel = {}
} 
if (!(window as any).GAO_UnityBrowserChannel.BaseMessages) {
    (window as any).GAO_UnityBrowserChannel.BaseMessages = {}
} 

(window as any).GAO_UnityBrowserChannel.BaseMessages.receiveString = function (str: string) {
    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ cp 2000: GAO_UnityBrowserChannel.BaseMessages.receiveString(): ${str}`);
    BaseMessages.receiveString(str);
}


export function  sendStringToUnity(str: string): void {
    const FUNC = 'sendStringToUnity()';
    console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ cp 2100: sendStringToUnity(): ${str}`);
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
keepPinging();
// @@@@@@@@@@@@@@@@@@@@@@@@@@@