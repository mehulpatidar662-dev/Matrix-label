# MatrixLabel API v1 Documentation

Base URL: `http://localhost:8000/v1` (Proxied in web app via `http://localhost:3000/v1`)

## Authentication & Sessions

### Register (Client)
- **Endpoint**: `POST /v1/auth/register`
- **Request**:
  ```json
  {
    "name": "Karan Mehta",
    "email": "karan@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "name": "Karan Mehta",
    "email": "karan@example.com",
    "role": "client"
  }
  ```
  Sets `access_token` and `refresh_token` httpOnly cookies.

### Login
- **Endpoint**: `POST /v1/auth/login`
- **Request**:
  ```json
  {
    "email": "karan@example.com",
    "password": "securepassword123"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "name": "Karan Mehta",
    "email": "karan@example.com",
    "role": "client"
  }
  ```

### Current User
- **Endpoint**: `GET /v1/auth/me`
- **Response** (200 OK):
  ```json
  {
    "id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
    "name": "Karan Mehta",
    "email": "karan@example.com",
    "role": "client"
  }
  ```

---

## Quotes & Pricing

### Calculate Estimate
- **Endpoint**: `POST /v1/quotes/estimate`
- **Request**:
  ```json
  {
    "annotation_type": "bbox",
    "images": 5000,
    "turnaround": "standard"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "currency": "INR",
    "labels_est": 30000,
    "rate_paise": 500,
    "base_paise": 15000000,
    "discount_pct": 6,
    "discount_paise": 900000,
    "surcharge_pct": 0,
    "surcharge_paise": 0,
    "total_paise": 14100000
  }
  ```

---

## Public Telemetry & Status

### Public Aggregated Stats
- **Endpoint**: `GET /v1/public/stats`
- **Response** (200 OK):
  ```json
  {
    "labels_delivered": 10000000,
    "avg_delivered_iou": 0.91,
    "spot_check_pct": 5,
    "first_sample_turnaround_hours": 48,
    "updated_at": "2026-09-25T00:00:00Z"
  }
  ```

### System Health & Status
- **Endpoint**: `GET /v1/status`
- **Response** (200 OK):
  ```json
  {
    "status": "operational",
    "components": {
      "api": "operational",
      "db": "operational",
      "redis": "operational",
      "storage": "operational",
      "worker": "operational"
    }
  }
  ```

### Enterprise Lead Capture
- **Endpoint**: `POST /v1/leads`
- **Request**:
  ```json
  {
    "name": "Aarav Sharma",
    "email": "aarav@enterprise.ai",
    "company": "Enterprise AI Labs",
    "message": "We need 500,000 video polygon frames annotated monthly.",
    "source": "enterprise"
  }
  ```
- **Response** (202 Accepted):
  ```json
  {
    "status": "received"
  }
  ```
