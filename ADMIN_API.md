# Admin API Documentation

This document outlines the available API endpoints for admin management.

## Base URL
All endpoints are prefixed with `/api/admin`

## Endpoints

### Register a New Admin
- **URL**: `/register`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "name": "Admin Name",
    "mobileNumber": "9876543210",
    "password": "password123"
  }
  ```
- **Success Response**:
  - **Code**: 201
  - **Content**:
    ```json
    {
      "message": "Admin registered successfully",
      "data": {
        "id": 1,
        "name": "Admin Name",
        "mobileNumber": "9876543210",
        "role": "admin",
        "token": "jwt.token.here"
      }
    }
    ```

### Admin Login
- **URL**: `/login`
- **Method**: `POST`
- **Access**: Public
- **Request Body**:
  ```json
  {
    "mobileNumber": "9876543210",
    "password": "password123"
  }
  ```
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Login successful",
      "data": {
        "id": 1,
        "name": "Admin Name",
        "mobileNumber": "9876543210",
        "role": "admin",
        "token": "jwt.token.here"
      }
    }
    ```

### Get Admin Details
- **URL**: `/me`
- **Method**: `GET`
- **Access**: Private (Requires authentication)
- **Headers**:
  - `Authorization`: `Bearer <token>`
- **Success Response**:
  - **Code**: 200
  - **Content**:
    ```json
    {
      "message": "Admin details retrieved successfully",
      "data": {
        "id": 1,
        "name": "Admin Name",
        "mobileNumber": "9876543210",
        "role": "admin",
        "createdAt": "2023-01-01T00:00:00.000Z",
        "updatedAt": "2023-01-01T00:00:00.000Z"
      }
    }
    ```

## Error Responses

### 400 Bad Request
- When required fields are missing or invalid
- **Example**:
  ```json
  {
    "errors": [
      {
        "msg": "Please include a valid 10-digit mobile number",
        "param": "mobileNumber",
        "location": "body"
      }
    ]
  }
  ```

### 401 Unauthorized
- When authentication fails or token is invalid/missing
- **Example**:
  ```json
  {
    "message": "Invalid mobile number or password"
  }
  ```

### 403 Forbidden
- When trying to access admin-only routes without admin privileges
- **Example**:
  ```json
  {
    "message": "Access denied. Admins only."
  }
  ```

### 500 Internal Server Error
- When an unexpected error occurs on the server
- **Example**:
  ```json
  {
    "message": "Error registering admin",
    "error": "Error message details"
  }
  ```

## Authentication
All private routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Validation Rules
- **Name**: Required, string
- **Mobile Number**: Required, 10 digits, unique
- **Password**: Required, minimum 6 characters
