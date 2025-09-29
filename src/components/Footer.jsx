import { useEffect, useState } from "react";
import { Github, Linkedin } from "lucide-react";
import { SiGoogle } from "react-icons/si";

function Footer() {
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        // scrolling down → sakrij footer
        setVisible(false);
      } else {
        // scrolling up → pokaži footer
        setVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <footer
      className={`fixed bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 shadow-lg transition-transform duration-500 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-2">
        {/* Left side: Social links */}
        <div className="flex gap-3">
          <a
            href="https://github.com/bokigolic"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-black hover:text-white transition"
          >
            <Github size={16} />
          </a>
          <a
            href="https://www.linkedin.com/in/bojan-golic"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-blue-700 hover:text-white transition"
          >
            <Linkedin size={16} />
          </a>
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-red-600 hover:text-white transition"
          >
            <SiGoogle size={16} />
          </a>
        </div>

        {/* Center: Rotating Logo */}
        <div className="flex flex-col items-center">
          <img
            src="/icons/BG.png"
            alt="BG Logo"
            className="w-10 h-10 animate-spin-slow opacity-90 hover:opacity-100 hover:scale-110 transition"
          />
          <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1">
            © 2025 GymMaster — Built by BG
          </p>
        </div>

        {/* Right side: Spacer */}
        <div className="w-16"></div>
      </div>
    </footer>
  );
}

export default Footer;
