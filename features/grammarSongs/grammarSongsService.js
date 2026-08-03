/**
 * GrammarSongsService — مدیریت آهنگ‌های گرامر
 */
class GrammarSongsService {
  constructor() {
    this._songs = null;
    this._cache = new Map();
  }

  async getSongsForGrammar(grammerPoint) {
    if (this._songs) return this._songs;

    try {
      const response = await fetch(chrome.runtime.getURL('features/grammarSongs/grammarSongsData.json'));
      const data = await response.json();
      this._songs = data.entries || [];
      return this._songs;
    } catch (e) {
      return [];
    }
  }

  openExternal(url) {
    chrome.tabs.create({ url });
  }

  track(event, data) {
    console.log(`[LingoVault] Track: ${event}`, data);
  }
}

window.GrammarSongsService = GrammarSongsService;
