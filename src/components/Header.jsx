import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";
import { Link } from "react-router-dom";

function Header({ darkMode, setDarkMode }) {
  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo animacija */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2"
        >
          <motion.div
            animate={{ rotate: [0, -20, 20, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Dumbbell className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </motion.div>
          <span className="font-bold text-xl text-blue-600 dark:text-blue-400">
            GymMaster
          </span>
        </motion.div>

        {/* Nav links */}
        <nav className="hidden md:flex gap-6 text-gray-700 dark:text-gray-200">
          <Link to="/" className="hover:text-blue-500">
            Home
          </Link>
          <Link to="/about" className="hover:text-blue-500">
            About
          </Link>
        </nav>

        {/* Dark mode toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-800 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </header>
  );
}

export default Header;
