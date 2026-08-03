/**
 * Weekly Growth — isolated module. Unlocks when daily goal is complete.
 */
class WeeklyGrowthService {
  constructor(storage) {
    this.storage = storage;
    this.KEY = 'weekly_growth_state';
    this._data = null;
  }

  t(fa, en) {
    try {
      if (typeof I18n !== 'undefined' && I18n.getLanguage && I18n.getLanguage() === 'en') return en;
    } catch (e) {}
    return fa;
  }

  async loadData() {
    if (this._data) return this._data;
    try {
      var url = chrome.runtime.getURL('src/features/weeklyGrowth/weeklyGrowthData.json');
      var res = await fetch(url);
      this._data = await res.json();
    } catch (e) {
      this._data = { challenges: [] };
    }
    return this._data;
  }

  _weekId() {
    var d = new Date();
    var day = d.getDay();
    var diff = (day + 6) % 7;
    var mon = new Date(d);
    mon.setHours(0, 0, 0, 0);
    mon.setDate(d.getDate() - diff);
    return mon.toISOString().slice(0, 10);
  }

  async getState() {
    try {
      var st = await this.storage.get(this.KEY);
      return st && typeof st === 'object' ? st : {};
    } catch (e) {
      return {};
    }
  }

  async setState(patch) {
    var cur = await this.getState();
    var next = Object.assign({}, cur, patch);
    await this.storage.set(this.KEY, next);
    return next;
  }

  async getThisWeekChallenge() {
    var data = await this.loadData();
    var list = (data && data.challenges) || [];
    if (!list.length) return null;
    var week = this._weekId();
    var idx = 0;
    for (var i = 0; i < week.length; i++) idx = (idx + week.charCodeAt(i) * (i + 1)) % list.length;
    var item = list[idx];
    var st = await this.getState();
    return {
      challenge: item,
      weekId: week,
      completed: !!(st.completedWeek === week && st.completedId === item.id)
    };
  }

  async markCompleted(challengeId) {
    return this.setState({
      completedWeek: this._weekId(),
      completedId: challengeId,
      completedAt: new Date().toISOString()
    });
  }
}

window.WeeklyGrowthService = WeeklyGrowthService;
