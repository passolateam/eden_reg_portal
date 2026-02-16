# Parent Registration Portal

A simple web application for parent registration with Docker containerization.

## 📋 Project Description

This application allows parents to register themselves and their children through a web form. Data is stored persistently in a PostgreSQL database. The entire application is containerized using Docker for easy deployment and scalability.

## 🏗️ Architecture

The application consists of three services:

- **Frontend**: Nginx web server serving HTML/CSS/JavaScript
- **Backend**: Node.js/Express REST API
- **Database**: PostgreSQL for data persistence

All services communicate through a custom Docker network.

## 🚀 Quick Start

### Prerequisites
- Docker
- Docker Compose

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/passolateam/eden_reg_portal.git
   cd eden_reg_portal# eden_reg_portal
