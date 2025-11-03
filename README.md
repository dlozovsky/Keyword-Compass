# Keyword Compass 🧭

An intelligent keyword research tool that leverages AI to discover low-competition keywords, helping you optimize your SEO strategy and rank higher in search results. This application provides real-time, actionable insights powered by Google's Gemini API.


<img width="1378" height="792" alt="image" src="https://github.com/user-attachments/assets/8db32ea5-a75f-4699-8a4c-0b14367cf746" />


## ✨ About The Project

Keyword Compass is a modern web application designed to streamline the keyword research process. Unlike traditional tools that provide raw data, Keyword Compass uses the power of the Google Gemini API to deliver not just keywords, but actionable insights. It finds related long-tail keywords, analyzes their competition level, estimates search volume, and provides a justification for its analysis.

The standout feature is its ability to automatically group generated keywords into semantically related clusters, helping you understand user intent and structure your content strategy more effectively.

## 🌟 Features in Detail

### Core Capabilities

-   **🤖 AI-Powered Keyword Generation:** Enter a single "seed" keyword, and let the Gemini AI generate a list of relevant long-tail keywords that your audience is actively searching for.
-   **⚡ Real-Time Streaming:** Results appear on your screen as they are generated, providing an interactive and fast experience. No more waiting for a full report to load.
-   **📊 In-Depth Keyword Analysis:** Each keyword comes with:
    -   **Estimated Search Volume:** Understand the potential traffic for a keyword.
    -   **Competition Score:** A simple "Low," "Medium," or "High" rating to help you prioritize.
    -   **AI Justification:** A clear explanation of *why* the competition is rated a certain way.
-   **🔍 Advanced Search Options:** Fine-tune your search with advanced controls to specify the number of keywords, filter by type (Questions, Commercial, Informational), and exclude negative keywords.
-   **↔️ Interactive & Sortable Results:** Easily sort the results table by keyword, search volume, or competition level. Filter the entire list to show only low, medium, or high competition keywords.
-   **📥 CSV Export:** Download your keyword lists (either the full list or the clustered view) with a single click for offline analysis or use in other SEO tools.
-   **🔗 Direct SERP Links:** Instantly check the Google Search Engine Results Page for any keyword to analyze the current top-ranking content.

### What Makes It Unique

-   **🧠 Semantic Clustering:** This is the killer feature. After generating a list of keywords, Keyword Compass uses the Gemini API again to analyze and group them into semantically related clusters. This helps you understand the different sub-topics and user intents related to your seed keyword, making it incredibly easy to plan your content pillars and topic clusters.

    *Example: A search for "digital marketing" might result in clusters like "Social Media Strategies," "Content Marketing for Beginners," and "Local SEO Services."*

    ![Keyword Clustering View](https://storage.googleapis.com/aistudio-ux-team-public/sdk_gallery/keyword-compass.png)
    *(The screenshot above shows the clustered results view, with each accordion item representing a distinct topic cluster.)*

-   **Zero-Build, Modern Stack:** The application runs directly in the browser using native ES Modules and Import Maps. There's no complex build process, making it lightweight and easy to modify or deploy.

## 🛠️ Tech Stack

-   **Frontend:** [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
-   **AI Model:** [Google Gemini API](https://ai.google.dev/) (`@google/genai`)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Modules:** Native ES Modules with [Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) (No bundler required)

## 🚀 Getting Started

This project is designed to run directly in a modern browser without a build step.

### Prerequisites

-   A modern web browser (e.g., Chrome, Firefox, Safari).
-   A Google Gemini API key. You can get one from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/keyword-compass.git
    cd keyword-compass
    ```

2.  **Set up the API Key:**
    This application is configured to use an API key from the environment variable `process.env.API_KEY`. When deployed to an environment like Google's AI Studio, this variable is injected automatically.

    For local development, you will need to manually provide the key. The easiest way is to temporarily replace the placeholder in `services/geminiService.ts`:

    Find this line in `services/geminiService.ts`:
    ```typescript
    const API_KEY = process.env.API_KEY;
    ```
    And replace it with your actual key for local testing:
    ```typescript
    const API_KEY = 'YOUR_GOOGLE_GEMINI_API_KEY';
    ```
    **Important:** Do not commit your API key to version control. This method is for local development only.

3.  **Run a local server:**
    You cannot open `index.html` directly from the file system due to browser security restrictions (CORS). You need to serve it from a local web server.

    **Using Python:**
    ```bash
    # If you have Python 3
    python -m http.server

    # If you have Python 2
    python -m SimpleHTTPServer
    ```
    Then, open your browser and navigate to `http://localhost:8000`.

    **Using VS Code:**
    Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click "Go Live" from the status bar.

## 💡 Usage

1.  **Enter a Seed Keyword:** Start by typing a topic, product, or service into the main search bar (e.g., "content marketing").
2.  **Use Advanced Options (Optional):** Click "Show Advanced Options" to specify:
    -   The number of keywords to generate.
    -   The type of keywords (e.g., only questions).
    -   Negative keywords to exclude from the results (e.g., "free, jobs").
3.  **Find Keywords:** Click the "Find" button.
4.  **View Results:** Watch as the keyword results stream into the table in real-time.
5.  **Analyze and Interact:**
    -   Sort the table by clicking on the column headers.
    -   Filter the results by competition level using the filter buttons.
    -   Click the external link icon to check the live SERP for a keyword.
6.  **Review Clusters:** Once the streaming is complete, the app will process the results and group them into semantic clusters. These will be displayed in an accordion view.
7.  **Export Data:** Click the "Export CSV" button to download your findings for use in other tools or reports.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ✍️ Author

**Daniel Lozovsky** - Developer & Open Source Contributor
-   [LinkedIn](https://www.linkedin.com/in/daniellozovsky/)
