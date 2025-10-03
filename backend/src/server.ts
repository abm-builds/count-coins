import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';

// Import env config (which now loads dotenv internally)
import { env } from '@/config/env';
import { generalLimiter } from '@/middleware/rateLimiter';
import { errorHandler, notFoundHandler } from '@/middleware/errorHandler';
import routes from '@/routes';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
const allowedOrigins = env.NODE_ENV === 'development' 
  ? ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000']
  : [env.CORS_ORIGIN];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Compression middleware
app.use(compression());

// Logging middleware
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req: any, res: any) => {
  res.json({
    success: true,
    message: 'Count Coins Finance Tracker API',
    version: '1.0.0',
    documentation: '/api/health',
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handling middleware
app.use(errorHandler);

const PORT = env.PORT;

console.log('🔧 Starting server...');
console.log('📊 Environment:', env.NODE_ENV);
console.log('🌐 CORS Origin:', env.CORS_ORIGIN);
console.log('🔗 Database URL configured:', !!env.DATABASE_URL);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${env.NODE_ENV}`);
  console.log(`🌐 CORS Origin: ${env.CORS_ORIGIN}`);
  console.log(`📝 API Documentation: http://localhost:${PORT}/api/health`);
}).on('error', (error) => {
  console.error('❌ Server failed to start:', error);
  process.exit(1);
});

export default app;
