"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealScripts() {
  const pathname = usePathname();

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal:not(.active)");
    revealElements.forEach((el) => observer.observe(el));

    // Cleanup observer on unmount or path change
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
