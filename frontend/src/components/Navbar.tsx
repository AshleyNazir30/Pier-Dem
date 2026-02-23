import { observer } from "mobx-react-lite";
import { Moon, Sun } from "lucide-react";
import { useStore } from "../stores/rootStore";

const Navbar = observer(() => {
  const { themeStore } = useStore();

  return (
    <nav className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/60 bg-surface/80 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <div className="flex-1" />
      
      <span className="text-xl font-bold tracking-tight text-text-primary">
        Per Diem
      </span>
      
      <div className="flex flex-1 justify-end">
        <button
          onClick={() => themeStore.toggleTheme()}
          className="flex h-10 w-10 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-elevated hover:text-text-primary"
          aria-label={themeStore.isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {themeStore.isDark ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </button>
      </div>
    </nav>
  );
});

export default Navbar;
