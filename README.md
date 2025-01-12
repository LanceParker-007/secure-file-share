# ABSharing

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0-blue.svg?cacheSeconds=2592000" />
</p>

> **ABSharing** is a secure file-sharing application that allows users to share files with others using expirable links, ensuring privacy and security.

## 🛠 Project Structure

> Checkout the docs folder

## 🌍 Live link

The application is also deployed live at https://absharing-frontend.vercel.app/ where the encrypted files are stored in aws s3.

## 🚀 Features

- **Signup using mfa**: Sign up using mfa and password hashing.
  > (mfa disabled for now as sendgrid won't sent email(as I exposed my sengrid api key here), so once you signup, you can simply sign in without otp entering or you can get otp from logs, I have logged it and you can proceed.)
- **Secure File Sharing**: Share files securely using expirable links.
- **Expirable Links**: Set expiration times to ensure files are inaccessible after a specific duration.
- **Make link for specific People**: You can also mentions emails who can access these files.
- **SendGrid Integration**: Email notifications with OTPs for added security.
- **Fully Dockerized**: Easy to set up with Docker Compose.

## 🛠 Install & Setup

To get started with the project, follow these steps:

### 1. Prerequisites

Ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

### 2. Build and Run the Project

Run the following commands from VS code to run the project on your machine:

> git clone https://github.com/LanceParker-007/secure-file-share.git

> cd secure-file-share

> docker-compose up --build

This command will build the frontend and backend services, set up a MongoDB container, and start all services.

> Files are encrypted which you check by yourself in the **uploads** folder

## Usage

Once the services are up and running, you can access the application as follows:

- **Frontend**: Navigate to [http://localhost:5173](http://localhost:5173) to use the application.
- **Backend**: The backend runs at [http://localhost:5000](http://localhost:5000).
- **MongoDB**: MongoDB is accessible at `mongodb://localhost:27017/asdatabase`.

### To Stop the Application

To stop all running services, use:

> docker-compose down

## 🌐 Environment Variables

Ensure the following environment variables are properly set in the respective `.env` files:

### Frontend `.env`

- VITE_BACKEND_SERVER=http://localhost:5000/api/v1

### Backend `.env`

- PORT=5000
  MONGODB_URI=mongodb://mongodb:27017/asdatabase
- FRONTEND_URI=http://localhost:5173
- JWT_SECRET=randomABSharingSecret
- SENDGRID_API_KEY=SG.zFL4D8LyQ4a4L3vvb9RszgHaCBOnXO3kiTuj0XI-8rIYqrJi9yHMXF24jpUhj7LGg
- EMAIL_FROM = microcellops@gmail.com

## 📚 Project Details

- **Frontend**: Built with React.js.
- **Backend**: Built with Node.js and Express.
- **Database**: MongoDB running as a Docker service.
- **Email Service**: Integrated with SendGrid in DEV for OTP delivery.

## ✍️ Author

👤 **Harsh Vardhan**

- Website: [harsh-vardhan.vercel.app](https://harsh-vardhan.vercel.app)
- GitHub: [@LanceParker-007](https://github.com/LanceParker-007)

## ❤️ Show Your Support

If you like this project, give it a ⭐️ to show your support and help it grow!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📝 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Made with ❤️ by Harsh Vardhan.
