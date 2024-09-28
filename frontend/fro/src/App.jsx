// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [migrationStatus, setMigrationStatus] = useState('');

  // Fetch playlists when the component mounts
  const fetchPlaylists = async () => {
    try {
      const response = await axios.get('http://localhost:3001/request/spotify-getplaylist', {
        withCredentials: true, 
      });
      setPlaylists(response.data);
      console.log('Playlists fetched:', response.data);

    } catch (error) {
      console.error('Error fetching playlists:', error.response?.data || error.message);
      alert('Failed to fetch playlists. Please ensure you are authenticated.');
    }
  };

  // Handle migration
  const handleMigrate = async () => {
    if (!selectedPlaylistId) {
      alert('Please select a playlist to migrate.');
      return;
    }

    try {
      setMigrationStatus('Migrating...');
      const response = await axios.post(
        'http://localhost:3001/request/Migrate',
        { playlistId: selectedPlaylistId },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true, 
        }
      );
      setMigrationStatus('Migration successful!');
      console.log('Migration response:', response.data);
    } catch (error) {
      console.error('Error during migration:', error.response?.data || error.message);
      setMigrationStatus('Migration failed. Please try again.');
    }
  };

  return (
    <div className="App">
      <h1>Spotify to YouTube Playlist Migrator</h1>
      <div>
        <SpotifyLogin />
        <br />
        <br />
        <GoogleLogin />
        <br />
        <br />
        <GetPlaylist fetchPlaylists={fetchPlaylists} />
        <br />
        <br />
        <PlaylistList
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          setSelectedPlaylistId={setSelectedPlaylistId}
        />
        <br />
        <Migrate handleMigrate={handleMigrate} />
        <br />
        <br />
        {migrationStatus && <p>{migrationStatus}</p>}
      </div>
    </div>
  );
}

function SpotifyLogin() {
  const spotifyAuth = () => {
    console.log("Spotify login initiated");
    window.location.href = 'http://localhost:3001/api/auth/spotify';
  };

  return <button onClick={spotifyAuth}>Spotify Login</button>;
}

function GoogleLogin() {
  const googleAuth = () => {
    console.log("Google login initiated");
    window.location.href = 'http://localhost:3001/api/auth/google';
  };

  return (
    <button onClick={googleAuth}>Google Login</button>
  );
}

function GetPlaylist({ fetchPlaylists }) {
  return <button onClick={fetchPlaylists}>Get Playlists</button>;
}

function PlaylistList({ playlists, selectedPlaylistId, setSelectedPlaylistId }) {
  return (
    <div>
      <h2>Select a Playlist to Migrate</h2>
      {playlists.length === 0 ? (
        <p>No playlists available. Please fetch playlists.</p>
      ) : (
        <ul>
          {playlists.map((playlist) => (
            <li key={playlist.playlistId}>
              <input
                type="radio"
                id={playlist.playlistId}
                name="selectedPlaylist"
                value={playlist.playlistId}
                checked={selectedPlaylistId === playlist.playlistId}
                onChange={() => setSelectedPlaylistId(playlist.playlistId)}
              />
              <label htmlFor={playlist.playlistId}>{playlist.title}</label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Migrate({ handleMigrate }) {
  return <button onClick={handleMigrate}>Migrate</button>;
}

export default App;