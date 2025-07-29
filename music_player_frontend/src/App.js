import React, { useState, useRef } from "react";
import "./App.css";

// Sample music data for demonstration (replace with API/backend integration)
const DEMO_TRACKS = [
  {
    id: 1,
    title: "River Flows",
    artist: "Soft Piano",
    duration: "3:25",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Dreams Alive",
    artist: "LoFi Cloud",
    duration: "2:48",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Arcade Jam",
    artist: "Synthwave FL",
    duration: "4:12",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    title: "Acoustic Roads",
    artist: "Acoustic Bros",
    duration: "2:59",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    id: 5,
    title: "Midnight Ride",
    artist: "Nightshift",
    duration: "3:41",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
];

const NAV_OPTIONS = [
  { icon: "🎵", label: "Library" },
  { icon: "🎧", label: "Playlists" },
  { icon: "🕑", label: "Recently Played" },
];

const COLOR_THEME = {
  primary: "#50e3c2",          // Main highlight, Electric Cyan
  secondary: "#151929",        // Deep Navy
  accent: "#ff36a3",           // Magenta Accent
  gold: "#ffd662",             // Gold, new highlight
};

// PUBLIC_INTERFACE
function App() {
  // App state
  const [tab, setTab] = useState("Library");
  const [search, setSearch] = useState("");
  const [currentTrack, setCurrentTrack] = useState(DEMO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([DEMO_TRACKS[0], DEMO_TRACKS[1]]);
  const audioRef = useRef(null);

  // Derived state
  const filteredTracks = DEMO_TRACKS.filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase())
  );

  // PUBLIC_INTERFACE
  function handlePlay(track) {
    setCurrentTrack(track);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.load();
      audioRef.current.play();
    }
  }

  // PUBLIC_INTERFACE
  function handlePause() {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }

  // PUBLIC_INTERFACE
  function handlePlayPause() {
    if (!currentTrack) return;
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay(currentTrack);
    }
  }

  // PUBLIC_INTERFACE
  function handlePrev() {
    const list = tab === "Playlist" ? playlist : filteredTracks;
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    const prevIdx = idx > 0 ? idx - 1 : list.length - 1;
    handlePlay(list[prevIdx]);
  }

  // PUBLIC_INTERFACE
  function handleNext() {
    const list = tab === "Playlist" ? playlist : filteredTracks;
    const idx = list.findIndex((t) => t.id === currentTrack.id);
    const nextIdx = idx === list.length - 1 ? 0 : idx + 1;
    handlePlay(list[nextIdx]);
  }

  // PUBLIC_INTERFACE
  function addToPlaylist(track) {
    if (!playlist.find((t) => t.id === track.id)) {
      setPlaylist([...playlist, track]);
    }
  }

  // PUBLIC_INTERFACE
  function removeFromPlaylist(track) {
    setPlaylist(playlist.filter((t) => t.id !== track.id));
    if (currentTrack && currentTrack.id === track.id) {
      setCurrentTrack(null);
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
    }
  }

  // PUBLIC_INTERFACE
  function onAudioEnd() {
    handleNext();
  }

  // PUBLIC_INTERFACE
  function renderTrackRow(track, showAddBtn = false, showRemoveBtn = false) {
    return (
      <div
        key={track.id}
        className={
          "track-row" +
          (currentTrack && track.id === currentTrack.id ? " active" : "")
        }
        onClick={() => handlePlay(track)}
        tabIndex={0}
        aria-label={`Play ${track.title} by ${track.artist}`}
      >
        <div className="track-main">
          <div className="track-title">{track.title}</div>
          <div className="track-artist">{track.artist}</div>
        </div>
        <div className="track-meta">
          <div className="track-duration">{track.duration}</div>
          {showAddBtn && (
            <button
              className="track-action"
              onClick={(e) => {
                e.stopPropagation();
                addToPlaylist(track);
              }}
            >
              +
            </button>
          )}
          {showRemoveBtn && (
            <button
              className="track-action"
              onClick={(e) => {
                e.stopPropagation();
                removeFromPlaylist(track);
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderTracksPanel() {
    // Main music library browsing or Playlist
    const showPlaylist = tab === "Playlists";
    const list = showPlaylist ? playlist : filteredTracks;
    return (
      <div className="tracks-panel">
        {list.length === 0 ? (
          <div className="empty-panel">
            {showPlaylist
              ? "No tracks in your playlist."
              : "No matching music found."}
          </div>
        ) : (
          list.map((track) =>
            renderTrackRow(
              track,
              tab === "Library",
              tab === "Playlists"
            )
          )
        )}
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderSidebar() {
    return (
      <aside className="sidebar">
        <div className="logo">
          <span
            style={{
              color: COLOR_THEME.accent,
              fontWeight: 900,
              fontSize: 32,
              fontFamily: "'Quicksand','Segoe UI',sans-serif",
              background: "linear-gradient(98deg,#50e3c2 0%,#ff36a3 90%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 2px 10px #ff36a3)"
            }}
          >
            Streamify
          </span>
        </div>
        <nav className="nav">
          {NAV_OPTIONS.map((opt) => (
            <div
              className={
                "nav-item" + (tab === opt.label ? " selected" : "")
              }
              key={opt.label}
              tabIndex={0}
              aria-label={opt.label}
              onClick={() => setTab(opt.label === "Recently Played" ? "Library" : opt.label)}
            >
              <span className="nav-icon">{opt.icon}</span>
              <span className="nav-label">{opt.label}</span>
            </div>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div style={{ fontSize: "0.85em", color: COLOR_THEME.accent }}>
            Minimal Music Player
          </div>
        </div>
      </aside>
    );
  }

  // PUBLIC_INTERFACE
  function renderSearchBar() {
    return (
      <div className="search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Search songs or artists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search music"
        />
      </div>
    );
  }

  // PUBLIC_INTERFACE
  function renderPlayerControls() {
    return (
      <div className="player-bar">
        <audio
          ref={audioRef}
          src={currentTrack ? currentTrack.url : ""}
          autoPlay={isPlaying}
          onEnded={onAudioEnd}
          onPause={() => setIsPlaying(false)}
          onPlay={() => setIsPlaying(true)}
        />
        <div className="player-details">
          {currentTrack ? (
            <>
              <div>
                <div className="player-title">{currentTrack.title}</div>
                <div className="player-artist">{currentTrack.artist}</div>
              </div>
              <div className="player-controls">
                <button className="player-btn" onClick={handlePrev} aria-label="Previous">
                  &#9198;
                </button>
                <button className="player-btn main" onClick={handlePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button className="player-btn" onClick={handleNext} aria-label="Next">
                  &#9197;
                </button>
              </div>
            </>
          ) : (
            <div style={{ color: COLOR_THEME.accent }}>Select a track to play</div>
          )}
        </div>
      </div>
    );
  }

  // ========== Main App Render ===========
  return (
    <div className="music-app-root">
      {renderSidebar()}
      <main className="main-panel">
        <header className="main-header">
          <h1 className="main-title" style={{
              color: COLOR_THEME.gold,
              textShadow: "0 0 8px " + COLOR_THEME.accent + ", 0 2px 9px #151929"
          }}>
            {tab === "Library" ? "Music Library" : "Your Playlist"}
          </h1>
          {renderSearchBar()}
        </header>
        {renderTracksPanel()}
      </main>
      {renderPlayerControls()}
    </div>
  );
}

export default App;
