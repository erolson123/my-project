# Essay Checker

Many people struggle to find the right tools to help them edit their essays. Our app, EssayChecker, lets users write and upload their essays and get direct feedback from generative AI. This is an AI-powered essay analysis tool that helps students improve their essays by providing detailed feedback, suggestions, and thought-provoking questions.

## Features

- Essay analysis with AI-powered feedback
- Prompt and guidelines/rubric integration
- Thought-provoking questions generation
- Bias detection and analysis
- Modern, responsive UI
- Google Authentication

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your API keys:
   - Get an OpenAI API key from [OpenAI](https://platform.openai.com)
   - Get Cloudinary credentials from [Cloudinary](https://cloudinary.com)
   - Set up Google OAuth:
     1. Go to [Google Cloud Console](https://console.cloud.google.com)
     2. Create a new project or select an existing one
     3. Enable the Google+ API
     4. Go to Credentials > Create Credentials > OAuth Client ID
     5. Configure the OAuth consent screen
     6. Create a Web Application type credential
     7. Add authorized redirect URIs:
        - http://localhost:3000/api/auth/callback/google (for development)
        - https://your-domain.com/api/auth/callback/google (for production)
     8. Copy the Client ID and Client Secret to your `.env` file
   - Generate NEXTAUTH_SECRET:
     ```bash
     openssl rand -base64 32
     ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Sign in with your Google account
2. Enter your essay prompt
3. Add any specific guidelines or rubric requirements
4. Paste your essay
5. Click "Analyze Essay" to receive AI-powered feedback

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- OpenAI API
- Cloudinary
- NextAuth.js with Google Provider

## Environment Variables

Create a `.env` file with the following variables:

```
OPENAI_API_KEY=your_openai_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
