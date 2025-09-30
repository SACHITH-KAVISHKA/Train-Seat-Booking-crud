# 🔒 Security Policy

## Supported Versions

We release patches for security vulnerabilities. Which versions are eligible for receiving such patches depend on the CVSS v3.0 Rating:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | ✅ |

## Reporting a Vulnerability

Please report (suspected) security vulnerabilities to **[sachithkavishka786@gmail.com](mailto:sachithkavishka786@gmail.com)**. You will receive a response from us within 48 hours. If the issue is confirmed, we will release a patch as soon as possible depending on complexity but historically within a few days.

## Security Measures

This application implements several security measures:

- 🔐 **Input Validation**: All user inputs are validated using Bean Validation
- 🛡️ **SQL Injection Prevention**: Uses JPA/Hibernate with parameterized queries
- 🌐 **CORS Configuration**: Properly configured Cross-Origin Resource Sharing
- 📧 **Email Security**: Secure SMTP configuration for notifications
- 🗃️ **Database Security**: Prepared statements prevent SQL injection
- 🔒 **Error Handling**: Sensitive information is not exposed in error messages

## Best Practices

When deploying this application:

- Use strong database passwords
- Configure HTTPS/TLS for production
- Implement authentication and authorization
- Regular security updates
- Monitor application logs
- Use environment variables for sensitive configuration