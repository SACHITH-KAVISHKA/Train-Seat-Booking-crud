@echo off
echo Starting Train Booking System...

echo.
echo Checking Java version...
java -version

echo.
echo Building the application...
call mvn clean compile

echo.
echo Starting the application...
echo The application will be available at:
echo - API Base URL: http://localhost:8080/api
echo - Swagger UI: http://localhost:8080/api/swagger-ui.html
echo - Health Check: http://localhost:8080/api/health

echo.
echo Starting Spring Boot application...
call mvn spring-boot:run

pause