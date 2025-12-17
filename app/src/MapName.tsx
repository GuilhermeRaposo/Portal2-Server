import { useEffect, useState } from "react";
import fetchGameJSON from "./util";

export default function MapName() {
    const [mapName, setMapName] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchGameJSON("MapName");
            if (data) {
                setMapName(data);
            }
        };
        fetchData();
    }, []);

    return (
        <p>
            Map name: <b>{mapName}</b>
        </p>
    );
}
