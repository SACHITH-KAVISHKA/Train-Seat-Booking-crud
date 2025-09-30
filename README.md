# 🚆 Train Booking Management System

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.1.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://openjdk.java.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Maven](https://img.shields.io/badge/Maven-3.6+-red.svg)](https://maven.apache.org/)
[![Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203-green.svg)](https://swagger.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A comprehensive **Spring Boot REST API** for train booking management system with **MySQL database integration**, **complete CRUD operations**, and **interactive API documentation**.

## 🌟 Features

- 🔐 **User Management**: Registration, authentication, and profile management
- 🔍 **Smart Train Search**: Search available trains by routes and dates  
- 📝 **Booking Management**: Create, update, cancel, and view bookings
- 🎫 **PNR System**: Automatic PNR generation and booking tracking
- 📧 **Email Notifications**: Automatic booking confirmations and cancellations
- 🛡️ **Exception Handling**: Comprehensive error handling with custom exceptions
- 📊 **Admin Panel**: Schedule management APIs for administrators
- 📖 **API Documentation**: Interactive Swagger UI for testing
- ✅ **Data Validation**: Bean validation with custom error messages
- 🎯 **Sample Data**: Pre-loaded test data for immediate testing

## 🏗️ Project Architecture

```
📁 Train Booking System
├── 🗂️ src/main/java/com/skm_labs/train_booking_system/
│   ├── 📋 config/           # Configuration classes (CORS, Swagger, Data initialization)
│   ├── 🎮 controller/       # REST endpoints (User, Booking, Schedule, Health)
│   ├── 📄 dto/             # Data Transfer Objects
│   │   ├── request/        # Request DTOs (validation included)
│   │   └── response/       # Response DTOs (standardized format)
│   ├── 🏗️ entity/          # JPA entities (User, Train, Schedule, Booking)
│   ├── ⚠️ exception/       # Custom exceptions + Global exception handler
│   ├── 🗄️ repository/      # JPA repositories with custom queries
│   ├── 🔧 service/         # Business logic layer
│   └── 🛠️ util/           # Utility classes
├── 📝 Documentation/       # README, Quick Start, IntelliJ Fix guides
└── 🧪 Test Data/          # Sample trains, users, schedules, and routes
```

## 🚀 Quick Start

### Prerequisites
- ☕ **Java 17+** installed
- 🐬 **MySQL 8.0+** running  
- 📦 **Maven 3.6+** installed

### 1️⃣ Database Setup
```sql
CREATE DATABASE train_booking;
```

### 2️⃣ Clone & Run
```bash
git clone https://github.com/SACHITH-KAVISHKA/Train-Seat-Booking-crud.git
cd Train-Seat-Booking-crud
mvn spring-boot:run
```

### 3️⃣ Access Application
- 🌐 **API Base**: http://localhost:8080/api
- 📚 **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- 💚 **Health Check**: http://localhost:8080/api/health

## Technology Stack

- **Backend**: Spring Boot 3.x
- **Database**: MySQL 8.x
- **Build Tool**: Maven
- **Java Version**: 17
- **API Documentation**: Swagger/OpenAPI 3
- **Email**: Spring Mail
- **Validation**: Bean Validation (JSR-303)

## Prerequisites

1. **Java 17** or higher
2. **MySQL 8.0** or higher
3. **Maven 3.6+**
4. **IDE** (IntelliJ IDEA, Eclipse, or VS Code)

## Database Setup

1. **Create MySQL Database**:
   ```sql
   CREATE DATABASE train_booking;
   ```

2. **Update Database Configuration**:
   The application is configured to use:
   - **Database**: `train_booking`
   - **Username**: `root`
   - **Password**: `sachith1234`
   
   If you need to change these settings, update `src/main/resources/application.properties`

3. **Database Tables**:
   Tables will be automatically created when you run the application (thanks to Hibernate DDL auto-update).

## Installation & Setup

1. **Clone the Repository**:
   ```bash
   git clone <repository-url>
   cd Train_Booking_System
   ```

2. **Configure Email Settings** (Optional):
   Update email configuration in `application.properties`:
   ```properties
   spring.mail.username=your-email@gmail.com
   spring.mail.password=your-app-password
   ```

3. **Build the Application**:
   ```bash
   mvn clean compile
   ```

4. **Run the Application**:
   ```bash
   mvn spring-boot:run
   ```

   Or run from your IDE by executing the main class: `TrainBookingSystemApplication`

5. **Verify Setup**:
   - Application starts on: `http://localhost:8080`
   - API base URL: `http://localhost:8080/api`
   - Swagger UI: `http://localhost:8080/api/swagger-ui.html`
   - Health Check: `http://localhost:8080/api/health`

## Sample Data

The application automatically initializes with sample data including:

### Sample Trains:
- **TR001**: Rajdhani Express (First Class, 300 seats)
- **TR002**: Shatabdi Express (First Class, 250 seats)
- **TR003**: Duronto Express (Second Class, 400 seats)
- **TR004**: Garib Rath (Third Class, 500 seats)
- **TR005**: Jan Shatabdi (Second Class, 350 seats)

### Sample Users:
- `john.doe@email.com` / `password123`
- `jane.smith@email.com` / `password123`
- `admin@email.com` / `admin123`

### Sample Routes:
- New Delhi ↔ Mumbai
- New Delhi ↔ Chandigarh
- Kolkata ↔ New Delhi
- Chennai ↔ New Delhi
- Bangalore ↔ Chennai

## API Endpoints

### User Management
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - User authentication
- `GET /api/users/profile/{userId}` - Get user profile
- `GET /api/users/check-email?email={email}` - Check email availability

### Booking Management
- `POST /api/bookings/search` - Search available trains
- `POST /api/bookings/book` - Create new booking
- `GET /api/bookings/user/{userId}` - Get user bookings
- `PUT /api/bookings/{bookingId}` - Update booking
- `DELETE /api/bookings/{bookingId}` - Cancel booking
- `GET /api/bookings/pnr/{pnrNumber}` - Get booking by PNR

### Schedule Management (Admin)
- `POST /api/admin/schedules` - Create schedule
- `PUT /api/admin/schedules/{scheduleId}` - Update schedule
- `GET /api/admin/schedules` - Get all schedules
- `GET /api/admin/schedules/{scheduleId}` - Get schedule by ID

### System
- `GET /api/health` - Health check

## API Usage Examples

### 1. User Registration
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@email.com",
    "password": "password123",
    "firstName": "New",
    "lastName": "User",
    "phoneNumber": "+1234567890"
  }'
