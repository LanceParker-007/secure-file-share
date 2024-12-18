# ABSharing

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-1.0-blue.svg?cacheSeconds=2592000" />
</p>

> **ABSharing** is a secure file-sharing application that allows users to share files with others using expirable links, ensuring privacy and security.

## 🛠 Project Structure

## 🚀 Features

- **Signup using mfa**: Sign up using mfa and password hashing.
  > (mfa disabled for now as SendGrid won't send an email(as I exposed my sengrid API key here), so once you sign in, you can simply sign in without OTP verification or you can get OTP from backend logs to do this step, I have logged it and you can proceed.)
- **Secure File Sharing**: Share files securely using expirable links.
- **Expirable Links**: Set expiration times to ensure files are inaccessible after a specific duration.
- **Link for specific People**: You can also mention emails who can access these files.
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

**Some points to Note**: 
  - This is running well on Windows.
  - To run in Ubuntu remove the following piece of code from the backend service in the docker-compose file:
    ``` 
      - type: bind
        source: ./uploads
        target: /app/uploads
        bind:
          create_host_path: true
      ```
  - I was not able to test it for MacOS, but I but I will update here once done.
  - If you try this in some office network it can give an error when installing packages, so use a personal internet connection.
  - Rest all is good, hopefully it'll run. If it fail once try again. When I tested it on some machines it took 2 tries to go up and running.
  - Still face any issues and if you would like to talk we can connect.

> **Will soon add the live link where everything will work!** It is almost done (will add the link here). Here files are encrypted (which you check yourself in the uploads folder) and stored locally but on live AWS s3 is used.\*\*

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

- **Frontend**: Built with React or Vue.js.
- **Backend**: Built with Node.js and Express.
- **Database**: MongoDB running as a Docker service.
- **Email Service**: Integrated with SendGrid for OTP delivery.

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
