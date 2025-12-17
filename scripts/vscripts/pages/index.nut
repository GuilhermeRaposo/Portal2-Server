// AUTO-GENERATED FROM index.html
::sendResponse(@"
<!DOCTYPE html>
<html lang='en'>
    <head>
        <meta charset='UTF-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <style>
            body {
                background-color: black;
                color: black;
                margin: 15px;
            }
            body * {
                color: white;
                font-family: sans-serif;
            }
            button {
                border: 2px solid white;
                border-radius: 5px;
                background: black;
                padding: 10px;
                outline: none;
            }
            canvas {
                border: 2px solid white;
                border-radius: 15px;
                display: inline-block;
                margin: 0 15px;
            }
        </style>
        <title>Portal 2 Server</title>
    </head>
    <body>
        <div id='root'></div>

        <script src='https://unpkg.com/react@18/umd/react.development.js'></script>
        <script src='https://unpkg.com/react-dom@18/umd/react-dom.development.js'></script>
        <script src='https://unpkg.com/@babel/standalone/babel.min.js'></script>
        <script type='text/babel'>
            const { useState, useEffect, useRef } = React;

            const root = ReactDOM.createRoot(document.getElementById('root'));

            const App = () => {
                const [mapName, setMapName] = useState('');
                const [playerPosition, setPlayerPosition] = useState('');

                const canvasRef = useRef(null);

                const entColors = {
                    prop_weighted_cube: '#5577ff',
                    prop_portal: '#ff0000',
                    prop_testchamber_door: '#ffffff',
                };

                async function fetchGameJSON(content) {
                    try {
                        const response = await fetch('/', {
                            signal: AbortSignal.timeout(200),
                            method: content,
                        });
                        return await response.json();
                    } catch (e) {
                        return null;
                    }
                }

                useEffect(() => {
                    const fetchData = async () => {
                        const data = await fetchGameJSON('MapName');
                        if (data) {
                            setMapName(data);
                        }
                    };
                    fetchData();
                }, []);

                useEffect(() => {
                    const fetchData = async () => {
                        const points = await fetchGameJSON('TopDown');
                        const entities = await fetchGameJSON('Entities');
                        const slice = await fetchGameJSON('Slice');

                        if (points) {
                            for (const point of points) {
                                point[0] = -point[0];
                            }

                            const pos = { x: points[0][0], y: points[0][1] };
                            const fvec = { x: points[1][0], y: points[1][1] };

                            setPlayerPosition(`${pos.x} ${pos.y}`);

                            const canvas = canvasRef.current;
                            const ctx = canvas.getContext('2d');
                            ctx.lineWidth = 2;
                            const width = canvas.width;
                            const height = canvas.height;

                            ctx.clearRect(0, 0, width, height);

                            ctx.beginPath();
                            for (let i = 2; i < points.length; i++) {
                                const x =
                                    (points[i][0] / 2048) * width + width / 2;
                                const y =
                                    (points[i][1] / 2048) * height + height / 2;

                                if (i === 1) ctx.moveTo(x, y);
                                else ctx.lineTo(x, y);
                            }
                            ctx.strokeStyle = 'white';
                            ctx.fillStyle = '#111';
                            ctx.closePath();
                            ctx.fill();
                            ctx.stroke();

                            ctx.beginPath();
                            ctx.moveTo(width / 2, height / 2);
                            ctx.lineTo(
                                fvec.x * 32 + width / 2,
                                fvec.y * 32 + height / 2
                            );
                            ctx.strokeStyle = 'red';
                            ctx.stroke();

                            ctx.beginPath();
                            ctx.arc(width / 2, height / 2, 5, 0, Math.PI * 2);
                            ctx.fillStyle = 'red';
                            ctx.fill();

                            for (const entclass in entities) {
                                for (const ent of entities[entclass]) {
                                    ctx.beginPath();
                                    ctx.arc(
                                        ((-ent[0] - pos.x) / 2048) * width +
                                            width / 2,
                                        ((ent[1] - pos.y) / 2048) * height +
                                            height / 2,
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
                        <h1>Hello from Portal 2 in React!</h1>
                        <p>
                            Map name: <b>{mapName}</b>
                        </p>
                        <p>
                            Player position: <b>{playerPosition}</b>
                        </p>
                        <canvas
                            width='500'
                            height='500'
                            ref={canvasRef}
                        ></canvas>
                    </>
                );
            };

            root.render(<App />);

            //   const inputFunction = function (event, plus) {
            //     let input = null;

            //     switch (event.key.toLowerCase()) {
            //       case 'w': {
            //         input = 'forward';
            //         break;
            //       }
            //       case 'a': {
            //         input = 'moveleft';
            //         break;
            //       }
            //       case 's': {
            //         input = 'back';
            //         break;
            //       }
            //       case 'd': {
            //         input = 'moveright';
            //         break;
            //       }
            //       case ' ': {
            //         input = 'jump';
            //         break;
            //       }
            //       default:
            //         return;
            //     }

            //     fetch('/', {
            //       method: 'POST',
            //       headers: { Command: `;${plus ? '+' : '-'}${input}` },
            //     });
            //   };

            //   window.addEventListener('keydown', function (event) {
            //     inputFunction(event, true);
            //   });
            //   window.addEventListener('keyup', function (event) {
            //     inputFunction(event, false);
            //   });
        </script>
    </body>
</html>

");