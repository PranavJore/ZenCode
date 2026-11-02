# ⚡ ZenCode

A Chrome extension that enhances LeetCode with themed submission celebrations, coding activity analytics, AI-powered Time and Space Complexity analysis, and contextual YouTube video solutions.

## 🚀 Overview

**ZenCode** is a Chrome extension built using React, Vite, and Chrome Extension Manifest V3. It enhances the LeetCode coding experience by making problem-solving more interactive and informative.

ZenCode provides themed animations and sounds for accepted and failed submissions, tracks coding activity, analyzes code complexity using Google's Gemini API, and recommends relevant YouTube video solutions for LeetCode problems.

## ✨ Features

### 🎮 1. Submission Celebrations

ZenCode detects LeetCode submission results and displays themed animations and sound effects.

**Supported themes:**
- GTA San Andreas
- Minecraft

**Features include:**
- Animated success and failure popups.
- Sound effects for accepted and failed submissions.
- Customizable celebration settings.
- Enable or disable celebrations.
- Enable or disable sounds.
- Theme selection.
- Animation and attempt information.

### 📊 2. Coding Activity Analytics

ZenCode tracks coding activity to help users understand their LeetCode practice habits.

**Tracked activities include:**
- Problems attempted.
- Accepted submissions.
- Failed submissions.
- Attempts per problem.
- Total solving time.
- Current solving streak.
- Paste events and bulk paste events.
- Tab switches.

These analytics help users review their activity and identify areas for improvement.

### 🤖 3. AI-Powered Complexity Analysis

ZenCode integrates Google's Gemini API to analyze submitted LeetCode solutions and estimate their time and space complexity.

**The analyzer provides:**
- Time complexity.
- Space complexity.
- Complexity information based on the submitted code.

Example output:

```json
{
  "timeComplexity": "O(N)",
  "spaceComplexity": "O(N)"
}
```

**Analysis workflow:**

```text
Chrome Extension
       |
       v
ZenCode Backend
       |
       v
Google Gemini API
       |
       v
Complexity Analysis
       |
       v
Display Results
```

The backend handles communication with Gemini, keeping the API key outside the frontend extension code.

### 🎥 4. YouTube Video Solutions

ZenCode provides relevant YouTube video recommendations for LeetCode problems, helping users understand problem-solving approaches and explore alternative solutions.

**Features include:**
- Fetching relevant YouTube videos for a LeetCode problem.
- Displaying up to three video recommendations.
- Watching recommended videos within the extension.
- Caching video results locally to reduce repeated requests.

The backend uses the YouTube Data API to retrieve relevant videos based on the problem name or problem slug.

**Video recommendation workflow:**

```text
User Opens a LeetCode Problem
              |
              v
       ZenCode Extension
              |
              v
       ZenCode Backend
              |
              v
       YouTube Data API
              |
              v
    Relevant Video Results
              |
              v
 Display Videos in Extension
```

**Configuration requirement:** The backend must have a valid `YOUTUBE_API_KEY` environment variable configured for video recommendations to work.

### 💾 5. Complexity Result Caching

ZenCode stores successful complexity analysis results locally using `chrome.storage.local`.

Each result is associated with its LeetCode problem slug.

For example:

```text
two-sum
longest-substring-without-repeating-characters
valid-parentheses
```

When a previously analyzed problem is opened again, ZenCode can reuse the cached result instead of requesting another analysis.

**Benefits:**
- Reduces repeated Gemini API requests.
- Improves response time for previously analyzed problems.
- Avoids unnecessary API usage.

Failed analysis requests are not cached, allowing users to retry the analysis later.

### 🔍 6. Submission Detection

ZenCode detects LeetCode submissions by intercepting submission requests and retrieving relevant submission information.

The extension identifies the submission result and distinguishes between accepted and failed submissions.

The detection workflow also retrieves submitted code for supported functionality, including complexity analysis.

**Submission workflow:**

```text
User Submits a Solution
          |
          v
LeetCode Submission Request
          |
          v
ZenCode Detects Submission
          |
          v
Retrieve Submission Details
          |
          v
Identify Submission Result
          |
          v
+---------------------------+
|                           |
v                           v
Submission             Complexity
Celebration              Analysis
```

### ⚙️ 7. Customization Settings

ZenCode provides settings to personalize the coding experience.

Users can configure:
- Submission celebrations.
- Sound effects.
- Preferred celebration theme.

These settings allow users to customize the extension according to their preferences.

## 🛠️ Tech Stack

### Frontend — Chrome Extension

- **React** — Building the user interface and components.
- **Vite** — Development server and production build tooling.
- **JavaScript** — Application logic.
- **Tailwind CSS** — Utility-first styling where used.
- **Chrome Extension Manifest V3** — Extension architecture.
- **Chrome Storage API** — Local settings and cached results.

### Backend

- **Node.js** — JavaScript runtime.
- **Express.js** — Backend API framework.
- **CORS** — Cross-origin request handling.
- **dotenv** — Environment variable configuration.
- **Google Gemini API** — AI-powered code complexity analysis.
- **YouTube Data API** — YouTube video recommendations.

