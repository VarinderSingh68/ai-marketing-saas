"use client"; // Must be at the very top

import { useState } from "react";

export default function GeneratorForm() {
  // 1. Initialize the state
  const [isLoading, setIsLoading] = useState(false);

  // 2. Your generation function
  const handleGenerate = async () => {
    setIsLoading(true); // Start loading
    try {
      // ... your API call code here ...
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // 3. Your JSX
  return (
    <button 
      disabled={isLoading} 
      onClick={handleGenerate}
      className="bg-blue-600 px-6 py-2 rounded text-white disabled:opacity-50"
    >
      {isLoading ? "AI is thinking..." : "Generate Marketing Copy"}
    </button>
  );
}