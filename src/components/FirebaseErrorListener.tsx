"use client";

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * A global listener component that catches Firestore permission errors
 * and surfaces them to the development overlay.
 */
export function FirebaseErrorListener() {
  useEffect(() => {
    const unsubscribe = errorEmitter.on('permission-error', (error: FirestorePermissionError) => {
      // In development, we want to throw the error to trigger the Next.js overlay
      // with the contextual information provided in the error object.
      if (process.env.NODE_ENV === 'development') {
        // We wrap it in a timeout to ensure it's thrown as an uncaught exception
        setTimeout(() => {
          throw error;
        }, 0);
      } else {
        console.error('Clinical Portal Security Alert:', error.message, error.context);
      }
    });

    return () => unsubscribe();
  }, []);

  return null;
}
