// This is the corrected and more robust serverless function.
// It uses the 'formidable' library for reliable file parsing in a serverless environment.

import { put } from '@vercel/blob';
import formidable from 'formidable';
import fs from 'fs'; // Import the Node.js file system module

export const config = {
  api: {
    bodyParser: false, // We need to disable the default parser to handle file streams
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Use formidable to parse the form data
    const form = formidable({});
    const [fields, files] = await form.parse(req);

    // Check specifically if the 'file' field is missing or empty
    if (!files.file || !files.file[0]) {
      return res.status(400).json({ error: 'File is required but was not found.' });
    }

    const file = files.file[0];
    const fileName = file.originalFilename || 'unnamed-file';
    const filePath = file.filepath; // formidable uses 'filepath' instead of 'path'

    // Read the file from its temporary path on the server
    const fileBuffer = fs.readFileSync(filePath);

    // Upload the file buffer to Vercel Blob
    const blob = await put(fileName, fileBuffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    // Return the public URL of the successfully uploaded file
    return res.status(200).json({ url: blob.url });

  } catch (error) {
    console.error('Upload Process Error:', error);
    // Provide a more specific error message to the frontend
    return res.status(500).json({ error: `Failed to process upload: ${error.message}` });
  }
}
