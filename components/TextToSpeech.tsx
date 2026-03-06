"use client";

import { useState } from "react";
import { Play, Square, Download } from "lucide-react";

export default function TextToSpeech({ text }: { text: string }) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handlePlay = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([text], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "ai-content.txt";
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="flex items-center gap-4 mt-4 p-4 border rounded-lg bg-gray-50">
      <button
        onClick={isSpeaking ? handleStop : handlePlay}
        className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
      >
        {isSpeaking ? <Square size={16} /> : <Play size={16} />}
        {isSpeaking ? "Stop" : "Listen"}
      </button>

      <button
        onClick={handleDownload}
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
      >
        <Download size={16} />
        Download Text
      </button>
    </div>
  );
}