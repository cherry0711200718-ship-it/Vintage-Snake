import React, { useState, useEffect, useRef } from 'react';

const TRACKS = [
  { id: 1, title: 'CORRUPTED_SECTOR.WAV', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'DATA_BREACH.MP3', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'KERNEL_PANIC.OGG', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  const nextTrack = () => { setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length); setIsPlaying(true); };
  const prevTrack = () => { setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length); setIsPlaying(true); };
  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="flex flex-col space-y-6 w-full h-full p-2">
      <div className="text-left border-b-2 border-glitch-magenta pb-2">
        <h2 className="text-xl font-bold text-glitch-magenta mb-1">AUDIO.SYS</h2>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">STATUS:</span>
          <span className={isPlaying ? 'text-glitch-cyan animate-pulse' : 'text-gray-500'}>
            {isPlaying ? 'STREAMING...' : 'IDLE'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 bg-glitch-cyan/10 border border-glitch-cyan p-3">
        <div className={`w-8 h-8 flex items-center justify-center bg-glitch-cyan text-black font-bold border-2 border-black ${isPlaying ? 'animate-bounce' : ''}`}>
          {isMuted ? 'X' : '~'}
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-bold text-glitch-cyan whitespace-nowrap overflow-hidden animate-[pulse_2s_infinite]">
             {'> '} {currentTrack.title}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button onClick={prevTrack} className="button-glitch px-4 py-2 text-sm font-bold">
          [ {'<<'} ]
        </button>
        <button onClick={togglePlay} className="button-glitch px-6 py-2 text-lg font-bold bg-white text-black border-white hover:bg-glitch-magenta hover:text-white">
          {isPlaying ? '[ || ]' : '[ > ]'}
        </button>
        <button onClick={nextTrack} className="button-glitch px-4 py-2 text-sm font-bold">
          [ {'>>'} ]
        </button>
      </div>

      <div className="flex items-center justify-between w-full pt-6 border-t-2 border-gray-800">
        <div className="flex items-end gap-1 h-12 w-2/3 border-b-2 border-glitch-cyan relative overflow-hidden">
           {/* Terminal block visualizer */}
           <div className={`w-full bg-glitch-cyan ${isPlaying ? 'animate-[bounce_0.5s_steps(2)_infinite]' : 'h-1'}`} style={{height: '80%'}}></div>
           <div className={`w-full bg-glitch-magenta ${isPlaying ? 'animate-[bounce_0.7s_steps(3)_infinite]' : 'h-1'}`} style={{height: '30%'}}></div>
           <div className={`w-full bg-glitch-cyan ${isPlaying ? 'animate-[bounce_0.4s_steps(2)_infinite]' : 'h-1'}`} style={{height: '100%'}}></div>
           <div className={`w-full bg-white ${isPlaying ? 'animate-[bounce_0.9s_steps(4)_infinite]' : 'h-1'}`} style={{height: '60%'}}></div>
           <div className={`w-full bg-glitch-cyan ${isPlaying ? 'animate-[bounce_0.6s_steps(2)_infinite]' : 'h-1'}`} style={{height: '40%'}}></div>
           <div className={`w-full bg-glitch-magenta ${isPlaying ? 'animate-[bounce_0.5s_steps(3)_infinite]' : 'h-1'}`} style={{height: '90%'}}></div>
        </div>
        <button onClick={toggleMute} className="text-gray-500 hover:text-glitch-magenta text-sm underline decoration-glitch-magenta font-bold px-2 py-1">
          {isMuted ? 'UNMUTE' : 'MUTE'}
        </button>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
        className="hidden"
      />
    </div>
  );
}
