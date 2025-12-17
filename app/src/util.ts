export default async function fetchGameJSON(method: string, body?: string) {
    try {
        const response = await fetch("/", {
            signal: AbortSignal.timeout(200),
            method: method,
            headers: {
                Command: ";" + body,
            },
        });
        return await response.json();
    } catch {
        return null;
    }
}
