import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

function Loader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      {/* Teg animacija */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      >
        <Dumbbell size={60} className="text-blue-600 dark:text-blue-400" />
      </motion.div>

      {/* Tekst animacija */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
        className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300"
      >
        Let’s Go Gym! 💪
      </motion.p>
    </div>
  );
}

export default Loader;
