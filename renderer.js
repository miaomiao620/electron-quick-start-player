/**
 * This file is loaded via the <script> tag in the index.html file and will
 * be executed in the renderer process for that window. No Node.js APIs are
 * available in this process because `nodeIntegration` is turned off and
 * `contextIsolation` is turned on. Use the contextBridge API in `preload.js`
 * to expose Node.js functionality from the main process.
 */

// 获取DOM元素
const videoPlayer = document.getElementById('videoPlayer');
const videoSource = document.getElementById('videoSource');
const subtitleTrack = document.getElementById('subtitleTrack');
const videoPathInput = document.getElementById('videoPath');
const subtitlePathInput = document.getElementById('subtitlePath');

// 由于浏览器安全限制，需要将文件路径转换为 file:// URL
function convertToFileUrl(path) {
    // 将反斜杠转换为正斜杠
    path = path.replace(/\\/g, '/');
    // 添加 file:/// 前缀
    return `file:///${path}`;
}

// 更新视频和字幕源
function updateMediaSources() {
    const videoUrl = convertToFileUrl(videoPathInput.value);
    const subtitleUrl = convertToFileUrl(subtitlePathInput.value);
    
    videoSource.src = videoUrl;
    subtitleTrack.src = subtitleUrl;
   
    // 重新加载视频以应用更改
    videoPlayer.load();
    videoPlayer.play().then(() => {
        // 视频开始播放后设置音频分析
        setupAudioAnalysis();
    });
}

// 设置音频分析
function setupAudioAnalysis() {

    // 获取视频流
    const stream = videoPlayer.captureStream();
    // 获取音轨
    const audioTracks = stream.getAudioTracks();
    
    if (audioTracks.length > 0) {
        console.log('音频流检测:', {
            audioTracks: stream.getAudioTracks().length
        });
    } else {
        console.warn('没有检测到音频轨道！');
    }
}

// 监听输入框变化
videoPathInput.addEventListener('change', updateMediaSources);
subtitlePathInput.addEventListener('change', updateMediaSources);

// 初始加载
updateMediaSources();
