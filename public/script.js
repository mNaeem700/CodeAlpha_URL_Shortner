// DOM Elements
const longUrlInput = document.getElementById('longUrl');
const customCodeInput = document.getElementById('customCode');
const shortenBtn = document.getElementById('shortenBtn');
const messageContainer = document.getElementById('messageContainer');
const resultSection = document.getElementById('resultSection');
const shortUrlInput = document.getElementById('shortUrlInput');
const longUrlResult = document.getElementById('longUrlInput');
const shortCodeResult = document.getElementById('shortCodeInput');
const clickCount = document.getElementById('clickCount');
const createdTime = document.getElementById('createdTime');
const copyBtn = document.getElementById('copyBtn');
const viewStatsBtn = document.getElementById('viewStatsBtn');
const newUrlBtn = document.getElementById('newUrlBtn');
const urlsList = document.getElementById('urlsList');
const refreshBtn = document.getElementById('refreshBtn');
const statsModal = document.getElementById('statsModal');
const statsContent = document.getElementById('statsContent');
const modalClose = document.querySelector('.modal-close');

let currentShortCode = '';

// Event Listeners
shortenBtn.addEventListener('click', handleShortenUrl);
longUrlInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') handleShortenUrl();
});
copyBtn.addEventListener('click', handleCopyUrl);
viewStatsBtn.addEventListener('click', handleViewStats);
newUrlBtn.addEventListener('click', handleNewUrl);
refreshBtn.addEventListener('click', loadRecentUrls);
modalClose.addEventListener('click', closeStatsModal);
statsModal.addEventListener('click', (e) => {
  if (e.target === statsModal) closeStatsModal();
});

// Handle shorten URL
async function handleShortenUrl() {
  const longUrl = longUrlInput.value.trim();
  const customCode = customCodeInput.value.trim();

  // Clear previous messages
  hideMessage();

  if (!longUrl) {
    showMessage('Please enter a URL', 'error');
    return;
  }

  // Disable button and show loading
  shortenBtn.disabled = true;
  shortenBtn.textContent = 'Shortening...';

  try {
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        longUrl,
        customCode: customCode || null
      })
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(data.error || 'Failed to shorten URL', 'error');
      return;
    }

    // Show success message and result
    currentShortCode = data.shortCode;
    displayResult(data);
    showMessage('URL shortened successfully!', 'success');

    // Reload recent URLs
    loadRecentUrls();

  } catch (error) {
    console.error('Error:', error);
    showMessage('An error occurred. Please try again.', 'error');
  } finally {
    shortenBtn.disabled = false;
    shortenBtn.textContent = 'Shorten URL';
  }
}

// Display shortened URL result
function displayResult(data) {
  resultSection.classList.remove('hidden');
  shortUrlInput.value = data.shortUrl;
  longUrlResult.value = data.longUrl;
  shortCodeResult.value = data.shortCode;
  clickCount.textContent = '0';
  createdTime.textContent = new Date(data.createdAt).toLocaleString();

  // Scroll to result
  resultSection.scrollIntoView({ behavior: 'smooth' });
}

// Handle copy to clipboard
async function handleCopyUrl() {
  const shortUrl = shortUrlInput.value;

  try {
    await navigator.clipboard.writeText(shortUrl);
    
    // Visual feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = '✓ Copied!';
    copyBtn.style.background = '#10b981';

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = '';
    }, 2000);
  } catch (error) {
    showMessage('Failed to copy URL', 'error');
  }
}

// Handle view stats
async function handleViewStats() {
  if (!currentShortCode) return;

  statsContent.innerHTML = '<p>Loading statistics...</p>';
  statsModal.classList.remove('hidden');

  try {
    const response = await fetch(`/api/stats/${currentShortCode}`);
    const data = await response.json();

    if (!response.ok) {
      statsContent.innerHTML = '<p>Failed to load statistics</p>';
      return;
    }

    const statsHtml = `
      <div>
        <span>Short Code:</span>
        <strong>${data.shortCode}</strong>
      </div>
      <div>
        <span>Original URL:</span>
        <strong style="word-break: break-all;">${data.longUrl}</strong>
      </div>
      <div>
        <span>Total Clicks:</span>
        <strong>${data.clicks}</strong>
      </div>
      <div>
        <span>Created:</span>
        <strong>${new Date(data.createdAt).toLocaleString()}</strong>
      </div>
    `;

    statsContent.innerHTML = statsHtml;
  } catch (error) {
    console.error('Error:', error);
    statsContent.innerHTML = '<p>Error loading statistics</p>';
  }
}

// Close stats modal
function closeStatsModal() {
  statsModal.classList.add('hidden');
}

// Handle create new URL
function handleNewUrl() {
  resultSection.classList.add('hidden');
  longUrlInput.value = '';
  customCodeInput.value = '';
  messageContainer.className = '';
  longUrlInput.focus();
}

// Show message
function showMessage(message, type) {
  messageContainer.textContent = message;
  messageContainer.className = type;
}

// Hide message
function hideMessage() {
  messageContainer.textContent = '';
  messageContainer.className = '';
}

// Load recent URLs
async function loadRecentUrls() {
  try {
    const response = await fetch('/api/urls');
    const data = await response.json();

    if (!data.success || !data.data || data.data.length === 0) {
      urlsList.innerHTML = '<p class="loading">No URLs shortened yet</p>';
      return;
    }

    urlsList.innerHTML = data.data.map(url => `
      <div class="url-item">
        <div class="url-code">${url.shortCode}</div>
        <div class="url-preview" title="${url.longUrl}">${url.longUrl}</div>
        <div class="url-clicks">${url.clicks}</div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Error loading recent URLs:', error);
    urlsList.innerHTML = '<p class="loading">Failed to load recent URLs</p>';
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  loadRecentUrls();
});

// Auto-refresh recent URLs every 10 seconds
setInterval(loadRecentUrls, 10000);
