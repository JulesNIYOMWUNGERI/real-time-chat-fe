export function formatMessageTime(date: any) {
    return new Date(date).toLocaleTimeString("eb-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
    });
}
