@"
(function() {
  const ws = new WebSocket('ws://localhost:3000');

  ws.onopen = () => {
    console.log('WebSocket connection established');
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  const sendVideoInfo = (video) => {
    const fps = Math.round(video.getVideoPlaybackQuality().totalVideoFrames / video.currentTime);
    const bandwidth = video.webkitVideoDecodedByteCount || video.mozVideoDecodedByteCount || video.msVideoDecodedByteCount || video.videoDecodedByteCount || 0;
    const data = {
      fps,
      quality: \`\${video.videoWidth}x\${video.videoHeight}\`,
      bandwidth
    };

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(data));
    }
  };

  const observeVideos = () => {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.addEventListener('play', () => {
        setInterval(() => sendVideoInfo(video), 1000);
      });
    });
  };

  observeVideos();
  new MutationObserver(observeVideos).observe(document.body, { childList: true, subtree: true });
})();
"@ | Out-File -FilePath content.js -Encoding utf8