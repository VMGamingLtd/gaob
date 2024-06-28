import { BaseMessages } from './messages/unityBrowserMessaging/BaseMessages';

const FILE = 'indexJsLib.ts';

if (!(window as any).GAO_UnityBrowserChannel) {
    (window as any).GAO_UnityBrowserChannel = {}
} 
if (!(window as any).GAO_UnityBrowserChannel.BaseMessages) {
    (window as any).GAO_UnityBrowserChannel.BaseMessages = {}
} 

(window as any).GAO_UnityBrowserChannel.BaseMessages.receiveString = BaseMessages.receiveString;


export function  sendStringToUnity(str: string): void {
    const FUNC = 'sendStringToUnity()';
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
        (window as any).GAO_UnityBrowserChannel.BaseMessages.reciveString(str);
    } catch (err) {
        console.error(`${FILE}:${FUNC}: ${err}`);
    }
}