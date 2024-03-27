import { Injectable } from '@nestjs/common';
import firebaseAdmin from 'firebase-admin';

@Injectable()
export class DatabaseClient {
  private firestore: firebaseAdmin.firestore.Firestore;
  get client(): firebaseAdmin.firestore.Firestore {
    if (!this.firestore) {
      this.firestore = firebaseAdmin.firestore();
      this.firestore.settings({ ignoreUndefinedProperties: true });
    }

    return this.firestore;
  }
}
