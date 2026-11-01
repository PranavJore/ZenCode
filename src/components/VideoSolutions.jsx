
import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/youtube-videos";

function VideoSolutions() {
  const [problem, setProblem] = useState("");
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let requestId = 0;

    async function loadVideos() {
      const match = window.location.pathname.match(
        /^\/problems\/([^/]+)/
      );

      if (!match) {
        setProblem("");
        setVideos([]);
        setSelectedVideo(null);
        setError("Open a LeetCode problem to see video solutions.");
        return;
      }

      const slug = match[1];

      setProblem(slug);
      setVideos([]);
      setSelectedVideo(null);
      setError("");
      setLoading(true);

      const currentRequest = ++requestId;
      const cacheKey = `youtubeVideos_${slug}`;

      try {
        // Use cached videos when available.
        const saved = await chrome.storage.local.get(cacheKey);
        let results = saved[cacheKey];

        if (!Array.isArray(results)) {
          const response = await fetch(
            `${API_URL}?problem=${encodeURIComponent(slug)}`
          );

          if (!response.ok) {
            throw new Error(`Video API returned ${response.status}`);
          }

          const data = await response.json();
          results = Array.isArray(data.videos) ? data.videos : [];

          // Cache only non-empty successful results.
          if (results.length > 0) {
            await chrome.storage.local.set({
              [cacheKey]: results.slice(0, 3),
            });
          }
        }

        // Ignore results if navigation has changed the problem.
        if (currentRequest !== requestId) return;

        setVideos(results.slice(0, 3));
      } catch (err) {
        if (currentRequest !== requestId) return;

        console.error("Video Solutions error:", err);
        setError(
          "Unable to load videos. Make sure your local backend is running."
        );
      } finally {
        if (currentRequest === requestId) {
          setLoading(false);
        }
      }
    }

    loadVideos();

    // LeetCode navigation can change the URL without reloading the page.
    const handleNavigation = () => loadVideos();

    window.addEventListener("popstate", handleNavigation);

    const interval = setInterval(() => {
      const match = window.location.pathname.match(
        /^\/problems\/([^/]+)/
      );
      const currentSlug = match ? match[1] : "";

      if (currentSlug !== problem) {
        loadVideos();
      }
    }, 1000);

    return () => {
      requestId++;
      window.removeEventListener("popstate", handleNavigation);
      clearInterval(interval);
    };
  }, [problem]);

  return (
    <div className="space-y-3 text-sm text-gray-200">
      <div>
        <h3 className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
          YouTube Solutions
        </h3>

        {problem && (
          <p className="mt-1 break-words text-xs text-gray-500">
            Problem: {problem.replaceAll("-", " ")}
          </p>
        )}
      </div>

      {loading && (
        <p className="text-gray-400">Loading video recommendations...</p>
      )}

      {!loading && error && (
        <p className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-3 text-yellow-300">
          {error}
        </p>
      )}

      {!loading && !error && videos.length === 0 && (
        <p className="text-gray-400">
          No video recommendations found for this problem.
        </p>
      )}

      {selectedVideo && (
        <div className="space-y-2">
          <div className="relative w-full overflow-hidden rounded-lg bg-black">
            <div className="aspect-video">
              <iframe
                key={selectedVideo.videoId}
                className="h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(
                  selectedVideo.videoId
                )}`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>

          <a
            href={selectedVideo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-xs text-green-400 hover:text-green-300"
          >
            Open on YouTube ↗
          </a>

          <button
            type="button"
            onClick={() => setSelectedVideo(null)}
            className="block text-xs text-gray-400 hover:text-gray-50"
          >
            ← Back to videos
          </button>
        </div>
      )}

      {!selectedVideo && videos.length > 0 && (
        <div className="space-y-3">
          {videos.map((video) => (
            <div
              key={video.videoId}
              className="overflow-hidden rounded-xl border border-gray-700/60 bg-gray-900/70"
            >
              <button
                type="button"
                onClick={() => setSelectedVideo(video)}
                className="block w-full text-left transition hover:bg-gray-800/70"
              >
                <img
                  src={video.thumbnail}
                  alt=""
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />

                <div className="space-y-1 p-3">
                  <p className="line-clamp-2 font-medium text-gray-100">
                    {video.title}
                  </p>

                  <p className="text-xs text-gray-400">
                    {video.channelTitle}
                  </p>

                  <span className="inline-block pt-1 text-xs font-semibold text-green-400">
                    ▶ Watch video
                  </span>
                </div>
              </button>

              <div className="border-t border-gray-700/60 px-3 py-2">
                <a
                  href={video.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-gray-50"
                >
                  Open on YouTube ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default VideoSolutions;
