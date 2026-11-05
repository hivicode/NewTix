"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        aria-label="Ganti tema"
        className="w-11 h-11"
      >
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label={
        resolvedTheme === "dark"
          ? "Ganti ke mode siang (kertas)"
          : "Ganti ke mode malam (venue)"
      }
      title={
        resolvedTheme === "dark"
          ? "Mode Siang (Kertas)"
          : "Mode Malam (Venue)"
      }
      className="w-11 h-11"
    >
      {resolvedTheme === "dark" ? (
        <Sun className="h-4 w-4 text-mustard" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}

