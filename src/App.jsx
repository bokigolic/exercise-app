import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import About from "./components/About";
import Bmi from "./components/Bmi";
import FitnessHub from "./components/FitnessHub";
import WorkoutGenerator from "./components/WorkoutGenerator.jsx"; // ✅ novi dodatak
import Footer from "./components/Footer";

function App() {
  return (
    <BrowserRouter>
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
          <Link
            to="/"
            className="font-bold text-xl text-blue-600 dark:text-blue-400"
          >
            FitMotion
          </Link>
          <nav className="flex gap-6 text-gray-700 dark:text-gray-200">
            <Link to="/" className="hover:text-blue-500">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-500">
              About
            </Link>
            <Link to="/bmi" className="hover:text-blue-500">
              BMI
            </Link>
            <Link to="/hub" className="hover:text-blue-500">
              Hub
            </Link>
            <Link to="/generator" className="hover:text-blue-500">
              Generator
            </Link>
          </nav>
        </div>
      </header>

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/bmi" element={<Bmi />} />
        <Route path="/hub" element={<FitnessHub />} />
        <Route path="/generator" element={<WorkoutGenerator />} />{" "}
        {/* ✅ nova ruta */}
      </Routes>

      {/* Footer */}
      <Footer />
    </BrowserRouter>
  );
}

export default App;
