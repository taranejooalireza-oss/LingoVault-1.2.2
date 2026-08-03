// background.js — سرویس worker LingoVault 1
// اینجا همه الگوریتم Leitner، آمار، streak و آپدیت هفتگی اجرا می‌شه

chrome.runtime.onInstalled.addListener(() => {
  console.log("LingoVault 1.2.2 installed");
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyGrowth") {
    chrome.storage.local.get(["dailyGoalDone"], (result) => {
      if (result.dailyGoalDone) {
        chrome.notifications.create("weeklyGrowth", {
          type: "basic",
          iconUrl: chrome.runtime.getURL("assets/icons/icon128.png"),
          title: "🌱 چالنج رشد هفتگی",
          message: "امروز فقط ۵ دقیقه وقت گذاشتید. چالنج رشد هفته رو ببینید!",
          buttons: [{ title: "بزن بریم" }]
        });
      }
    });
  }
});

// باز کردن side panel
chrome.action.onClicked.addListener(() => {
  chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
});
