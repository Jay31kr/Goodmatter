<div align="center">

# 🌱 GoodMatter

### A Backend Ecosystem for Startups & Investors

*Inspired by the vision of [GoodMatter](https://goodmatter.in), founded by **Saswat**.*

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)

</div>

---

## About

GoodMatter is a Node.js/Express REST API that connects startups and investors. It handles authentication with JWT + refresh token rotation, startup profile and pitch deck management via Cloudinary, and a deal flow system driven by a Finite State Machine for clean state transitions.

---

## Tech Stack

| | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (`jsonwebtoken`), `bcrypt`, `crypto` |
| Validation | Zod |
| File Storage | Cloudinary |
| Email / OTP | Nodemailer |
| Config | dotenv |

---

## API Routes

Base URL: `http://localhost:5000/api/v1`

### Auth — `/api/v1/auth`

| Method | Route | Description |
|---|---|---|
| `POST` | `/signup` | Register a new user, sends OTP to email |
| `POST` | `/verify-email` | Verify OTP and activate account |
| `POST` | `/login` | Login, returns access token + refresh token cookie |
| `POST` | `/logout` | Invalidate refresh token |
| `POST` | `/resend-otp` | Resend OTP to registered email |
| `POST` | `/refresh-token` | Issue new access token, rotates refresh token |

### Startup — `/api/v1/startup` 🔒 `role: startup`

| Method | Route | Description |
|---|---|---|
| `GET` | `/me` | Get authenticated startup's profile |
| `POST` | `/` | Create startup profile |
| `PATCH` | `/` | Update startup profile |
| `POST` | `/pitch-deck` | Upload PDF pitch deck (replaces existing) |
| `DELETE` | `/pitch-deck` | Delete pitch deck |

### Deals — `/api/v1/deal` 🔒 Role-specific

| Method | Route | Role | Description |
|---|---|---|---|
| `GET` | `/startups` | investor | Browse startups with filters & pagination |
| `POST` | `/` | investor | Send a deal offer to a startup |
| `GET` | `/me` | investor | View all deals initiated by this investor |
| `PATCH` | `/:dealId/withdraw` | investor | Withdraw a pending offer |
| `GET` | `/startup` | startup | View all deals received |
| `PATCH` | `/:dealId/accept` | startup | Accept a pending deal |
| `PATCH` | `/:dealId/reject` | startup | Reject a pending deal |

---

> 💛 Shoutout to **Saswat**, founder of [GoodMatter](https://goodmatter.in), for the inspiration behind this project.
