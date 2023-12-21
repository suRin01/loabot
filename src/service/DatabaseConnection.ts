import { PrismaClient } from '@prisma/client';


export class DatabaseConnection {
    private static prismaClient: PrismaClient
    private constructor() {
      // Private constructor to prevent direct instantiation
    }
  
    public static getInstance(): PrismaClient {
      if (!DatabaseConnection.prismaClient) {
        DatabaseConnection.prismaClient = new PrismaClient();
        // Perform database connection setup here
      }
      return DatabaseConnection.prismaClient;
    }
  }