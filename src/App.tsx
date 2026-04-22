/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="flex flex-col h-screen w-full bg-black relative selection:bg-glitch-magenta selection:text-white">
      <div className="static-noise-overlay" />
      <div className="scanlines" />

      <header className="h-16 flex items-center justify-between px-6 border-b-4 border-glitch-magenta bg-black shrink-0 relative z-10 screen-tear">
        <div className="flex items-center gap-4">
          <div className="w-4 h-4 bg-glitch-cyan animate-[pulse_0.5s_infinite]"></div>
          <h1 className="text-2xl tracking-widest text-[#fff] glitch-text font-bold" data-text="SYS.OVERRIDE//GLITCH_SNAKE">SYS.OVERRIDE//GLITCH_SNAKE</h1>
        </div>
        <div className="text-glitch-magenta text-sm tracking-widest hidden md:block border border-glitch-magenta px-2 py-1 bg-glitch-magenta/10">
          UPLINK_ESTABLISHED // PORT: 3000
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center relative overflow-y-auto lg:flex-row lg:gap-12 p-4 z-10 screen-tear">
        {/* Main Game Section */}
        <div className="w-full max-w-lg flex justify-center order-2 lg:order-1 terminal-border terminal-box p-6 lg:p-8">
          <SnakeGame />
        </div>

        {/* Music Player Sidebar / Bottom Section */}
        <div className="w-full max-w-sm flex justify-center order-1 lg:order-2 terminal-border terminal-box p-6">
          <MusicPlayer />
        </div>
      </main>
    </div>
  );
}
