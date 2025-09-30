# 🚀 Quick Start Guide - Train Booking System

## Prerequisites Check
- ✅ Java 17+ installed
- ✅ MySQL 8.0+ running
- ✅ Database `train_booking` created
- ✅ Database credentials: root/sachith1234

## 1-Minute Setup

### Step 1: Start MySQL and Create Database
```sql
CREATE DATABASE train_booking;
```

### Step 2: Run the Application
**Option A - Windows:**
```bash
run.bat
```

**Option B - Manual:**
```bash
mvn clean compile
mvn spring-boot:run
```

### Step 3: Access the Application
- **API Base**: http://localhost:8080/api
- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **Health Check**: http://localhost:8080/api/health

## Test the System

### 1. Register a User
```bash
curl -X POST http://localhost:8080/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@email.com",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "phoneNumber": "+1234567890"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:8080/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@email.com",
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
    "departureDate": "2024-12-31"
  }'
```

## What's Included

✅ **5 Sample Trains** with different classes and routes
✅ **3 Sample Users** (john.doe@email.com, jane.smith@email.com, admin@email.com)
✅ **10+ Sample Schedules** for testing
✅ **Complete REST API** with validation and error handling
✅ **Email Notifications** (configure SMTP settings)
✅ **Swagger Documentation** for easy testing
✅ **Automatic Database Setup** via Hibernate

## Sample Test Data

### Pre-created Users:
- `john.doe@email.com` / `password123`
- `jane.smith@email.com` / `password123`
- `admin@email.com` / `admin123`

### Sample Routes Available:
- New Delhi ↔ Mumbai (Rajdhani Express)
- New Delhi ↔ Chandigarh (Shatabdi Express)
- Kolkata ↔ New Delhi (Duronto Express)
- Chennai ↔ New Delhi (Garib Rath)
- Bangalore ↔ Chennai (Jan Shatabdi)

## Troubleshooting

**Database Connection Error?**
- Ensure MySQL is running
- Verify database name: `train_booking`
- Check credentials: root/sachith1234

**Port 8080 in use?**
- Change port in `application.properties`: `server.port=8081`

**Need help?**
- Check `README.md` for detailed documentation
- Use Swagger UI for interactive API testing
- Check application logs in console

---
🎉 **You're ready to go!** Visit http://localhost:8080/api/swagger-ui.html to start testing!