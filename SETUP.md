# Zha Fashion - Production Setup Guide

## Prerequisites
- PHP 8.2+
- Composer
- Node.js & NPM
- MySQL

## Backend Setup (Laravel)
1. Navigate to the `server` directory:
   ```bash
   cd server
   ```
2. Run composer update to install dependencies (if not already present):
   ```bash
   composer update
   ```
3. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
4. Configure your database in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=zha_fashion
   DB_USERNAME=root
   DB_PASSWORD=
   ```
5. Generate an application key:
   ```bash
   php artisan key:generate
   ```
6. Run migrations (ensure your database exists):
   ```bash
   php artisan migrate --seed
   ```
7. Start the development server:
   ```bash
   php artisan serve
   ```

## Frontend Setup (Vue 3)
1. Navigate to the `client` directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file for Vite (optional, currently uses proxy):
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

## Deployment Guide (Shared Hosting / VPS)

### VPS (Nginx + Laravel + Vue)
1. **Frontend Build**:
   - Run `npm run build` in the `client` directory.
   - Copy the contents of `client/dist` to your web server's public directory (or serve via Nginx).
2. **Backend**:
   - Set up an Nginx block for your Laravel API.
   - Ensure the `public` directory is the root.
   - Run `php artisan optimize` for performance.
3. **Database**:
   - Use a production-grade database service.
   - Ensure `APP_ENV=production` and `APP_DEBUG=false` in `.env`.

### Razorpay Integration
- Update your Razorpay credentials in the Laravel `.env` and Frontend config.
- Ensure the webhook URL is correctly mapped in the Razorpay dashboard.

### WhatsApp Integration
- Add your business phone number in the contact components.
- For automated notifications, consider using a provider like Twilio or Interakt.
