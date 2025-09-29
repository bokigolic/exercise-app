import { Github, Linkedin } from "lucide-react";
import { SiGoogle } from "react-icons/si"; // instaliraj: npm install react-icons

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between px-6 py-3">
        {/* Left side: Social links */}
        <div className="flex gap-4 mt-3 sm:mt-0">
          <a
            href="https://github.com/bokigolic"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-black hover:text-white transition"
          >
            <Github size={18} />
          </a>
          <a
            href="https://www.linkedin.com/in/bojan-golic"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-blue-700 hover:text-white transition"
          >
            <Linkedin size={18} />
          </a>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-red-600 hover:text-white transition"
          >
            <SiGoogle size={18} />
          </a>
        </div>

        {/* Center: Rotating Logo */}
        <div className="flex flex-col items-center">
          <img
            src="/icons/BG.png"
            alt="BG Logo"
            className="w-14 h-14 animate-spin-slow opacity-90 hover:opacity-100 hover:scale-110 transition"
          />
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            © 2025 GymMaster — Built by BG
          </p>
        </div>

        {/* Right side: Empty (for symmetry or future use) */}
        <div className="w-20"></div>
      </div>
    </footer>
  );
}

export default Footer;
