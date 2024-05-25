document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video');
    const videoSrc = 'path/to/your/playlist.m3u8'; // Update this with the path to your HLS playlist
    const ws = new WebSocket('ws://localhost:3000');

    ws.onopen = () => {
        console.log('WebSocket connection established');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            console.log('HLS manifest parsed');
            video.play();
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
            console.error('HLS error:', data);
            logClientError('HLS error', '', 0, 0, data);
        });
        hls.on(Hls.Events.LEVEL_SWITCHED, (event, data) => {
            const level = hls.levels[data.level];
            const quality = `${level.width}x${level.height}`;
            updateVideoInfo({ quality });
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', () => {
            console.log('Video metadata loaded');
            video.play();
        });
        video.addEventListener('error', (e) => {
            console.error('Video error:', e);
            logClientError('Video error', '', 0, 0, e);
        });
    }

    function renderFrame() {
        // Your rendering logic here
        updateVideoInfo();
        requestAnimationFrame(renderFrame);
    }

    requestAnimationFrame(renderFrame);

    // Function to dynamically update video info
    function updateVideoInfo(info = {}) {
        const fps = Math.round(video.getVideoPlaybackQuality().totalVideoFrames / video.currentTime);
        const bandwidth = video.webkitVideoDecodedByteCount || video.mozVideoDecodedByteCount || video.msVideoDecodedByteCount || video.videoDecodedByteCount || 0;
        const data = {
            fps,
            quality: info.quality || 'N/A',
            bandwidth
        };

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify(data));
        }
    }

    // Global error handler
    window.onerror = function (message, source, lineno, colno, error) {
        logClientError(message, source, lineno, colno, error);
    };

    // Function to send error logs to the server
    function logClientError(message, source, lineno, colno, error) {
        fetch('/log-error', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message, source, lineno, colno, error })
        });
    }
});