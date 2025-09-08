
import { config } from 'dotenv';
config();

import * as admin from 'firebase-admin';

// Explicitly initialize firebase-admin to prevent conflicts with the client SDK
if (admin.apps.length === 0) {
  admin.initializeApp();
}

import '@/ai/flows/intelligent-scheduling-assistant.ts';
