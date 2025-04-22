export default async function handler(req, res) {
    // Only allow POST
    if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Only POST requests allowed' });
    }
  
    try {
      // Optionally verify a secret (useful for security)
      // if (req.headers['x-prismic-secret'] !== process.env.PRISMIC_SECRET) {
      //   return res.status(401).json({ message: 'Invalid secret' });
      // }
  
      // Revalidate specific paths or all
      await res.revalidate('/');
      await res.revalidate('/blog'); // Example route
  
      return res.status(200).json({ message: 'Revalidation triggered' });
    } catch (err) {
      return res.status(500).json({ message: 'Error revalidating', error: err });
    }
  }
  