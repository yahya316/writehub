'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || query.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${query}`);
        const data = await res.json();
        const mappedResults = (data.results || []).map(item => ({
          ...item,
          href: item.slug ? `/story/${item.slug}` : item.href || `/story/${item._id}` 
        }));
        setResults(mappedResults);
        setShowDropdown(true);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300); 

    return () => clearTimeout(timeout);
  }, [query, isMounted]);

  const handleSelect = (href) => {
    setQuery("");
    setShowDropdown(false);
    router.push(href);
  };

  if (!isMounted) {
    return (
      <div className="relative w-full">
        <input type="text" placeholder="Search..." className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"/>
        <FaSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"/>
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search..."
        className="w-full pl-10 pr-4 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all duration-200"
      />
      <FaSearch className="w-5 h-5 absolute left-3 top-2.5 text-gray-400 dark:text-gray-500" />

      {showDropdown && results.length > 0 && (
        <ul className="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 mt-1 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {results.map((item, i) => (
            <li
              key={i}
              onClick={() => handleSelect(item.href)}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200">
              {item.title || item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}