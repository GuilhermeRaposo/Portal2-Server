import { useEffect, useRef, useState } from "react";
import fetchGameJSON from "./util";

const entColors = {
    prop_weighted_cube: "#5577ff",
    prop_portal: "#ff0000",
    prop_testchamber_door: "#ffffff",
};

export default function Map() {
    const [playerPosition, setPlayerPosition] = useState("");

    const canvasRef = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            const points = await fetchGameJSON("TopDown");
            const entities = await fetchGameJSON("Entities");

            if (points) {
                for (const point of points) {
                    point[0] = -point[0];
                }

                const pos = { x: points[0][0], y: points[0][1] };
                const fvec = { x: points[1][0], y: points[1][1] };

                setPlayerPosition(`${pos.x} ${pos.y}`);

                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                ctx.lineWidth = 2;
                const width = canvas.width;
                const height = canvas.height;

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
                        ctx.fillStyle = entColors[entclass];
                        ctx.fill();
                    }
                }
            }
        };
        setInterval(fetchData, 100);
    }, []);

    return (
        <>
            <p>
                Player position: <b>{playerPosition}</b>
            </p>
            <canvas width="500" height="500" ref={canvasRef}></canvas>
        </>
    );
}
