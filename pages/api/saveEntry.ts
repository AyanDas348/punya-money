// pages/api/postData.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      // Connect to the database
      const client = await clientPromise;
      const db = client.db("punyaslok");

      // Handle the POST data (example: inserting data into the database)
      await db.collection("money").insertOne(req.body);

      // Respond with a success message
      res.status(200).json({ success: true });
    } catch (e) {
      console.error(e);

      // Respond with an error message
      res.status(500).json({ success: false, error: e.message });
    }
  } else {
    // Respond with an error for unsupported HTTP methods
    res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }
}
