Getting Started (Local Setup)

This project consists of:

🎨 A frontend (React + TypeScript)

🐘 A PHP API (served separately)

🗄 A MySQL database

You’ll need a local web server environment (Apache/Nginx + PHP + MySQL).
I used Laragon, but XAMPP/WAMP/MAMP works too.

1️⃣ Clone the repository
git clone https://github.com/Dzsepetto/OnlineGames.git
cd OnlineGames

2️⃣ Set up the database

Start your local MySQL server.

Create a new database (for example):

dzsepetto_local


Import the provided SQL schema if available.

3️⃣ Configure the PHP API environment

Inside the api folder, create a file:

api/.env


Example (local setup):

APP_ENV=local

ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

DB_HOST=127.0.0.1
DB_NAME=dzsepetto_local
DB_USER=root
DB_PASS=
SESSION_DOMAIN=


⚠️ The .env file is required for the API to run correctly.

4️⃣ Serve the PHP API

The api folder must be placed inside your local web server root.

Example with Laragon:

C:\laragon\www\onlinegames\api


Then the API should be accessible at:

http://localhost/onlinegames/api


(or depending on your setup)

5️⃣ Configure the frontend

Inside the frontend folder, create:

.env.local


Example:

VITE_API_BASE_URL=http://localhost/onlinegames/api


Adjust the URL to match your local API path.

6️⃣ Run the frontend

Inside the frontend directory:

npm install
npm run dev


Open the shown local URL in your browser.

🎯 Miért jobb ez?

✔ Tisztán szétválasztja frontend és backend configot
✔ Egyezik az új .env rendszereddel
✔ Nem kever DB adatokat a frontendbe
✔ Production-ready struktúrára épül