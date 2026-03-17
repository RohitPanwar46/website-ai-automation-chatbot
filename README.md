# AI Chatbot for Website Demo

A Next.js 16 app demonstrating an embeddable AI chatbot widget with lead capture, Gemini (Google GenAI) dialogue, and MongoDB persisting.

- Frontend: `app/page.tsx` SPA chat UI + chatbot bubble
- Chat API: `app/api/chat/route.ts` calls Google GenAI (`@google/genai`)
- Lead API: `app/api/saveLead/route.ts` stores JSON leads with Mongoose
- DB: `lib/db.js`, `models/Lead.js` (MongoDB URI from env)

## Features

- Toggleable chatbot float button
- Context-aware AI responses (company profile in prompt)
- Auto-lead detection (expects valid JSON object from AI)
- Persisted leads to MongoDB via `Lead` model
- Client-side message stream (history + scroll)

## Prerequisites

- Node.js 20+ (recommended)
- MongoDB cluster / database
- Google Gemini API key

## Environment variables

Create `.env.local` in project root with:

```text
MONGO_URI="your_mongo_connection_string"
GEMINI_API_KEY="your_google_gemini_api_key"
```

## Install & run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## API Endpoints

### `POST /api/chat`
Request body JSON:

```json
{
  "messages": [
    {"role": "system" | "user", "content": "..."},
    ...
  ]
}
```

Response:

```json
{ "reply": "..." }
```

(Translates roles into Gemini format and calls `gemini-3-flash-preview`.)

### `POST /api/saveLead`
Request body is parsed as JSON string (note: a second JSON.parse occurs in handler).

Expected shape:

```json
{ "name": "John Doe", "email": "john@example.com", "phone": "+91 ..." }
```

Stores lead in MongoDB and returns success:

```json
{ "message": "Lead saved successfully" }
```

## Frontend behavior

- `app/page.tsx` initializes on first chat open with `companyContext` system prompt.
- user messages appended, POST to `/api/chat` with current conversation and company system context.
- if AI reply parses as JSON, sends the parsed object to `/api/saveLead` and shows success message.
- otherwise normal assistant reply.

## Testing and validation

- Use Chrome/Firefox devtools network log to inspect `/api/chat` and `/api/saveLead`.
- Validate MongoDB ingest via `db.collection('leads').find().pretty()`.

## Build / production

```bash
npm run build
npm run start
```

## Notes

- `saveLead` performs `JSON.parse(data)` on parsed request body. Ensure JSON is stringified and valid.
- `companyContext` is hard-coded; customize for your brand/services.
- The app uses Tailwind CSS v4 and lucide-react icons.

## License

MIT

