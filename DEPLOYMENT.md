# Wipe My Trace - Deployment Guide

## Deployment on Hostinger VPS with Coolify using Nixpacks

This guide will help you deploy the Wipe My Trace application on a Hostinger VPS using Coolify with Nixpacks buildpack.

## Prerequisites

1. **Hostinger VPS** with Coolify installed
2. **Domain name** pointed to your VPS
3. **Clerk account** with application configured
4. **Git repository** with your code

## Step 1: Prepare Your Repository

Ensure your repository contains all the necessary files:
- `nixpacks.toml` - Nixpacks configuration
- `.env.example` - Environment variables template
- `next.config.ts` - Optimized Next.js configuration
- `package.json` - Updated with production scripts

## Step 2: Coolify Configuration

### 2.1 Create New Project in Coolify

1. Log into your Coolify dashboard
2. Click "New Project"
3. Choose "Git Repository"
4. Connect your repository (GitHub/GitLab/etc.)

### 2.2 Build Configuration

- **Build Pack**: Select "Nixpacks"
- **Build Command**: `npm run build` (automatically detected)
- **Start Command**: `npm start` (automatically detected)
- **Port**: `3000` (Next.js default)

### 2.3 Environment Variables

Set the following environment variables in Coolify:

```bash
# Required - Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_your_publishable_key
CLERK_SECRET_KEY=sk_live_your_secret_key

# Required - Application URL
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Required - Node Environment
NODE_ENV=production
```

## Step 3: Clerk Configuration

### 3.1 Update Clerk Dashboard

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your application
3. Navigate to "Domains" section
4. Add your production domain: `https://your-domain.com`
5. Update allowed redirect URLs:
   - `https://your-domain.com`
   - `https://your-domain.com/sign-in/sso-callback`
   - `https://your-domain.com/sign-up/sso-callback`

### 3.2 Get Production Keys

1. In Clerk Dashboard, go to "API Keys"
2. Copy the **Live** keys (not test keys)
3. Update environment variables in Coolify

## Step 4: Domain Configuration

### 4.1 DNS Settings

Point your domain to your Hostinger VPS:
- **A Record**: `@` → `your-vps-ip`
- **CNAME Record**: `www` → `your-domain.com`

### 4.2 SSL Certificate

Coolify will automatically generate SSL certificates via Let's Encrypt.

## Step 5: Deployment Process

### 5.1 Deploy Application

1. In Coolify, click "Deploy"
2. Monitor the build logs
3. Wait for deployment to complete

### 5.2 Verify Deployment

1. Visit your domain
2. Test authentication flow:
   - Click "Sign Up" or "Get Started"
   - Complete registration
   - Verify user dashboard access

## Step 6: Post-Deployment Checklist

- [ ] Domain resolves correctly
- [ ] SSL certificate is active
- [ ] Authentication works (sign up/sign in)
- [ ] All pages load properly
- [ ] Mobile responsiveness works
- [ ] Performance is acceptable

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version in `nixpacks.toml`
   - Verify all dependencies are in `package.json`
   - Check build logs for specific errors

2. **Authentication Errors**
   - Verify Clerk keys are correct
   - Check domain configuration in Clerk
   - Ensure HTTPS is working

3. **Environment Variables**
   - Double-check all required variables are set
   - Verify no typos in variable names
   - Ensure production keys (not test keys)

### Performance Optimization

1. **Enable Caching**
   - Configure Cloudflare or similar CDN
   - Set up proper cache headers

2. **Monitor Performance**
   - Use tools like Google PageSpeed Insights
   - Monitor Core Web Vitals

## Maintenance

### Regular Updates

1. **Dependencies**: Keep packages updated
2. **Security**: Monitor for security updates
3. **Monitoring**: Set up uptime monitoring
4. **Backups**: Regular database backups (when added)

### Scaling

As your application grows:
1. Consider upgrading VPS resources
2. Implement database optimization
3. Add CDN for static assets
4. Consider load balancing for high traffic

## Support

For deployment issues:
1. Check Coolify documentation
2. Review Nixpacks documentation
3. Consult Hostinger VPS support
4. Check application logs in Coolify dashboard
