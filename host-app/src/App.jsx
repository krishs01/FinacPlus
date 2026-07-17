import React, { Suspense, useState } from 'react';

// Lazy-load the remote MusicLibraryWidget from the music_library remote
const MusicLibraryWidget = React.lazy(() => import('music_library/MusicLibraryWidget'));

/**
 * Host App Shell — the "platform" that mounts micro frontends.
 *
 * This demonstrates the Host side of Module Federation:
 * - The shell provides navigation/layout
 * - The MusicLibraryWidget is loaded from a remote at runtime
 * - Each micro frontend is self-contained with its own providers
 */
function App() {
  const [activeTab, setActiveTab] = useState('music');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Host Shell Header */}
      <header style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(10,10,15,0.95)',
        backdropFilter: 'blur(20px)',
        position: 'sticky',
        top: 0,
        zIndex: 30,
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, color: 'white',
            }}>
              🏠
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', lineHeight: 1.2 }}>
                FinacPlus Platform
              </h1>
              <span style={{ fontSize: 10, color: '#64748b', fontWeight: 500, letterSpacing: '0.05em' }}>
                MICRO FRONTEND HOST
              </span>
            </div>
          </div>

          {/* Tab navigation */}
          <nav style={{ display: 'flex', gap: 4 }}>
            {['music', 'about'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: 600, transition: 'all 0.15s',
                  background: activeTab === tab ? 'rgba(139,92,246,0.15)' : 'transparent',
                  color: activeTab === tab ? '#a78bfa' : '#94a3b8',
                }}
              >
                {tab === 'music' ? '🎵 Music Library' : 'ℹ️ About'}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main style={{ flex: 1, maxWidth: 1280, margin: '0 auto', width: '100%', padding: '24px' }}>
        {activeTab === 'music' && (
          <Suspense fallback={
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 12 }}>
              <div style={{
                width: 24, height: 24, borderRadius: '50%',
                border: '3px solid rgba(139,92,246,0.3)',
                borderTopColor: '#8b5cf6',
                animation: 'spin 0.8s linear infinite',
              }} />
              <span style={{ color: '#94a3b8', fontSize: 14 }}>Loading Music Library remote...</span>
            </div>
          }>
            <MusicLibraryWidget />
          </Suspense>
        )}

        {activeTab === 'about' && (
          <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 16, color: '#e2e8f0' }}>
              Micro Frontend Architecture
            </h2>
            <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 14, marginBottom: 24 }}>
              This platform demonstrates <strong style={{ color: '#a78bfa' }}>Module Federation</strong> with Vite.
              The Music Library tab loads a self-contained widget from a separate application
              running on port 5173. Each micro frontend manages its own state, providers, and data fetching.
            </p>
            <div style={{
              padding: 16, borderRadius: 12,
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              textAlign: 'left', fontSize: 13, color: '#64748b', lineHeight: 1.8,
            }}>
              <p><strong style={{ color: '#94a3b8' }}>Host:</strong> localhost:5174 — shell, navigation, layout</p>
              <p><strong style={{ color: '#94a3b8' }}>Remote:</strong> localhost:5173 — Music Library widget (self-contained)</p>
              <p><strong style={{ color: '#94a3b8' }}>Shared:</strong> react, react-dom (single instance via Module Federation)</p>
            </div>
          </div>
        )}
      </main>

      {/* Spinner keyframe */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default App;
