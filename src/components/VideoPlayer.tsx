import React from 'react';
import ReactPlayer from 'react-player/lazy';

// @ts-ignore
function VideoPlayer({ playerRef, videoUrl }) { // Add videoUrl as a prop
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '5px' }}>
      <ReactPlayer
        ref={playerRef}
        url={videoUrl} // Use the videoUrl prop
        playing={false}
        controls={true}
        muted={false}
        width="60%"
      />
    </div>
  );
}

export default VideoPlayer;
