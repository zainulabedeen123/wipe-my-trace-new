import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Basic health check
    const healthCheck = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      services: {
        clerk: process.env.CLERK_SECRET_KEY ? 'configured' : 'missing',
        nextjs: 'running',
      }
    };

    return NextResponse.json(healthCheck, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { 
        status: 'error', 
        timestamp: new Date().toISOString(),
        error: 'Health check failed' 
      }, 
      { status: 500 }
    );
  }
}
