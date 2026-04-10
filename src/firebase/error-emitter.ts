/**
 * @fileOverview A centralized emitter for Firestore permission errors.
 */
import { FirestorePermissionError } from './errors';

type ErrorListener = (error: FirestorePermissionError) => void;

class ErrorEmitter {
  private listeners: ErrorListener[] = [];

  /**
   * Register a listener for permission errors.
   */
  on(channel: 'permission-error', listener: ErrorListener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  /**
   * Emit a new permission error.
   */
  emit(channel: 'permission-error', error: FirestorePermissionError) {
    this.listeners.forEach(l => l(error));
  }
}

export const errorEmitter = new ErrorEmitter();
