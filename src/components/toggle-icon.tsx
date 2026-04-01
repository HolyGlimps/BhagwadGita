import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const Toggle = () => {
     const { theme, setTheme } = useTheme();
     const [mounted, setMounted] = useState(false);

     useEffect(() => {
          setMounted(true);
     }, []);

     const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
          const newTheme = theme === "dark" ? "light" : "dark";

          // Capture click coordinates
          const x = e.clientX;
          const y = e.clientY;

          const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

          if (!document.startViewTransition || prefersReducedMotion) {
               setTheme(newTheme);
               return;
          }

          const root = document.documentElement;
          root.style.setProperty("--x", `${x}px`);
          root.style.setProperty("--y", `${y}px`);

          document.startViewTransition(() => {
               setTheme(newTheme);
          });
     };

     if (!mounted) return null;

     return (
          <>
               <style>{`
                    @keyframes reveal {
                         from {
                              clip-path: circle(0% at var(--x, 50%) var(--y, 50%));
                              opacity: 0.7;
                         }
                         to {
                              clip-path: circle(150% at var(--x, 50%) var(--y, 50%));
                              opacity: 1;
                         }
                    }
                    
                    ::view-transition-new(root) {
                         animation: reveal 0.25s ease-in-out forwards;
                    }
               `}</style>

               <button
                    onClick={handleToggle}
                    className="relative p-2 rounded-full focus:outline-none"
                    aria-label="Toggle theme"
               >
                    {theme === "dark" ? (
                         <Sun className="text-gray-600 dark:text-gray-400 text-lg" />
                    ) : (
                         <Moon className="text-gray-600 dark:text-gray-400 text-lg" />
                    )}
               </button>
          </>
     );
};

export default Toggle;