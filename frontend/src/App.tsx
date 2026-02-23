import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LocationSelector from "./pages/LocationSelector";
import CatalogPage from "./pages/CatalogPage";

function App() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-page">
      <Navbar />
      <Routes>
        <Route path="/" element={<LocationSelector />} />
        <Route path="/menu" element={<CatalogPage />} />
      </Routes>
    </div>
  );
}

export default App;
