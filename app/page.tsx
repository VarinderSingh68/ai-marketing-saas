"use client";

import { useCompletion } from "@ai-sdk/react";
import { useState, useEffect } from "react";
import { Copy, Check, History, Sparkles, LogOut, Loader2 } from "lucide-react";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { createClient } from "@/utils/supabase";
import { savePostToDatabase } from "./actions";

export default function Home() {
  const [tone, setTone] = useState("Professional");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const supabase = createClient();

  // 1. AI Logic with Auto-Save
  const { completion, input, handleInputChange, handleSubmit, isLoading } = useCompletion({
    api: "/api/generate",
    body: { tone },
    onFinish: async (prompt, result) => {
      // Automatically save to Supabase when the AI finishes typing
      await savePostToDatabase(result, tone);
      fetchHistory(); 
    },
  });

  // 2. Load history from Supabase
  const fetchHistory = async () => {
    const { data } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    if (data) setHistory(data);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const copyToClipboard = () => {
    if (!completion) return;
    navigator.clipboard.writeText(completion);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* HEADER / NAVIGATION */}
      <nav className="border-b bg-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">MarketerAI</span>
        </div>
        
        <div>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500 hidden sm:inline italic underline decoration-blue-200">Pro Account Active</span>
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 p-6 md:p-10">
        
        {/* LEFT COLUMN: Input (Span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-2xl font-bold mb-6">Create Content</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Brand Tone</label>
                  <select 
                    value={tone} 
                    onChange={(e) => setTone(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer"
                  >
                    <option>Professional</option>
                    <option>Witty & Sarcastic</option>
                    <option>Bold & Viral</option>
                    <option>Empathetic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">What are we writing today?</label>
                <textarea 
                  className="w-full p-4 h-40 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                  value={input}
                  onChange={handleInputChange}
                  placeholder="e.g. A thread about why AI won't replace developers, but developers using AI will..."
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading || !input}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {isLoading ? <Loader2 className="animate-spin" /> : <Sparkles size={18} />}
                {isLoading ? "Generating Magic..." : "Generate Content"}
              </button>
            </form>
          </div>

          {/* AI OUTPUT AREA */}
          {completion && (
            <div className="bg-white border-2 border-blue-100 p-8 rounded-3xl relative shadow-xl shadow-blue-50/50 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">Draft Ready</span>
                <button 
                  onClick={copyToClipboard} 
                  className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                  {copied ? "Copied!" : "Copy Text"}
                </button>
              </div>
              <div className="whitespace-pre-line text-lg text-slate-700 leading-relaxed font-medium">
                {completion}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Sidebar (Span 5) */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 h-fit max-h-[85vh] overflow-y-auto sticky top-28 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <History size={18} className="text-blue-500" /> Recent Activity
              </h2>
            </div>
            
            <div className="space-y-4">
              {history.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-slate-400 text-sm italic">Your history is empty.</p>
                </div>
              )}
              {history.map((post) => (
                <div key={post.id} className="p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all group cursor-pointer">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black text-blue-500 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">{post.tone}</span>
                    <span className="text-[10px] text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="line-clamp-3 text-sm text-slate-600 leading-snug italic">"{post.content}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}