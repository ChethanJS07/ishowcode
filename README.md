# AI-Powered Profanity Filter for livestreaming services - IShowCode team
This project is an AI-powered profanity filtering tool for streamers and content creators. It integrates React.js for the front-end, Google Gen AI API for advanced language processing, and a Node.js package to detect and filter profanity in both text and speech.

## Features
- **Real-time Profanity Filtering**: Detect and filter inappropriate words in both text and speech using advanced AI models.
- **Customizable Filters**: Replace offensive language with user-defined alternatives (meme sounds, custom text, etc.).
- **Speech-to-Text Integration**: Automatically process live audio streams for profanity.
- **Google Gen AI API**: Utilize the latest AI language models for more accurate, context-aware content moderation.
- **Cross-Platform**: Works seamlessly across streaming platforms (YouTube, Twitch, etc.).

## PowerPoint Presentation : [click here](https://docs.google.com/presentation/d/1LCWneoOKIv4CGGOQ7fJxQ4KPpKg8F8H8/edit#slide=id.p1)

## Installation

### Prerequisites

- Node.js and npm installed
- A Google Cloud project with access to the Google Gen AI API (see [Google Cloud Setup](https://cloud.google.com/gen-ai) for API key)

### Steps

1. **Clone the repository**:

    ```bash
    git clone https://github.com/ChethanJS07/ishowcode.git
    cd ishowcode
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Run the client and server**:

    ```bash
    # In one terminal, start the Node server
    cd ishowcode
    npm run dev
    ```

The app will be running at `http://localhost:3000`.

## Usage

1. **Live Filtering**: Add the profanity filter widget to your stream by embedding the provided React component.
2. **Settings**: Use the settings page to customize how the profanity filter behaves (e.g., choose between replacing words with meme sounds, beeps, or custom text).
3. **Speech Recognition**: Enable the speech-to-text feature for automatic audio stream moderation.
4. **AI-Powered Moderation**: The backend uses the Google Gen AI API for more accurate filtering by understanding the context in which words are used.

## Screenshots
![Image Alt Text](ss5.png)
![Image Alt Text](ss1.png)
![Image Alt Text](ss2.png)
![Image Alt Text](ss3.jpg)
![Image Alt Text](ss4.jpg)

## Pending
Integration of Livestream chat and sarvesh's AI model

## Contact
For issues or inquiries, reach out to the repository owners - 
- [Dhanvanth Y](https://github.com/dhanvanth-dev)
- [Akshay R](https://github.com/Akshay-Coded)
- [Sarveshwaran R](https://github.com/SarveshwaranR05)
- [Chethan JS](https://github.com/ChethanJS07)



