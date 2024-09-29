
# Project Name

This project is currently in its **development phase**. However, if you'd like to implement it yourself, follow the steps below to set it up locally.

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/akshayrivers/Playlist_Migration.git
cd Playlist_Migration
```

### 2. Install Dependencies
Make sure you have Node.js installed, then run the following command to install all the required node modules:

```bash
npm install
```

### 3. Create a `.env` File
In the root directory of the project, create a `.env` file to store your environment variables. You will need to add the following:

```
PORT=
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
stoken=your_spotify_access_token
gtoken=your_google_access_token
```

Ensure you replace the placeholder values with your actual **client ID** and **client secret** for both Spotify and Google, and set up the access tokens (`stoken` for Spotify and `gtoken` for Google).

## Running the Project
Once everything is set up, you can run the project 
The Frontend part:
```bash
cd fronted/fro
npm install
npm run dev
```
The backend part:
Be sure to get back to the parent directory first 
```bash
node src1/index.js
```

## Features
- **Spotify Authentication** using OAuth.
- **Google Authentication** using OAuth.
  
More features will be added as development progresses.

## Contributing
Since the project is still under development, feel free to fork the repo, make changes, and submit a pull request. Contributions are welcome!

