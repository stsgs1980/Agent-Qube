import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// API routes that require authentication for MUTATING operations (POST/PUT/PATCH/DELETE)
// GET requests to these routes remain public (dashboard reads data without auth)
const MUTATION_PROTECTED_ROUTES = [
  '/api/agents',
  '/api/tasks',
  '/api/workflows',
  '/api/prompt-history',
]

// Routes that should be completely blocked in production
const BLOCKED_IN_PRODUCTION = [
  '/api/seed',
  '/api/workflows/seed',
]

// Mutating methods that need CSRF protection and auth
const MUTATING_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']

// Rate limiting store (in-memory, resets on restart)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

function getRateLimitKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || 'unknown'
  return ip
}

function checkRateLimit(key: string, maxRequests = 100, windowMs = 60000): boolean {
  const now = Date.now()
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= maxRequests) {
    return false
  }

  record.count++
  return true
}

// Validate API key or session token
function validateAuth(request: NextRequest): boolean {
  // Check for API key in headers
  const apiKey = request.headers.get('x-api-key')
  if (apiKey && apiKey === process.env.API_KEY) {
    return true
  }

  // Check for session cookie (next-auth)
  const sessionToken = request.cookies.get('next-auth.session-token')?.value
  if (sessionToken) {
    // In production, verify JWT signature here
    // For now, presence of token is sufficient
    return true
  }

  // Check for Authorization header
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7)
    // In production, verify JWT here
    return token.length > 0
  }

  return false
}

// Validate CSRF token using Origin/Referer header check
function validateCsrf(request: NextRequest): boolean {
  // Only check mutating methods
  if (!MUTATING_METHODS.includes(request.method)) {
    return true
  }

  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  // Allow requests with no origin (e.g., Postman, curl, mobile apps)
  if (!origin && !referer) {
    return true
  }

  // Check Origin header
  if (origin) {
    try {
      const originUrl = new URL(origin)
      if (originUrl.host === host) {
        return true
      }
      // Check against allowed origins
      const allowedOrigins = [
        process.env.NEXT_PUBLIC_APP_URL,
        'http://localhost:3000',
        'http://localhost:3001',
      ].filter(Boolean)
      if (allowedOrigins.includes(origin)) {
        return true
      }
    } catch {
      return false
    }
  }

  // Check Referer header as fallback
  if (referer) {
    try {
      const refererUrl = new URL(referer)
      if (refererUrl.host === host) {
        return true
      }
    } catch {
      return false
    }
  }

  return false
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply to API routes
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Block dangerous routes in production (allow with valid API key for seeding)
  if (process.env.NODE_ENV === 'production') {
    for (const route of BLOCKED_IN_PRODUCTION) {
      if (pathname === route || pathname.startsWith(route + '/')) {
        if (!validateAuth(request)) {
          return NextResponse.json(
            { error: 'This endpoint is disabled in production' },
            { status: 403 }
          )
        }
        // API key valid, allow through
      }
    }
  }

  // Rate limiting for all API routes
  const rateLimitKey = getRateLimitKey(request)
  const maxRequests = pathname.startsWith('/api/seed') ? 5 : 100
  if (!checkRateLimit(rateLimitKey, maxRequests)) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429 }
    )
  }

  // CSRF protection for mutating requests
  if (!validateCsrf(request)) {
    return NextResponse.json(
      { error: 'CSRF validation failed' },
      { status: 403 }
    )
  }

  // Check authentication for mutating requests on protected routes
  if (MUTATING_METHODS.includes(request.method)) {
    for (const route of MUTATION_PROTECTED_ROUTES) {
      if (pathname === route || pathname.startsWith(route + '/')) {
        if (!validateAuth(request)) {
          return NextResponse.json(
            { error: 'Authentication required for this operation' },
            { status: 401 }
          )
        }
        break
      }
    }
  }

  // CORS headers for API routes
  const response = NextResponse.next()

  // Restrict CORS to specific origins
  const origin = request.headers.get('origin')
  const allowedOrigins = [
    process.env.NEXT_PUBLIC_APP_URL,
    'http://localhost:3000',
    'http://localhost:3001',
  ].filter(Boolean)

  if (origin && allowedOrigins.includes(origin)) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  } else if (process.env.NODE_ENV !== 'production') {
    // Allow all origins in development
    response.headers.set('Access-Control-Allow-Origin', '*')
  }

  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-API-Key')
  response.headers.set('Access-Control-Max-Age', '86400')

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers })
  }

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}
