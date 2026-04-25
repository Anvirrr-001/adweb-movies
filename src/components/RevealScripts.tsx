"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function RevealScripts() {
  const pathname = usePathname();

  useEffect(() => {
    document.body.setAttribute('data-reveal-ready', 'true');
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const revealElements = document.querySelectorAll(".reveal:not(.active)");
      revealElements.forEach((el) => {
        if (!el.hasAttribute('data-observed')) {
          el.setAttribute('data-observed', 'true');
          observer.observe(el);
        }
      });
    };

    observeElements();

    const mutationObserver = new MutationObserver(() => {
      observeElements();
    });

    mutationObserver.observe(document.body, { childList: true, subtree: true });

    // Cleanup observer on unmount or path change
    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [pathname]);

  return null;
}
