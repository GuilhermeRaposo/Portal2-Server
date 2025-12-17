export default async function fetchGameJSON(method: string) {
    try {
        const response = await fetch("/", {
            signal: AbortSignal.timeout(200),
            method: method,
        });
        return await response.json();
    } catch {
        return null;
    }
}
