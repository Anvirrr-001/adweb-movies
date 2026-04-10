"use client";

import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (q) {
      router.push(`/movies?q=${encodeURIComponent(q)}`);
    } else {
      router.push("/movies");
    }
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setQuery("");
      inputRef.current?.blur();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-unit" style={{ flex: 1, maxWidth: "480px" }}>
      <span className="search-icon">🔍</span>
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search movies, trailers..."
        className="search-input"
        aria-label="Search movies"
      />
    </form>
  );
}
