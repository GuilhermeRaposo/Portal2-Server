import { createRoot } from "react-dom";
import MapName from "./MapName";
import Map from "./Map";

const root = createRoot(document.getElementById("root"));

const App = () => {
    return (
        <>
            <h1>Hello from Portal 2 in React!</h1>
            <MapName />
            <Map />
        </>
    );
};

root.render(<App />);