### Deployment

- **Render** — Backend hosting.

## 🏗️ Project Structure

```text
ZenCode/
├── public/
│   ├── assets/
│   │   ├── gta/
│   │   │   ├── failed.mp3
│   │   │   ├── failed.png
│   │   │   ├── passed.mp3
│   │   │   └── passed.png
│   │   └── minecraft/
│   │       ├── failed.mp3
│   │       ├── failed.png
│   │       ├── passed.mp3
│   │       └── passed.png
│   ├── content.js
│   ├── icon128.png
│   ├── manifest.json
│   └── pageInterceptor.js
│
├── src/
│   ├── components/
│   │   ├── AnalyticsView.jsx
│   │   ├── FloatingButton.jsx
│   │   ├── Header.jsx
│   │   ├── ReportView.jsx
│   │   ├── SettingsView.jsx
│   │   └── VideoSolutions.jsx
│   ├── utils/
│   │   ├── celebration.js
│   │   ├── complexity.js
│   │   ├── interceptor.js
│   │   ├── settings.js
│   │   ├── tracker.js
│   │   └── user.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── server/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
├── package.json
├── vite.config.js
└── README.md
```

*The structure above represents the main project files. Exact filenames may differ if the codebase changes.*

## ⚙️ Installation and Setup

### Prerequisites

Before getting started, ensure you have installed:

- Node.js and npm.
- Git.
- Google Chrome or another compatible Chromium-based browser.
- A Google Gemini API key.
- A YouTube Data API key for video recommendations.

### 1. Clone the Repository

```bash
git clone https://github.com/Prajyot-2006/ZenCode.git
cd ZenCode
```

### 2. Install Frontend Dependencies

From the project root, run:

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd server
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the `server/` directory.

Add the following configuration:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
YOUTUBE_API_KEY=YOUR_YOUTUBE_API_KEY
```

Replace the placeholder values with your own API keys.

**Important:** Never commit API keys or other secrets to GitHub. Keep the `.env` file excluded through `.gitignore`.

### 5. Start the Backend

From the `server/` directory, run:

```bash
npm start
```

The backend must be running and accessible to the extension for features that depend on its APIs.

### 6. Build the Chrome Extension

Open a new terminal in the project root and run:

```bash
npm run build
```

Vite generates the production build in the `dist/` directory.

### 7. Load ZenCode into Chrome

1. Open Google Chrome.
2. Navigate to `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project's `dist/` directory.
6. Open LeetCode and test the extension.

After modifying the extension, rebuild it and reload the extension from the Chrome extensions page.

## 🔌 Backend API Endpoints

ZenCode's backend provides API functionality for AI complexity analysis and YouTube video recommendations.

| Endpoint | Method | Purpose |
|---|---|---|
| `/analyze-complexity` | POST | Analyzes submitted code and estimates its time and space complexity. |
| `/youtube-videos?problem=<problem-slug>` | GET | Retrieves relevant YouTube video recommendations for a LeetCode problem. |

The backend must be configured with the appropriate API keys for the corresponding endpoints to work.

## 🔐 Security

ZenCode follows these basic security practices:

- Gemini and YouTube API keys are stored in backend environment variables.
- API keys should never be embedded directly in frontend JavaScript.
- The `.env` file should never be committed to the repository.
- API requests should be validated by the backend.
- API usage should be monitored to avoid unexpected quota consumption.

## 🧪 Testing

The following checks can be performed during development:

- Submit a LeetCode solution that is accepted and verify the success celebration.
- Submit an incorrect solution and verify the failure celebration.
- Check whether the analytics reflect submission activity.
- Analyze a solution and verify the displayed complexity results.
- Reopen an analyzed problem to check whether cached results are reused.
- Open a LeetCode problem and verify that relevant YouTube video recommendations appear.
- Check the browser console and backend logs if any feature fails.

## ⚠️ Limitations

- ZenCode is designed primarily for LeetCode.
- Changes to LeetCode's internal requests or page structure may require updates to submission detection.
- AI-generated complexity estimates may not always be accurate and should be reviewed against the actual algorithm.
- Gemini and YouTube API availability depends on the configured credentials, quotas, and service availability.
- YouTube video recommendations depend on the relevance and availability of search results.
- Backend-dependent features require a reachable backend with the necessary environment variables configured.

## 🔮 Future Improvements

Potential improvements for ZenCode include:

- Dark/Light Theme Toggle for the extension interface.
- Additional celebration themes and animations.
- Improved coding activity analytics and visualizations.
- More detailed AI-powered code analysis.
- Better video recommendation relevance.
- Support for additional coding platforms.
- Improved error handling and automated testing.
- Chrome Web Store publication.

## 👨‍💻 Author

**Pranav J**

ZenCode is a project focused on improving the LeetCode experience while exploring React, Chrome Extensions, backend development, API integration, and AI-powered developer tools.

## ⭐ ZenCode

**Solve. Submit. Understand. Improve.**