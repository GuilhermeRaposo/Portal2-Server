export default async function fetchGameJSON(content) {
    try {
        const response = await fetch("/", {
            signal: AbortSignal.timeout(200),
            method: content,
        });
        return await response.json();
    } catch (e) {
        return null;
    }
}
