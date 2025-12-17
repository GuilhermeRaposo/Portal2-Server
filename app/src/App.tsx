import { createRoot } from "react-dom/client";
import MapName from "./MapName";
import Map from "./Map";
import { StrictMode } from "react";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
    return (
        <>
            <h1>Hello from Portal 2 in React!</h1>
            <MapName />
            <Map />
        </>
    );
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
