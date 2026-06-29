// Service worker — keeps the extension alive in MV3.
// No logic needed here; auth and API calls happen in the popup context.
chrome.runtime.onInstalled.addListener(() => {
  console.log('AmazonScout installed');
});
