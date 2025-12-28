# Rikugan - Demon Slayer Corps Project Management System

A gamified project management system with bounty-based rewards, role-based access control, and team collaboration features.

## Demo Video

- https://drive.google.com/file/d/1mu7LVyT7o1Esn0wj_BPCyF5dzKre47jd/view?usp=sharing

## 🚀 Quick Start

### Prerequisites

- Docker Desktop
- Git

### Deploy with Docker (Recommended)

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd 3100
   ```
2. **Start the application**

   ```bash
   docker compose up -d --build
   ```
3. **Access the application**

   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api/v1
4. **Login with demo account**

   - Email: `admin@dscpms.com`
   - Password: `Admin123!`
   - License Key: `DSCPMS-2024-UNLIMITED-ACCESS`

That's it! 🎉

## 📚 Documentation

- [API Documentation](./API_DOCUMENTATION.md) - Complete API reference
- [Deployment Guide](./DEPLOYMENT.md) - Detailed deployment instructions
- [Testing Documentation](./TESTING_DOCUMENTATION.md) - Testing guide and coverage

## 🎮 Features

- **Role-Based Access Control** - Three user roles: Goons, Hashira, Oyakatasama
- **Task Management** - Kanban board with bounty rewards
- **Team Collaboration** - Multi-user teams with license management
- **Bounty System** - Earn rewards for completing tasks, penalties for delays
- **Real-time Notifications** - Stay updated on task assignments and deadlines

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite + HeroUI
- **Backend:** Node.js + Express.js + Sequelize ORM
- **Database:** MySQL 8.0
- **Deployment:** Docker + Docker Compose

## 👥 Default User Roles


| Role                | Email              | Password    | Permissions                  |
| ------------------- | ------------------ | ----------- | ---------------------------- |
| Admin (Oyakatasama) | admin@dscpms.com   | Admin123!   | Full system access           |
| Senior (Hashira)    | rengoku@dscpms.com | Hashira123! | Create tasks, manage team    |
| Junior (Goon)       | tanjiro@dscpms.com | Goon123!    | Work on tasks, earn bounties |

## 🔧 Manual Setup

### Backend

```bash
cd backend
npm install
npm run db:setup
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Database

Ensure MySQL is running and create database:

```sql
CREATE DATABASE dscpms;
```

## 📝 Environment Configuration

### Backend (.env)

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dscpms
DB_USER=root
DB_PASSWORD=root
JWT_SECRET=your-secret-key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api/v1
```

## 🐛 Troubleshooting

**Port already in use:**

```bash
# Stop all containers
docker compose down

# Remove volumes and restart
docker compose down -v
docker compose up -d --build
```

**Database connection error:**

```bash
# Check MySQL is running
docker compose ps mysql

# View logs
docker compose logs mysql
```

**Frontend can't connect to backend:**

- Verify backend is running at http://localhost:3000
- Check `VITE_API_URL` in frontend/.env

## 📦 Project Structure

```
3100/
├── backend/          # Node.js/Express API
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── __tests__/    # Jest tests
├── frontend/         # React + TypeScript
│   └── src/
│       ├── components/
│       ├── pages/
│       └── contexts/
├── docker-compose.yml
└── DEPLOYMENT.md
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# With coverage
npm run test:coverage
```

## 📊 API Endpoints


| Endpoint                       | Method | Description              |
| ------------------------------ | ------ | ------------------------ |
| `/auth/login`                  | POST   | User login               |
| `/auth/register`               | POST   | User registration        |
| `/tasks`                       | GET    | List all tasks           |
| `/tasks/:id/assign`            | POST   | Assign task to self      |
| `/bounty/transactions/:userId` | GET    | View transaction history |
| `/notifications`               | GET    | Get notifications        |

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete reference.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 System Features

- **Authentication & Authorization** - JWT-based secure login with role-based permissions
- **Task Board** - Kanban-style board with drag-and-drop (Available → In Progress → Completed)
- **Bounty Management** - Automatic payment on completion, penalties for missed deadlines
- **Team Management** - Create teams, invite members, assign roles
- **License System** - Team-based access control with configurable license keys
- **Notifications** - Real-time alerts for assignments, deadlines, and achievements
- **Transaction History** - Complete audit trail of bounties and penalties
- **Statistics Dashboard** - Track performance, earnings, and completion rates

## 🔐 Security

- Passwords hashed with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- SQL injection prevention via Sequelize ORM
- XSS protection with Helmet.js
- CORS configuration

## 📈 Performance

- Response time: <500ms for 95% of requests
- Supports 50+ concurrent users
- Database connection pooling
- Optimized queries with proper indexing

## 🆘 Support

For detailed setup, troubleshooting, and production deployment, see:

- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference
- [TESTING_DOCUMENTATION.md](./TESTING_DOCUMENTATION.md) - Testing guide

---

**Built with ❤️ for the Demon Slayer Corps**