```

### 2. User Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@email.com",
    "password": "password123"
  }'
```

### 3. Search Trains
```bash
curl -X POST http://localhost:8080/api/bookings/search \
  -H "Content-Type: application/json" \
  -d '{
    "departureStation": "New Delhi",
    "arrivalStation": "Mumbai",
    "departureDate": "2024-01-15",
    "seatCount": 2
  }'
```

### 4. Create Booking
```bash
curl -X POST http://localhost:8080/api/bookings/book \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "scheduleId": 1,
    "passengerName": "John Doe",
    "passengerEmail": "john.doe@email.com",
    "passengerPhone": "+1234567890",
    "seatCount": 2
  }'
```

### 5. Get User Bookings
```bash
curl -X GET http://localhost:8080/api/bookings/user/1
```

## Response Format

### Success Response
```json
{
  "status": "SUCCESS",
  "message": "Operation completed successfully",
  "data": { ... },
  "timestamp": "2024-01-01T10:00:00Z"
}
```

### Error Response
```json
{
  "timestamp": "2024-01-01T10:00:00Z",
  "status": 404,
  "error": "Not Found",
  "message": "Booking not found with id: 123",
  "path": "/api/bookings/123"
}
```

## Business Logic Features

### Booking Creation Process:
1. Validates user existence
2. Validates schedule existence
3. Checks seat availability
4. Calculates total amount
5. Generates unique PNR number
6. Updates available seats
7. Sends confirmation email

### Train Search Features:
- Filter by departure/arrival stations
- Filter by departure date
- Show only trains with available seats
- Sort results by departure time
- Include fare and availability information

### Booking Management:
- Update passenger details
- Modify seat count (subject to availability)
- Cancel bookings with seat release
- View booking history
- PNR-based booking lookup

## Security Considerations

**Note**: This is a development/demo version. For production use:
- Implement proper password hashing (BCrypt)
- Add JWT-based authentication
- Implement role-based access control
- Add rate limiting
- Enable HTTPS
- Validate and sanitize all inputs
- Add comprehensive logging and monitoring

## Testing

### Run Unit Tests:
```bash
mvn test
```

### Manual Testing:
1. Use Swagger UI at `http://localhost:8080/api/swagger-ui.html`
2. Use Postman with the provided API examples
3. Test health endpoint: `http://localhost:8080/api/health`

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Ensure MySQL is running
   - Verify database credentials in `application.properties`
   - Check if database `train_booking` exists

2. **Port Already in Use**:
   - Change port in `application.properties`: `server.port=8081`
   - Kill process using port 8080: `netstat -ano | findstr :8080`

3. **Email Service Error**:
   - Update email configuration in `application.properties`
   - For Gmail, use app-specific passwords

4. **Build Issues**:
   - Ensure Java 17 is installed: `java -version`
   - Clean and rebuild: `mvn clean compile`

## API Documentation

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/api-docs
- **Health Check**: http://localhost:8080/api/health

## Project Structure

```
src/main/java/com/skm_labs/train_booking_system/
├── config/          # Configuration classes
├── controller/      # REST controllers
├── dto/            # Data Transfer Objects
│   ├── request/    # Request DTOs
│   └── response/   # Response DTOs
├── entity/         # JPA entities
│   └── enums/      # Enums
├── exception/      # Custom exceptions
├── repository/     # JPA repositories
├── service/        # Service interfaces
│   └── impl/       # Service implementations
└── util/           # Utility classes
```

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation in Swagger UI
- Examine application logs for detailed error information