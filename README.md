# Meeting Assistant

A full-stack web application built with Django REST Framework and Vue.js + TypeScript.

## Tech Stack

### Backend
- Django REST Framework
- PostgreSQL
- Swagger/OpenAPI Documentation
- Docker

### Frontend
- Vue.js 3
- TypeScript
- Tailwind CSS
- Vite

## Getting Started

### Prerequisites
- Docker and Docker Compose

### Running the Application

1. Clone the repository

2. Start the application:
```bash
docker-compose up --build
```

3. Access the applications:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/swagger/

### Development

#### Backend
- The Django application will automatically reload when changes are made
- Access the admin interface at http://localhost:8000/admin

#### Frontend
- The Vue.js application will automatically reload when changes are made
- Uses Vite for fast development experience

## API Documentation

The API documentation is available in three formats:
- Swagger UI: http://localhost:8000/swagger/
- ReDoc: http://localhost:8000/redoc/
- OpenAPI JSON: http://localhost:8000/swagger.json/