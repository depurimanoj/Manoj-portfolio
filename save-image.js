export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password, path, contentBase64, message } = req.body || {};

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password' });
  }
  if (!path || !contentBase64) {
    return res.status(400).json({ error: 'Missing path or file content' });
  }
  // Basic safety: only allow writes inside the assets folder
  if (!path.startsWith('assets/')) {
    return res.status(400).json({ error: 'Path must be inside assets/' });
  }

  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    return res.status(500).json({ error: 'Server is missing GITHUB_OWNER, GITHUB_REPO, or GITHUB_TOKEN configuration' });
  }

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    'User-Agent': 'portfolio-admin-panel',
    'Content-Type': 'application/json',
    Accept: 'application/vnd.github+json',
  };

  try {
    // Look up existing file sha (required by GitHub API to update a file that already exists)
    let sha;
    const getResp = await fetch(`${apiUrl}?ref=${branch}`, { headers });
    if (getResp.ok) {
      const data = await getResp.json();
      sha = data.sha;
    }

    const putResp = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: message || `Update ${path} via admin panel`,
        content: contentBase64,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!putResp.ok) {
      const errText = await putResp.text();
      return res.status(502).json({ error: `GitHub API error: ${errText}` });
    }

    const result = await putResp.json();
    return res.status(200).json({ ok: true, commit: result.commit?.sha, path });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Unknown server error' });
  }
}
