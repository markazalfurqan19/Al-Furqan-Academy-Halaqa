/**
 * Google Drive API Client for Markazul Furqan Academic Ledger
 * Handles uploading transcripts, certificates, CSV ledgers, and backups directly to user's Google Drive.
 */

export interface DriveUploadResult {
  id: string;
  name: string;
  webViewLink: string;
  mimeType: string;
}

const DEFAULT_FOLDER_NAME = 'Markazul Furqan Academic Archives';

/**
 * Searches for or creates a dedicated root folder in user's Google Drive
 */
export async function getOrCreateAcademyFolder(
  accessToken: string,
  folderName: string = DEFAULT_FOLDER_NAME
): Promise<string> {
  // Check if folder already exists
  const query = encodeURIComponent(`name = '${folderName}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false`);
  const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)`, {
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (searchRes.ok) {
    const data = await searchRes.json();
    if (data.files && data.files.length > 0) {
      return data.files[0].id;
    }
  }

  // Create folder if not found
  const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: folderName,
      mimeType: 'application/vnd.google-apps.folder'
    })
  });

  if (!createRes.ok) {
    throw new Error(`Failed to create Google Drive folder: ${createRes.statusText}`);
  }

  const folderData = await createRes.json();
  return folderData.id;
}

/**
 * Uploads any text or CSV content to Google Drive inside the academy folder
 */
export async function uploadTextFileToDrive(params: {
  accessToken: string;
  filename: string;
  content: string;
  mimeType?: string;
}): Promise<DriveUploadResult> {
  const { accessToken, filename, content, mimeType = 'text/csv' } = params;
  const folderId = await getOrCreateAcademyFolder(accessToken);

  const metadata = {
    name: filename,
    parents: [folderId],
    mimeType
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  const multipartRequestBody =
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${mimeType}\r\n\r\n` +
    content +
    closeDelimiter;

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,mimeType',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartRequestBody
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Google Drive upload failed (${response.status})`);
  }

  return await response.json();
}

/**
 * Uploads a binary Blob (e.g. PDF or Image) to Google Drive
 */
export async function uploadBlobToDrive(params: {
  accessToken: string;
  filename: string;
  blob: Blob;
}): Promise<DriveUploadResult> {
  const { accessToken, filename, blob } = params;
  const folderId = await getOrCreateAcademyFolder(accessToken);

  const metadata = {
    name: filename,
    parents: [folderId],
    mimeType: blob.type || 'application/pdf'
  };

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Convert blob to array buffer
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Build binary multipart
  const textEncoder = new TextEncoder();
  const preBytes = textEncoder.encode(
    delimiter +
    'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
    JSON.stringify(metadata) +
    delimiter +
    `Content-Type: ${blob.type || 'application/pdf'}\r\n\r\n`
  );
  const postBytes = textEncoder.encode(closeDelimiter);

  const combined = new Uint8Array(preBytes.length + bytes.length + postBytes.length);
  combined.set(preBytes, 0);
  combined.set(bytes, preBytes.length);
  combined.set(postBytes, preBytes.length + bytes.length);

  const response = await fetch(
    'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink,mimeType',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: combined
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `Google Drive binary upload failed (${response.status})`);
  }

  return await response.json();
}

/**
 * Lists the most recent academic documents uploaded to the user's Markazul Furqan Google Drive folder
 */
export async function listRecentAcademyDriveFiles(accessToken: string): Promise<DriveUploadResult[]> {
  try {
    const folderId = await getOrCreateAcademyFolder(accessToken);
    const query = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
    const res = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=createdTime desc&pageSize=15&fields=files(id,name,webViewLink,mimeType)`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    if (!res.ok) return [];
    const data = await res.json();
    return data.files || [];
  } catch (err) {
    console.warn('Could not list drive files:', err);
    return [];
  }
}
