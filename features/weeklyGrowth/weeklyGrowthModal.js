/**
 * Weekly Growth modal — opened from home when daily goal is done
 */
class WeeklyGrowthModal {
  constructor(options) {
    options = options || {};
    this.storage = options.storage;
    this.service = options.service || new WeeklyGrowthService(this.storage);
    this.root = null;
  }

  t(fa, en) {
    return this.service.t(fa, en);
  }

  esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  async open() {
    if (this.root) return;
    var pack = await this.service.getThisWeekChallenge();
    var c = pack && pack.challenge;
    this.root = document.createElement('div');
    this.root.className = 'wg-overlay';
    this.root.setAttribute('role', 'dialog');
    this.root.setAttribute('aria-modal', 'true');

    if (!c) {
      this.root.innerHTML =
        '<div class="wg-panel">' +
          '<button type="button" class="wg-close" aria-label="Close">×</button>' +
          '<p class="wg-empty">' + this.t('محتوایی در دسترس نیست.', 'No content available.') + '</p>' +
        '</div>';
    } else {
      var done = pack.completed;
      this.root.innerHTML =
        '<div class="wg-panel">' +
          '<div class="wg-header">' +
            '<div>' +
              '<div class="wg-kicker">' + this.t('چالش رشد هفتگی', 'Weekly Growth Challenge') + '</div>' +
              '<h2 class="wg-title">' + this.esc(this.t(c.title_fa, c.title_en)) + '</h2>' +
              '<div class="wg-meta">' + this.esc(c.growth_path) + ' · ' + this.esc(c.estimated_time || '3–5 min') + '</div>' +
            '</div>' +
            '<button type="button" class="wg-close" aria-label="' + this.t('بستن', 'Close') + '">×</button>' +
          '</div>' +
          '<div class="wg-body">' +
            '<div class="wg-label">' + this.t('اقدام امروز', 'Today’s action') + '</div>' +
            '<p class="wg-action">' + this.esc(this.t(c.action_fa, c.action_en)) + '</p>' +
            '<div class="wg-phrase-card">' +
              '<div class="wg-label">' + this.t('عبارت کاربردی', 'Useful phrase') + '</div>' +
              '<div class="wg-phrase" dir="ltr">' + this.esc(c.phrase_en) + '</div>' +
              '<div class="wg-phrase-fa">' + this.esc(c.phrase_fa) + '</div>' +
            '</div>' +
            (done
              ? '<p class="wg-done-note">' + this.t('این هفته انجام شد.', 'Completed for this week.') + '</p>'
              : '<button type="button" class="btn btn-primary wg-done-btn" id="wg-done">' +
                  this.t('انجام شد', 'Mark as done') +
                '</button>') +
          '</div>' +
        '</div>';
    }

    document.body.appendChild(this.root);
    requestAnimationFrame(function () {
      this.root.classList.add('is-open');
    }.bind(this));

    var self = this;
    this.root.querySelector('.wg-close').addEventListener('click', function () { self.close(); });
    this.root.addEventListener('click', function (e) {
      if (e.target === self.root) self.close();
    });
    var doneBtn = this.root.querySelector('#wg-done');
    if (doneBtn && c) {
      doneBtn.addEventListener('click', async function () {
        doneBtn.disabled = true;
        await self.service.markCompleted(c.id);
        doneBtn.textContent = self.t('ثبت شد', 'Saved');
        setTimeout(function () { self.close(); }, 600);
      });
    }
  }

  close() {
    if (!this.root) return;
    var node = this.root;
    this.root = null;
    node.classList.remove('is-open');
    setTimeout(function () {
      if (node.parentNode) node.parentNode.removeChild(node);
    }, 160);
  }
}

window.WeeklyGrowthModal = WeeklyGrowthModal;
