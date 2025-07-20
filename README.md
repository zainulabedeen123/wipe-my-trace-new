# Wipe My Trace

A privacy-focused SaaS platform that automates data deletion requests across multiple jurisdictions (EU, UK, USA, Asia Pacific). Built with Next.js 15, TypeScript, Tailwind CSS, and Clerk authentication.

## 🚀 Features

- **Multi-Jurisdiction Compliance**: Automated GDPR, CCPA, and other privacy regulation compliance
- **Secure Authentication**: Powered by Clerk with social login support
- **Responsive Design**: Beautiful, mobile-first design with dark mode support
- **Automated Processing**: Streamlined data deletion request workflow
- **Real-time Tracking**: Monitor deletion request status and progress
- **Enterprise Ready**: Scalable architecture for individual and business use

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk
- **Deployment**: Coolify with Nixpacks
- **Hosting**: Hostinger VPS

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 20 or higher
- npm or yarn
- Clerk account

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd wipe-my-trace-new
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Clerk keys:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
   CLERK_SECRET_KEY=your_secret_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deployment

This project is configured for deployment on Hostinger VPS using Coolify with Nixpacks.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deployment Steps

1. Push code to your Git repository
2. Configure Coolify with Nixpacks buildpack
3. Set production environment variables
4. Deploy and configure domain
5. Update Clerk dashboard with production URLs

## 🔧 Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run build:production` - Full production build with checks

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `NEXT_PUBLIC_APP_URL` | Application URL | Production |
| `NODE_ENV` | Environment (development/production) | Yes |

## 🏗️ Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout with Clerk
│   │   └── page.tsx         # Landing page
│   └── middleware.ts        # Clerk middleware
├── public/                  # Static assets
├── nixpacks.toml           # Nixpacks configuration
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── DEPLOYMENT.md           # Deployment guide
```

## 🔐 Authentication

Authentication is handled by Clerk and includes:

- Email/password authentication
- Social login (Google, GitHub, etc.)
- User management and profiles
- Session management
- Protected routes

## 🎨 Design System

- **Colors**: Blue and purple gradient theme
- **Typography**: Geist Sans and Geist Mono fonts
- **Components**: Responsive, accessible components
- **Dark Mode**: Automatic dark/light theme support

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🚀 Performance

- **Next.js 15**: Latest performance optimizations
- **Turbopack**: Fast development builds
- **Image Optimization**: Automatic WebP/AVIF conversion
- **Static Generation**: Optimized static assets
- **Compression**: Gzip compression enabled

## 🔒 Security

- **HTTPS**: SSL/TLS encryption
- **Security Headers**: XSS protection, content type sniffing prevention
- **Authentication**: Secure session management with Clerk
- **Environment Variables**: Secure configuration management

## 📈 Monitoring

For production monitoring, consider integrating:
- **Uptime Monitoring**: UptimeRobot, Pingdom
- **Performance**: Google Analytics, Mixpanel
- **Error Tracking**: Sentry, LogRocket
- **Infrastructure**: Server monitoring tools

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For support and questions:
- Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide
- Review Clerk documentation
- Contact the development team
