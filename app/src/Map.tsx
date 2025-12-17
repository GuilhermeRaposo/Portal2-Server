import { useEffect, useRef, useState } from "react";
import fetchGameJSON from "./util";

type EntClass = "prop_weighted_cube" | "prop_portal" | "prop_testchamber_door";

const entColors: Record<EntClass, string> = {
    prop_weighted_cube: "#5577ff",
    prop_portal: "#ff0000",
    prop_testchamber_door: "#ffffff",
};

export default function Map() {
    const [playerPosition, setPlayerPosition] = useState<{
        x: string;
        y: string;
    }>({ x: "", y: "" });

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        ctx.lineWidth = 2;
        const width = canvas.width;
        const height = canvas.height;

        const fetchData = async () => {
            const points = await fetchGameJSON("TopDown");
            const entities = await fetchGameJSON("Entities");

            if (points && Array.isArray(points)) {
                for (const point of points) {
                    point[0] = -point[0];
                }

                const pos = { x: points[0][0], y: points[0][1] };
                const fvec = { x: points[1][0], y: points[1][1] };

                setPlayerPosition({ x: pos.x, y: pos.y });

                ctx.clearRect(0, 0, width, height);

                ctx.beginPath();
                for (let i = 2; i < points.length; i++) {
                    const x = (points[i][0] / 2048) * width + width / 2;
                    const y = (points[i][1] / 2048) * height + height / 2;

                    if (i === 1) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = "white";
                ctx.fillStyle = "#111";
                ctx.closePath();
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(width / 2, height / 2);
                ctx.lineTo(fvec.x * 32 + width / 2, fvec.y * 32 + height / 2);
                ctx.strokeStyle = "red";
                ctx.stroke();

                ctx.beginPath();
                ctx.arc(width / 2, height / 2, 5, 0, Math.PI * 2);
                ctx.fillStyle = "red";
                ctx.fill();

                for (const entclass in entities) {
                    for (const ent of entities[entclass]) {
                        ctx.beginPath();
                        ctx.arc(
                            ((-ent[0] - pos.x) / 2048) * width + width / 2,
                            ((ent[1] - pos.y) / 2048) * height + height / 2,
                            5,
                            0,
                            Math.PI * 2
                        );
                        ctx.fillStyle = entColors[entclass as EntClass];
                        ctx.fill();
                    }
                }
            }
        };
        setInterval(fetchData, 100);
    }, []);

    const onClick = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = canvas.width;
        const height = canvas.height;
        const rect = canvas.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;

        const worldX = ((cx - width / 2) / width) * 2048 + playerPosition.x;
        const worldY = ((cy - height / 2) / height) * 2048 + playerPosition.y;
        console.log(-worldX, worldY);
        fetchGameJSON("Teleport", `setpos ${-worldX} ${worldY} 0`);
    };

    return (
        <>
            <p>
                Player position:
                <b>{`${playerPosition.x} ${playerPosition.y}`}</b>
            </p>
            <canvas
                width="500"
                height="500"
                ref={canvasRef}
                onClick={(e) => onClick(e)}
            ></canvas>
        </>
    );
}
