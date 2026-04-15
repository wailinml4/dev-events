import mongoose, { Connection, ConnectOptions } from 'mongoose';

/**
 * Global type declaration for cached MongoDB connection.
 * This prevents TypeScript errors when accessing the global object.
 */
declare global {
  var mongooseConnection: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

/**
 * Initialize the global object if it doesn't exist.
 * This is necessary for module-level caching.
 */
if (!global.mongooseConnection) {
  global.mongooseConnection = {
    conn: null,
    promise: null,
  };
}

/**
 * Establishes a MongoDB connection and caches it for reuse across imports and serverless invocations.
 *
 * Reuses an existing cached connection when available, or awaits a pending connection attempt; if neither
 * exists, creates a new connection and caches its promise and resulting `Connection`.
 *
 * @returns The established `Connection` to MongoDB
 * @throws Error if `MONGODB_URI` is not set or if the connection attempt fails
 */
async function connectDB(): Promise<Connection> {
  // Validate that the MongoDB URI is provided
  const mongodbUri = process.env.MONGODB_URI;

  if (!mongodbUri) {
    throw new Error(
      'MONGODB_URI environment variable is not defined. Please check your .env.local file.'
    );
  }

  // If connection already exists, return the cached connection
  if (global.mongooseConnection.conn) {
    console.log('Using cached MongoDB connection');
    return global.mongooseConnection.conn;
  }

  // If connection promise is already pending, wait for it
  if (global.mongooseConnection.promise) {
    console.log('Waiting for pending MongoDB connection...');
    global.mongooseConnection.conn = await global.mongooseConnection.promise;
    return global.mongooseConnection.conn;
  }

  // Create new connection promise if none exists
  global.mongooseConnection.promise = (async () => {
    try {
      const mongooseInstance = await mongoose.connect(mongodbUri, {
        bufferCommands: false,
        // Serverless-friendly timeouts
        socketTimeoutMS: 30000,
        connectTimeoutMS: 10000,
        serverSelectionTimeoutMS: 10000,
        // Prevent connection pool issues in serverless
        maxPoolSize: 5,
        minPoolSize: 1,
        maxIdleTimeMS: 30000,
      } as ConnectOptions);

      console.log('✓ Successfully connected to MongoDB');
      return mongooseInstance.connection;
    } catch (error) {
      // Clear the promise on failure to allow retry
      global.mongooseConnection.promise = null;
      console.error('✗ MongoDB connection failed:', error instanceof Error ? error.message : error);
      throw error;
    }
  })();

  // Store the connection for future reuse
  global.mongooseConnection.conn = await global.mongooseConnection.promise;
  return global.mongooseConnection.conn;
}

export default connectDB;