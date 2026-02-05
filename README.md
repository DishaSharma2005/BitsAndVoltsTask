

```md
# MERN Stack Developer Practical Task (Bits and Volts Pvt. Ltd.)

This is a Full Stack MERN application created as part of the **Full Stack Intern (MERN) Assessment Task**.

The application allows managing user information with:
- CRUD operations (Add / Edit / Delete / View)
- Pagination support
- Search functionality
- Export users to CSV
- Responsive UI (Mobile + Desktop)

---

## 🚀 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Material UI (MUI)
- React Hook Form + Yup (validation)
- Axios
- React Toastify (notifications)

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer (profile image upload)
- json2csv (export to CSV)

---

## 📌 Features

### ✅ Backend
- CRUD APIs for user management
- Pagination supported in listing API
- Search API
- Export users to CSV API
- Profile image upload support

### ✅ Frontend
- Responsive design (works properly on 350px width)
- 3 Screens:
  1. Listing view page (Table)
  2. Add/Edit form page
  3. View details page
- Routing:
  - `/users`
  - `/users/new`
  - `/users/:id`
  - `/users/:id/edit`
- Field validation using Yup
- Success/Error toast notifications

---

## 📂 Project Structure

### Backend
```

backend/
src/
config/
controllers/
middleware/
models/
routes/
app.js
server.js

```

### Frontend
```

frontend/
src/
api/
components/
pages/
routes/
utils/

````

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone <your-repo-url>
cd <project-folder>
````

---

## 🖥️ Backend Setup

### Go to backend folder

```bash
cd backend
```

### Install dependencies

```bash
npm install
```

### Create `.env`

```env
PORT=8080
MONGO_URI=mongodb://127.0.0.1:27017/bnv_users
CLIENT_URL=http://localhost:5173
```

### Run backend

```bash
npm run dev
```

Backend will start on:

```
http://localhost:8080
```

---

## 🌐 Frontend Setup

### Go to frontend folder

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Run frontend

```bash
npm run dev
```

Frontend will start on:

```
http://localhost:5173
```

---

## 🔗 API Endpoints

### Users CRUD

* `POST /api/users` → Create user
* `GET /api/users?page=1&limit=5` → Get users (pagination)
* `GET /api/users/:id` → Get single user
* `PUT /api/users/:id` → Update user
* `DELETE /api/users/:id` → Delete user

### Search

* `GET /api/users/search?q=test&page=1&limit=5`

### Export CSV

* `GET /api/users/export/csv`

---

## 📸 Screens Implemented

1. **Users Listing Page**

   * Table view
   * Pagination
   * Search
   * Export CSV
   * Actions (View / Edit / Delete)

2. **Add/Edit Form Page**

   * Validated form fields
   * Profile upload support
   * Create & Update user

3. **User View Details Page**

   * Creative details UI
   * Profile preview
   * CreatedAt / UpdatedAt display

---

## ✅ Task Requirements Checklist

* [x] CRUD API with pagination
* [x] Search API
* [x] Export to CSV API
* [x] Responsive UI (Mobile/Desktop)
* [x] Validation rules
* [x] 3 screens implemented
* [x] Multiple routing
* [x] Componentization
* [x] Clean folder structure
* [x] Notifications + error handling

---

## 👨‍💻 Author

**Disha**

