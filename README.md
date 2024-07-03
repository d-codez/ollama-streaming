# Chatter Pattar Backend

Chatter Pattar is a chat application with personal assistance capabilities, utilizing a custom language model. This repository contains the backend code, which uses Express and WebSocket for real-time communication.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- Real-time chat functionality via WebSocket
- Conversation history management
- Integration with a custom language model for generating responses

## Installation

### Prerequisites

- Node.js
- npm or yarn

### Setup

1. Clone the repository:

```sh
git clone https://github.com/d-codez/ollama-streaming.git
cd ollama-streaming
```

2. Install dependencies:

```sh
npm install
```

3. Create a `.env` file in the backend directory and add the following:

```env
SESSION_SECRET=your_session_secret
```

4. Start the backend server:

```sh
npm run dev
```

## Usage

1. Ensure the backend server is running:

```sh
npm run dev
```

2. The server will start on `http://localhost:3000`.

## Configuration

### Environment Variables

- `SESSION_SECRET`: Secret key for session management.

## API Endpoints

### WebSocket Endpoint

- `/ws`: WebSocket endpoint for real-time chat communication.

### Helper Functions

- `loadHistory(userId)`: Loads the conversation history for a given user.
- `saveHistory(userId, history)`: Saves the conversation history for a given user.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add some feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
