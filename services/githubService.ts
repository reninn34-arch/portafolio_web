// GitHub API service for portfolio data sync
const GITHUB_OWNER = 'reninn34-arch';
const GITHUB_REPO = 'portafolio_web';
const FILE_PATH = 'portfolio-data.json';

export interface PortfolioData {
  experiences: any[];
  education: any[];
  skills: any[];
  logos: any[];
  socials: any;
  heroContent: any;
}

export const fetchPortfolioDataFromGitHub = async (): Promise<PortfolioData | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`
    );
    if (!response.ok) return null;

    const data = await response.json();
    const content = atob(data.content);
    return JSON.parse(content);
  } catch (e) {
    console.error('Error fetching from GitHub:', e);
    return null;
  }
};

export const savePortfolioDataToGitHub = async (
  data: PortfolioData,
  token: string,
  message: string
): Promise<boolean> => {
  try {
    // Get current file SHA
    const getResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    let sha = '';
    if (getResponse.ok) {
      const fileData = await getResponse.json();
      sha = fileData.sha;
    }

    // Update file
    const content = btoa(JSON.stringify(data, null, 2));
    const updateResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message,
          content,
          sha: sha || undefined,
          branch: 'main'
        })
      }
    );

    return updateResponse.ok;
  } catch (e) {
    console.error('Error saving to GitHub:', e);
    return false;
  }
};
