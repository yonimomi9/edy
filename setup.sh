#!/bin/bash

# Initializaitons  

# Install npm dependencies
npm install
cd webServer
npm install
npm i jsonwebtoken
npm i cookie-parser
npm install multer
cd ..

# Config the Web Front Directory
cd web
npm install
npm i jsonwebtoken
npm i cookie-parser
npm install multer
npm install web-vitals
npm install react-icons
npm run build
cd ..

# Create config directory and .env files
mkdir -p webServer/config
echo "CONNECTION_STRING=mongodb://localhost:27017/db" > webServer/config/.env.local
echo "CONNECTION_STRING=mongodb://localhost:27017/test" > webServer/config/.env.test

# Append additional configurations to .env files
echo "API_PORT=3000" >> webServer/config/.env.local
echo "RECOMMEND_PORT=5000" >> webServer/config/.env.local

echo "API_PORT=3000" >> webServer/config/.env.test
echo "RECOMMEND_PORT=5000" >> webServer/config/.env.test

echo "ACCESS_TOKEN_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6Im5ld3VzZXIiLCJyb2xlcyI6eyJ1c2VyIjoyMDAxfX0sImlhdCI6MTczODA4NTgwOSwiZXhwIjoxNzM4MDg5NDA5fQ.2Xo9qZjS9MM1R01OWLp7pjADegw9QH_Q8PXtk3Tu-PA" >> webServer/config/.env.local
echo "ACCESS_TOKEN_SECRET=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6Im5ld3VzZXIiLCJyb2xlcyI6eyJ1c2VyIjoyMDAxfX0sImlhdCI6MTczODA4NTgwOSwiZXhwIjoxNzM4MDg5NDA5fQ.2Xo9qZjS9MM1R01OWLp7pjADegw9QH_Q8PXtk3Tu-PA" >> webServer/config/.env.test

cat <<EOL > webServer/config/roles_list.js
const ROLES_LIST = {
    "admin": "admin",
    "user": "user"
};

module.exports = ROLES_LIST;
EOL
