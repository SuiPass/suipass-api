import { Injectable, Scope } from '@nestjs/common';
import firebaseAdmin from 'firebase-admin';

@Injectable()
export class DatabaseClient {
  private firestore;
  get client() {
    if (!this.firestore) this.firestore = firebaseAdmin.firestore();

    return this.firestore;
  }
}
