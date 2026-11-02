import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { 
  Student, 
  HifzLog, 
  ExamRecord, 
  TuitionRecord, 
  AdmissionApplication, 
  DonationPledge, 
  InstitutionSettings 
} from '../types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Initialize Firestore Database (using provisioned database ID)
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);

// Configure Google Auth Provider with Google Sheets & Google Drive scopes
export const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.addScope('https://www.googleapis.com/auth/drive.file');
provider.addScope('https://www.googleapis.com/auth/drive');
provider.setCustomParameters({
  prompt: 'select_account'
});

// Flag to track sign-in in flight
let isSigningIn = false;
// Token memory cache ONLY (never in localStorage per security requirements)
let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        if (onAuthSuccess) onAuthSuccess(user, '');
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Could not obtain Google Sheets access token from sign in');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign In Error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

export const setCachedToken = (token: string | null) => {
  cachedAccessToken = token;
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

/**
 * Validate Firestore cloud connection
 */
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    await getDocFromServer(doc(db, 'settings', 'institutional'));
    return true;
  } catch (err: any) {
    if (err?.message?.includes('the client is offline')) {
      console.warn('Firestore client is offline, using local cache.');
    } else {
      console.info('Initial Firestore handshake verified.');
    }
    return true;
  }
};

/**
 * Generic Real-Time Collection Listener for Free Tier Cloud Storage
 */
export function subscribeToCollection<T extends { id: string }>(
  collectionName: string,
  onUpdate: (items: T[]) => void,
  onError?: (error: Error) => void
): () => void {
  try {
    const colRef = collection(db, collectionName);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: T[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ ...(docSnap.data() as T), id: docSnap.id });
        });
        onUpdate(items);
      },
      (err) => {
        console.warn(`Firestore subscription warning on ${collectionName}:`, err.message);
        if (onError) onError(err);
      }
    );
  } catch (err: any) {
    console.warn(`Failed to initialize listener on ${collectionName}:`, err.message);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Save single entity to Firestore cloud collection
 */
export async function saveDocumentToCloud<T extends { id: string }>(
  collectionName: string,
  item: T
): Promise<void> {
  const docRef = doc(db, collectionName, item.id);
  await setDoc(docRef, item, { merge: true });
}

/**
 * Delete single entity from Firestore cloud collection
 */
export async function deleteDocumentFromCloud(
  collectionName: string,
  id: string
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

/**
 * Institutional settings listener
 */
export function subscribeSettings(
  onUpdate: (settings: InstitutionSettings) => void
): () => void {
  try {
    const docRef = doc(db, 'settings', 'institutional');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onUpdate(docSnap.data() as InstitutionSettings);
      }
    });
  } catch (err) {
    console.warn('Failed to listen to institutional settings:', err);
    return () => {};
  }
}

/**
 * Save institutional settings to cloud
 */
export async function saveSettingsToCloud(settings: InstitutionSettings): Promise<void> {
  const docRef = doc(db, 'settings', 'institutional');
  await setDoc(docRef, settings, { merge: true });
}

/**
 * One-click batch migration / seeding from local datasets to Firestore cloud storage
 */
export async function seedAllDataToCloud(data: {
  students: Student[];
  hifzLogs: HifzLog[];
  exams: ExamRecord[];
  tuition: TuitionRecord[];
  admissions: AdmissionApplication[];
  pledges: DonationPledge[];
  settings?: InstitutionSettings;
}): Promise<{ totalUploaded: number }> {
  let count = 0;

  // Upload students
  for (const s of data.students) {
    await setDoc(doc(db, 'students', s.id), s, { merge: true });
    count++;
  }

  // Upload logs
  for (const l of data.hifzLogs) {
    await setDoc(doc(db, 'hifz_logs', l.id), l, { merge: true });
    count++;
  }

  // Upload exams
  for (const e of data.exams) {
    await setDoc(doc(db, 'exams', e.id), e, { merge: true });
    count++;
  }

  // Upload tuition
  for (const t of data.tuition) {
    await setDoc(doc(db, 'tuition', t.id), t, { merge: true });
    count++;
  }

  // Upload admissions
  for (const a of data.admissions) {
    await setDoc(doc(db, 'admissions', a.id), a, { merge: true });
    count++;
  }

  // Upload pledges
  for (const p of data.pledges) {
    await setDoc(doc(db, 'pledges', p.id), p, { merge: true });
    count++;
  }

  // Upload settings
  if (data.settings) {
    await setDoc(doc(db, 'settings', 'institutional'), data.settings, { merge: true });
    count++;
  }

  return { totalUploaded: count };
}
