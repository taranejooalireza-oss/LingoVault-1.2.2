/**
 * DailyGoalTracker — پیگیری هدف روزانه
 * هدف روزانه برای چالنج رشد و تمرین واژگان
 */
class DailyGoalTracker {
  constructor(storage) {
    this.storage = storage;
    this.KEY = 'daily_goal_state';
  }

  async getState() {
    const data = await this.storage.get(this.KEY) || { completed: false, date: '' };
    return data;
  }

  async setCompleted(completed) {
    const today = new Date().toISOString().split('T')[0];
    await this.storage.set(this.KEY, { completed, date: today });
    return { completed, date: today };
  }

  async isCompletedToday() {
    const data = await this.getState();
    return data.completed && data.date === new Date().toISOString().split('T')[0];
  }
}

window.DailyGoalTracker = DailyGoalTracker;
