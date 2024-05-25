@"
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});
"@ | Out-File -FilePath background.js -Encoding utf8