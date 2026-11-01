
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// ==========================================
// GEMINI AI CONFIGURATION
// ==========================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

// ==========================================
// COMPLEXITY ANALYSIS SCHEMA
// ==========================================

const complexitySchema = {
  type: Type.OBJECT,

  properties: {
    timeComplexity: {
      type: Type.STRING,
      description:
        "Plain text Big-O time complexity such as O(1), O(N), O(log N), O(N log M), O(N^2). No LaTeX."
    },

    spaceComplexity: {
      type: Type.STRING,
      description:
        "Plain text Big-O total space complexity including output data structures. Examples: O(1), O(N), O(N log M). No LaTeX."
    }
  },

  required: [
    "timeComplexity",
    "spaceComplexity"
  ]
};

// ==========================================
// EXISTING API: ANALYZE TIME AND SPACE COMPLEXITY
// ==========================================

app.post("/analyze-complexity", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== "string") {
      return res.status(400).json({
        error: "No valid code provided."
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "Gemini API key is not configured."
      });
    }

    const prompt = `
You are an expert code analysis backend for the LeetCode browser extension.

Analyze the provided LeetCode solution and determine:

1. Time Complexity
2. Space Complexity

CRITICAL RULES:

- Use PLAIN TEXT Big-O notation only.
- Do NOT use LaTeX.
- Do NOT use markdown.
- Do NOT use backslashes.
- Use formats such as:
  O(1)
  O(N)
  O(log N)
  O(N log M)
  O(N^2)
  O(N * M)

- For Space Complexity, ALWAYS calculate TOTAL SPACE COMPLEXITY INCLUDING OUTPUT DATA STRUCTURES.

Analyze the following code:

${code}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,

      config: {
        responseMimeType: "application/json",
        responseSchema: complexitySchema,
        temperature: 0.1
      }
    });

    const result = JSON.parse(response.text);

    return res.json(result);

  } catch (error) {
    console.error("Gemini error details:", error);

    if (error.status === 503 || error.status === 429) {
      return res.status(503).json({
        error:
          "Gemini API is temporarily experiencing high demand. Please try again in a few moments."
      });
    }

    return res.status(500).json({
      error:
        "Failed to analyze complexity due to an internal server error."
    });
  }
});

// ==========================================
// YOUTUBE VIDEO SEARCH CONFIGURATION
// ==========================================

// In-memory cache: results expire after six hours.
const youtubeCache = new Map();

const CACHE_DURATION = 6 * 60 * 60 * 1000;
const MAX_CACHE_ENTRIES = 200;

// ==========================================
// NEW API: GET YOUTUBE SOLUTION VIDEOS
// ==========================================

// Example:
// GET /youtube-videos?problem=two-sum

app.get("/youtube-videos", async (req, res) => {
  try {
    const problem = req.query.problem;

    // Validate the problem name.
    if (
      typeof problem !== "string" ||
      !problem.trim()
    ) {
      return res.status(400).json({
        error: "Problem name or slug is required."
      });
    }

    // Limit input length.
    const normalizedProblem = problem
      .trim()
      .slice(0, 150)
      .toLowerCase()
      .replace(/-/g, " ")
      .replace(/\s+/g, " ");

    // Check API key configuration.
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({
        error: "YouTube API key is not configured."
      });
    }

    // Check cache.
    const cacheKey = normalizedProblem;
    const cached = youtubeCache.get(cacheKey);

    if (
      cached &&
      Date.now() - cached.timestamp < CACHE_DURATION
    ) {
      return res.json({
        problem: normalizedProblem,
        videos: cached.videos,
        cached: true
      });
    }

    // Search for LeetCode solutions.
    const searchQuery =
      `${normalizedProblem} LeetCode solution`;

    const youtubeUrl = new URL(
      "https://www.googleapis.com/youtube/v3/search"
    );

    youtubeUrl.search = new URLSearchParams({
      part: "snippet",
      q: searchQuery,
      type: "video",
      maxResults: "3",
      videoEmbeddable: "true",
      safeSearch: "moderate",
      key: process.env.YOUTUBE_API_KEY
    }).toString();

    // Make the request to YouTube Data API v3.
    const response = await fetch(youtubeUrl);

    if (!response.ok) {
      const errorDetails = await response.text();

      console.error(
        "YouTube API error:",
        response.status,
        errorDetails
      );

      return res.status(502).json({
        error:
          "Unable to retrieve YouTube videos. Check your API configuration and quota."
      });
    }

    const data = await response.json();

    // Format the video results.
    const videos = (data.items || [])
      .filter((item) => item.id?.videoId)
      .map((item) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,

        thumbnail:
          item.snippet.thumbnails?.medium?.url ||
          item.snippet.thumbnails?.default?.url ||
          "",

        url:
          `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));

    // Prevent the in-memory cache from growing indefinitely.
    if (
      !youtubeCache.has(cacheKey) &&
      youtubeCache.size >= MAX_CACHE_ENTRIES
    ) {
      const oldestKey = youtubeCache.keys().next().value;

      if (oldestKey !== undefined) {
        youtubeCache.delete(oldestKey);
      }
    }

    // Store the results.
    youtubeCache.set(cacheKey, {
      timestamp: Date.now(),
      videos
    });

    return res.json({
      problem: normalizedProblem,
      videos,
      cached: false
    });

  } catch (error) {
    console.error(
      "YouTube videos endpoint error:",
      error
    );

    return res.status(500).json({
      error:
        "An internal error occurred while retrieving YouTube videos."
    });
  }
});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.json({
    status: "ok",
    message: "ZenCode backend is running.",
    endpoints: [
      "POST /analyze-complexity",
      "GET /youtube-videos?problem=two-sum"
    ]
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `ZenCode AI server running on port ${PORT}`
  );
});
