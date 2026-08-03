/**
 * StreakTracker — مدیریت سری روزانه (استریک)
 * محاسبه می‌کند که کاربر امروز استریک دارد یا نه
 */
class StreakTracker {
  constructor(storage) {
    this.storage = storage;
    this.KEY = 'user_streak';
  }

  async getCurrentStreak() {
    const today = this._todayString();
    const data = await this.storage.get(this.KEY) || { lastDate: '', currentStreak: 0 };
    
    const yesterday = this._yesterdayString();
    
    if (data.lastDate === today) {
      return { streak: data.currentStreak, isActive: true };
    }
    
    if (data.lastDate === yesterday) {
      return { streak: data.currentStreak + 1, isActive: true };
    }
    
    // اولین روز یا استراحت
    return { streak: 0, isActive: false };
  }

  async updateStreak(isDone) {
    const today = this._todayString();
    const data = await this.storage.get(this.KEY) || { lastDate: '', currentStreak: 0 };
    
    if (isDone) {
      if (data.lastDate === this._yesterdayString()) {
        data.currentStreak += 1;
      } else {
        data.currentStreak = 1;
      }
      data.lastDate = today;
    } else {
      data.currentStreak = 0;
      data.lastDate = '';
    }
    
    await this.storage.set(this.KEY, data);
    return data;
  }

  _todayString() {
    const d = new Date();
    return `\( {d.getFullYear()}- \){String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }

  _yesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return `\( {d.getFullYear()}- \){String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  }
}

window.StreakTracker = StreakTracker;
