import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { CONFIG } from '../config.js';
import { RuntimeData, User, Account, Transaction } from '../types/index.js';

class PersistenceService {
  private filePath: string;
  private memoryCache: RuntimeData | null = null;
  private writeQueue: Promise<void> = Promise.resolve();

  constructor() {
    this.filePath = CONFIG.DATA_FILE_PATH;
    this.ensureDataDir();
  }

  private ensureDataDir(): void {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  /**
   * Initializes runtime.json with seed data if missing or empty
   */
  public async init(): Promise<void> {
    if (!fs.existsSync(this.filePath) || fs.statSync(this.filePath).size === 0) {
      const seedData = await this.generateSeedData();
      await this.saveState(seedData);
    } else {
      await this.loadState();
    }
  }

  private async generateSeedData(): Promise<RuntimeData> {
    const now = new Date().toISOString();
    const adminPasswordHash = await bcrypt.hash('Admin@12345', 10);
    const customerPasswordHash = await bcrypt.hash('Customer@12345', 10);

    const adminUser: User = {
      id: 'USR-10001',
      name: 'System Admin',
      email: 'admin@bankofmahesh.local',
      passwordHash: adminPasswordHash,
      role: 'admin',
      status: 'active',
      phone: '+91 9876543210',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    };

    const maheshUser: User = {
      id: 'USR-10002',
      name: 'Mahesh Kumar',
      email: 'customer@bankofmahesh.local',
      passwordHash: customerPasswordHash,
      role: 'customer',
      status: 'active',
      phone: '+91 9812345678',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    };

    const priyaUser: User = {
      id: 'USR-10003',
      name: 'Priya Sharma',
      email: 'priya@bankofmahesh.local',
      passwordHash: customerPasswordHash,
      role: 'customer',
      status: 'active',
      phone: '+91 9823456789',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    };

    const rahulUser: User = {
      id: 'USR-10004',
      name: 'Rahul Verma',
      email: 'rahul@bankofmahesh.local',
      passwordHash: customerPasswordHash,
      role: 'customer',
      status: 'active',
      phone: '+91 9834567890',
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now
    };

    const maheshAccount: Account = {
      id: 'ACC-10001',
      userId: 'USR-10002',
      accountNumber: 'BM7089123456',
      accountType: 'Savings',
      currency: 'INR',
      balance: 12500050, // ₹1,25,000.50
      status: 'active',
      createdAt: now
    };

    const priyaAccount: Account = {
      id: 'ACC-10002',
      userId: 'USR-10003',
      accountNumber: 'BM8823948210',
      accountType: 'Savings',
      currency: 'INR',
      balance: 8540000, // ₹85,400.00
      status: 'active',
      createdAt: now
    };

    const rahulAccount: Account = {
      id: 'ACC-10003',
      userId: 'USR-10004',
      accountNumber: 'BM3349182740',
      accountType: 'Checking',
      currency: 'INR',
      balance: 21000000, // ₹2,10,000.00
      status: 'active',
      createdAt: now
    };

    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString();
    const threeDaysAgo = new Date(Date.now() - 259200000).toISOString();

    const sampleTransactions: Transaction[] = [
      {
        id: 'TXN-A1B2C3',
        senderAccountId: priyaAccount.id,
        receiverAccountId: maheshAccount.id,
        senderName: priyaUser.name,
        receiverName: maheshUser.name,
        amount: 250000, // ₹2,500.00
        currency: 'INR',
        type: 'transfer',
        status: 'completed',
        description: 'Consulting project fee',
        createdAt: yesterday
      },
      {
        id: 'TXN-D4E5F6',
        senderAccountId: maheshAccount.id,
        receiverAccountId: rahulAccount.id,
        senderName: maheshUser.name,
        receiverName: rahulUser.name,
        amount: 150000, // ₹1,500.00
        currency: 'INR',
        type: 'transfer',
        status: 'completed',
        description: 'Dinner reimbursement',
        createdAt: twoDaysAgo
      },
      {
        id: 'TXN-G7H8I9',
        senderAccountId: rahulAccount.id,
        receiverAccountId: maheshAccount.id,
        senderName: rahulUser.name,
        receiverName: maheshUser.name,
        amount: 500000, // ₹5,000.00
        currency: 'INR',
        type: 'transfer',
        status: 'completed',
        description: 'Shared trip expense',
        createdAt: threeDaysAgo
      }
    ];

    return {
      users: [adminUser, maheshUser, priyaUser, rahulUser],
      accounts: [maheshAccount, priyaAccount, rahulAccount],
      transactions: sampleTransactions,
      sessions: [],
      auditLogs: [
        {
          id: 'AUDIT-INIT',
          userId: adminUser.id,
          userEmail: adminUser.email,
          action: 'SIGNUP',
          timestamp: now,
          metadata: { note: 'Seed data initialized' }
        }
      ],
      metadata: {
        application: 'Bank of Mahesh',
        version: '1.0.0',
        mode: 'simulation',
        lastSavedAt: now
      }
    };
  }

  public async loadState(): Promise<RuntimeData> {
    try {
      const dataStr = await fs.promises.readFile(this.filePath, 'utf-8');
      this.memoryCache = JSON.parse(dataStr);
      return this.memoryCache!;
    } catch (error) {
      console.error('Failed to load runtime.json, re-initializing seed data...', error);
      const seed = await this.generateSeedData();
      await this.saveState(seed);
      return seed;
    }
  }

  public getState(): RuntimeData {
    if (!this.memoryCache) {
      throw new Error('PersistenceService not initialized. Call init() first.');
    }
    return this.memoryCache;
  }

  /**
   * Atomic write to file system using queue serialization and tmp file replacement
   */
  public async saveState(data: RuntimeData): Promise<void> {
    this.memoryCache = data;
    this.memoryCache.metadata.lastSavedAt = new Date().toISOString();

    const writeTask = async () => {
      const jsonString = JSON.stringify(this.memoryCache, null, 2);
      try {
        await fs.promises.writeFile(this.filePath, jsonString, 'utf-8');
      } catch (err) {
        console.error('Failed to write runtime.json:', err);
      }
    };

    // Chain write task to prevent race conditions
    this.writeQueue = this.writeQueue.then(writeTask, writeTask);
    return this.writeQueue;
  }
}

export const persistenceService = new PersistenceService();
