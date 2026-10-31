chrome.action.onClicked.addListener((tab) => {
  chrome.scripting
    .executeScript({ target: { tabId: tab.id }, files: ["convert.js", "content.js"] })
    .catch((e) => console.error("Wstrzyknięcie skryptów nie powiodło się:", e));
});
