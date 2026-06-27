'use client';

import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [showName, setShowName] = useState('');
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, show_name: showName || undefined }),
      });
      const data = await res.json();
      if (data.success) setSongs(data.data);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-pink-900 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <span className="text-5xl">🎵</span>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
              TuneFind
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Find songs from any TV show or movie</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700 shadow-2xl mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Song name or lyrics..."
              className="px-6 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
            <input
              type="text"
              value={showName}
              onChange={(e) => setShowName(e.target.value)}
              placeholder="Show or movie name..."
              className="px-6 py-4 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-pink-500"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!query || loading}
            className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? 'Searching...' : '🔍 Find Songs'}
          </button>
        </div>

        {songs.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-pink-400">Found Songs</h2>
            {songs.map((song, i) => (
              <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-pink-500 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <span className="text-3xl">🎵</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{song.title}</h3>
                    <p className="text-gray-400">{song.artist} • {song.album}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-pink-400 font-semibold">S{song.season}E{song.episode}</p>
                    <p className="text-sm text-gray-400">{song.timestamp}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 bg-slate-700 rounded-full text-sm">{song.show_name}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {songs.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎧</div>
            <p className="text-gray-400">Search for a song to find where it appeared</p>
          </div>
        )}
      </div>
    </main>
  );
}
