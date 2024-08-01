
export function emitUnityMessageEvent(json: any): void {
    const event = new CustomEvent("unity_message", { detail: json});
    document.dispatchEvent(event);
}