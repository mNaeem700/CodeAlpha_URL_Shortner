# URL Shortener Application 🔗

A professional, full-featured URL shortener built with **Express.js**, **SQLite**, and a modern responsive frontend.

## Features ✨

- **Shorten URLs** - Convert long URLs to short, memorable codes
- **Custom Short Codes** - Create custom short codes (optional)
- **Click Tracking** - Monitor how many times each short URL is accessed
- **Statistics** - View detailed stats for each shortened URL
- **Recent URLs** - See your most recently shortened URLs
- **Copy to Clipboard** - One-click copying of shortened URLs
- **Responsive Design** - Works perfectly on desktop and mobile
- **SQLite Database** - Persistent local data storage

## Tech Stack 🛠️

- **Backend**: Node.js + Express.js
- **Database**: SQLite3
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Port**: 3000

## Project Structure 📁

```
url-shortener/
├── server.js                 # Main Express server
├── package.json             # Dependencies
├── routes/
│   └── urlRoutes.js        # API route definitions
├── controllers/
│   └── urlController.js    # Business logic
├── models/
│   └── database.js         # SQLite setup & queries
├── public/
│   ├── index.html          # Frontend HTML
│   ├── style.css           # Styling
│   └── script.js           # Frontend JavaScript
└── urls.db                 # SQLite database (created on first run)
```

## Installation & Setup 🚀

### Step 1: Initialize the Project

1. **Open VS Code** and create a new folder for the project:
```bash
mkdir url-shortener
cd url-shortener
```

2. **Copy all files** from the generated files into this folder

3. **Install dependencies**:
```bash
npm install
```

### Step 2: Run the Server

```bash
npm start
```

You should see:
```
✅ Connected to SQLite database
✅ Database table initialized
🚀 URL Shortener running on http://localhost:3000
```

### Step 3: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## API Endpoints 📡

### Shorten a URL
**POST** `/api/shorten`

Request:
```json
{
  "longUrl": "https://example.com/very/long/url",
  "customCode": "mylink" // optional
}
```

Response:
```json
{
  "success": true,
  "shortCode": "abc123",
  "shortUrl": "http://localhost:3000/abc123",
  "longUrl": "https://example.com/very/long/url",
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Redirect to Original URL
**GET** `/:shortCode`

Redirects to the original long URL and increments click count.

### Get Statistics
**GET** `/api/stats/:shortCode`

Response:
```json
{
  "shortCode": "abc123",
  "longUrl": "https://example.com/very/long/url",
  "clicks": 5,
  "createdAt": "2024-01-15T10:30:00.000Z"
}
```

### Get All Recent URLs
**GET** `/api/urls`

Response:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "shortCode": "abc123",
      "longUrl": "https://example.com/...",
      "clicks": 5,
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

## Usage Examples 💡

### Using the Web Interface

1. Enter a long URL (e.g., `https://github.com/very/long/repo/link`)
2. Optionally enter a custom short code (e.g., `mygit`)
3. Click "Shorten URL"
4. Copy the short URL and share it!
5. View statistics by clicking "View Full Stats"

### Using cURL

```bash
# Shorten a URL
curl -X POST http://localhost:3000/api/shorten \
  -H "Content-Type: application/json" \
  -d '{"longUrl": "https://example.com/very/long/url"}'

# Get statistics
curl http://localhost:3000/api/stats/abc123

# Get all URLs
curl http://localhost:3000/api/urls
```

## Configuration ⚙️

### Database Location
The SQLite database is stored at `urls.db` in the project root. To reset the database, simply delete this file and restart the server.

### Port
To use a different port, set the `PORT` environment variable:
```bash
PORT=8080 npm start
```

Or create a `.env` file:
```
PORT=8080
```

## Features Explanation 🎯

### Short Code Generation
- 6-character random alphanumeric codes (A-Z, a-z, 0-9)
- Automatically generates unique codes
- Optional custom codes (minimum 3 characters)

### Error Handling
- ✓ Invalid URL format detection
- ✓ Duplicate custom code prevention
- ✓ Database error handling
- ✓ 404 errors for non-existent short codes

### Click Tracking
- Automatically increments on each redirect
- Tracks total clicks per URL
- Displays in statistics

## Development Notes 📝

### Adding New Features

1. **Add Database Fields**: Update the schema in `models/database.js`
2. **Add API Endpoints**: Create new routes in `routes/urlRoutes.js`
3. **Add Controller Logic**: Implement in `controllers/urlController.js`
4. **Update Frontend**: Modify `public/index.html`, `style.css`, `script.js`

### Testing

You can test the API using:
- **Postman** - Import API endpoints
- **cURL** - Command line requests
- **VS Code REST Client** - Inline testing

## Deployment 🌐

### Deploy to Heroku

1. Install Heroku CLI
2. Create a Heroku app: `heroku create your-app-name`
3. Push code: `git push heroku main`
4. View logs: `heroku logs --tail`

### Deploy to Railway

1. Go to railway.app
2. Click "New Project"
3. Select "GitHub Repo"
4. Connect your repository
5. Set environment variables if needed
6. Deploy!

### Deploy to Render

1. Go to render.com
2. Click "New +"
3. Select "Web Service"
4. Connect GitHub
5. Set build and start commands
6. Deploy!

## Troubleshooting 🐛

### Port Already in Use
```bash
# Kill process on port 3000
# Windows: 
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Database Issues
- Delete `urls.db` and restart the server to reset the database
- Check file permissions in the project folder

### Frontend Not Loading
- Ensure all files are in the `public/` folder
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console for errors (F12)

## Security Notes 🔒

- **Input Validation**: URLs are validated before storing
- **SQL Injection**: Using parameterized queries
- **CORS**: Enabled for local testing
- **No Authentication**: Add authentication for production use

## Future Enhancements 🚀

- [ ] User authentication and login
- [ ] Custom domains
- [ ] QR code generation
- [ ] Advanced analytics dashboard
- [ ] API key management
- [ ] URL expiration dates
- [ ] Link editing and deletion
- [ ] Email notifications
Read more about my projects on https://neemii.dev/projects/

## License

MIT License - Feel free to use this project!

## Support & Questions

If you encounter any issues or have questions, refer to the comments in the code or check the console for error messages.

Happy shortening! 🎉
