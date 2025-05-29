# Prayatna Backend API

A comprehensive backend system for the Prayatna community engagement platform for school students.

## Features

- **Authentication System**: JWT-based authentication for schools, students, and teachers
- **Role-Based Access Control**: Different permissions for schools, teachers, and students
- **Content Management**: Post creation, moderation, and interaction system
- **AI Content Moderation**: Automatic content analysis for safety and appropriateness
- **File Upload System**: Support for images, documents, and marksheets
- **Achievement System**: Student achievement tracking with media support
- **Education Analysis**: AI-powered skill marks calculation from marksheets
- **Notification System**: Real-time notifications for post interactions
- **Streak Tracking**: Student engagement streak system
- **Event Management**: Teacher event creation and management

## Tech Stack

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** & **Sharp** for file handling
- **OpenAI API** for enhanced content moderation (optional)
- **Express Rate Limit** for API protection

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd prayatna/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   - MongoDB connection string
   - JWT secret key
   - OpenAI API key (optional)
   - Other configuration options

4. **Start the server**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT tokens | Yes |
| `PORT` | Server port (default: 5000) | No |
| `OPENAI_API_KEY` | OpenAI API key for enhanced AI features | No |
| `FRONTEND_URL` | Frontend URL for CORS | No |

## Default Credentials

- **School ID**: `PRAYATNA2024`
- **School Password**: `admin123`

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /login` - School/teacher/student login
- `POST /signup` - Student signup
- `GET /verify` - Verify JWT token
- `POST /refresh` - Refresh JWT token

### School Routes (`/api/school`)

- `GET /dashboard` - School dashboard data
- `PUT /profile` - Update school profile
- `POST /students` - Create new student
- `GET /students` - Get all students
- `POST /teachers` - Create new teacher
- `GET /teachers` - Get all teachers
- `GET /posts/flagged` - Get flagged posts
- `PUT /posts/:id/moderate` - Moderate post

### Student Routes (`/api/student`)

- `GET /dashboard` - Student dashboard
- `PUT /profile/complete` - Complete profile setup
- `POST /achievements` - Add achievement
- `GET /achievements` - Get achievements
- `POST /posts` - Create post
- `GET /notifications` - Get notifications
- `GET /motivational-quote` - Get AI motivational quote

### Teacher Routes (`/api/teacher`)

- `GET /dashboard` - Teacher dashboard
- `PUT /profile` - Update teacher profile
- `POST /events` - Create event
- `GET /events` - Get events
- `POST /students` - Assign student to class
- `GET /students` - Get assigned students
- `POST /posts` - Create teacher post

### Post Routes (`/api/posts`)

- `GET /:id` - Get single post
- `POST /:id/like` - Like/unlike post
- `POST /:id/comments` - Add comment
- `POST /:id/share` - Share post
- `PUT /:id` - Update post (author only)
- `DELETE /:id` - Delete post
- `GET /search` - Search posts

### Upload Routes (`/api/upload`)

- `POST /avatar` - Upload user avatar
- `POST /post-images` - Upload post images
- `POST /achievement-media` - Upload achievement media
- `POST /marksheets` - Upload student marksheets
- `GET /files/:type/:filename` - Serve uploaded files

### AI Routes (`/api/ai`)

- `POST /analyze-content` - Analyze content for moderation
- `POST /calculate-skills` - Calculate skill marks from marksheets
- `GET /motivational-quote` - Get contextual motivational quote
- `POST /content-suggestions` - Get AI content suggestions
- `GET /study-recommendations` - Get personalized study recommendations

## Database Models

### School Model
- Authentication and profile information
- Student and teacher management
- Settings and statistics

### Student Model
- Profile with completion tracking
- Achievement system
- Education records and skill marks
- Streak tracking
- Social features (friends, notifications)

### Teacher Model
- Profile and credentials
- Event management
- Student assignments
- Performance tracking

### Post Model
- Multi-author support (school/student/teacher)
- Content with formatting and media
- AI moderation system
- Engagement metrics
- Comment and interaction system

## Content Moderation

The system includes a comprehensive AI-powered content moderation service:

- **Safety Analysis**: Checks for inappropriate content
- **Sentiment Analysis**: Evaluates emotional tone
- **Profanity Detection**: Filters inappropriate language
- **Age Appropriateness**: Ensures school-suitable content
- **Emergency Detection**: Identifies potentially harmful content

## File Upload System

Supports various file types with automatic processing:

- **Images**: Automatic resizing and optimization
- **Documents**: PDF and Word document support
- **Marksheets**: For AI skill analysis
- **Avatars**: Profile picture processing

## Algorithms

The system implements several algorithms for:

- User engagement rate calculations
- Post interaction metrics
- Student skill marks analysis
- Content moderation scoring
- Streak calculation
- Feed relevance ranking

See `algo.md` for detailed algorithm documentation.

## Security Features

- JWT token authentication
- Role-based access control
- Rate limiting
- Input validation
- File type restrictions
- CORS protection
- Password hashing with bcrypt

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Database models
├── routes/          # API route handlers
├── middleware/      # Authentication and validation
├── services/        # Business logic services
├── uploads/         # File upload storage
├── server.js        # Main server file
└── package.json     # Dependencies
```

### Adding New Features

1. Create model in `models/` if needed
2. Add routes in `routes/`
3. Implement middleware if required
4. Add services in `services/`
5. Update documentation

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a secure JWT secret
3. Configure MongoDB Atlas
4. Set up file storage (local or cloud)
5. Configure rate limiting
6. Enable HTTPS
7. Set up monitoring and logging

## API Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors if applicable
  ]
}
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please create an issue in the repository or contact the development team. 