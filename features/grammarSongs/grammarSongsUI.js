/**
 * Grammar Through Songs — UI block for GrammarLearnScreen (card back only)
 * Hidden entirely when no curated songs match.
 */
var GrammarSongsUI = {
  _svc: null,

  service: function () {
    if (!this._svc) this._svc = new GrammarSongsService();
    return this._svc;
  },

  esc: function (s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  t: function (fa, en) {
    try {
      if (typeof I18n !== 'undefined' && I18n.getLanguage && I18n.getLanguage() === 'en') return en;
    } catch (e) {}
    return fa;
  },

  renderAsync: async function (point) {
    if (typeof GrammarSongsService === 'undefined') return '';
    var svc = this.service();
    var songs = await svc.getSongsForGrammar(point);
    if (!songs || !songs.length) return '';

    var self = this;
    var songCards = songs.map(function (song, idx) {
      var patterns = (song.patterns || []).map(function (p) {
        return '<span class="gs-pattern">' + self.esc(p) + '</span>';
      }).join('');
      var examples = (song.examples || []).map(function (ex) {
        return '<li>' + self.esc(ex) + '</li>';
      }).join('');

      return (
        '<article class="gs-song-card" data-gs-id="' + self.esc(song.id) + '">' +
          '<div class="gs-song-head">' +
            '<div class="gs-song-title">' + self.esc(song.title) + '</div>' +
            '<div class="gs-song-artist">' + self.esc(song.artist || '') +
              (song.level ? ' · ' + self.esc(song.level) : '') +
            '</div>' +
          '</div>' +
          '<div class="gs-focus">' +
            '<span class="gs-label">' + self.t('تمرکز گرامر', 'Grammar focus') + '</span>' +
            '<div>' + self.esc(self.t(song.grammarFocusFa || song.grammarFocus, song.grammarFocus)) + '</div>' +
          '</div>' +
          '<div class="gs-why">' +
            '<span class="gs-label">' + self.t('چرا این آهنگ؟', 'Why this song?') + '</span>' +
            '<p>' + self.esc(self.t(song.whyHelpsFa || song.whyHelps, song.whyHelps)) + '</p>' +
          '</div>' +
          (patterns
            ? '<div class="gs-patterns">' + patterns + '</div>'
            : '') +
          (examples
            ? '<ul class="gs-examples">' + examples + '</ul>'
            : '') +
          '<div class="gs-actions">' +
            '<button type="button" class="btn btn-primary btn-sm gs-btn-yt" data-yt="' + self.esc(song.youtubeUrl || '') + '" data-sid="' + self.esc(song.id) + '" data-stop-flip="1">' +
              self.t('▶ پخش در یوتیوب', '▶ Play on YouTube') +
            '</button>' +
            (song.pdfUrl
              ? ('<button type="button" class="btn btn-outline btn-sm gs-btn-pdf" data-pdf="' + self.esc(song.pdfUrl) + '" data-sid="' + self.esc(song.id) + '" data-stop-flip="1">' +
                  self.t('📄 تمرین PDF', '📄 Worksheet PDF') +
                '</button>')
              : '') +
            '<button type="button" class="btn btn-outline btn-sm gs-btn-esl" data-esl="' + self.esc(song.eslSongsUrl || '') + '" data-sid="' + self.esc(song.id) + '" data-stop-flip="1">' +
              self.t('درس ESLSongs', 'ESLSongs lesson') +
            '</button>' +
            ((song.quiz && song.quiz.length)
              ? ('<button type="button" class="btn btn-outline btn-sm gs-btn-quiz" data-sid="' + self.esc(song.id) + '" data-stop-flip="1">' +
                  self.t('📝 آزمون کوتاه', '📝 Quick quiz') +
                '</button>')
              : '') +
          '</div>' +
          '<div class="gs-quiz-mount" data-sid="' + self.esc(song.id) + '" hidden></div>' +
        '</article>'
      );
    }).join('');

    return (
      '<section class="gs-block" data-stop-flip="1">' +
        '<div class="gs-header">' +
          '<span class="gs-icon" aria-hidden="true">♪</span>' +
          '<div>' +
            '<h4 class="gs-title">' + self.t('یادگیری گرامر با آهنگ', 'Learn Grammar Through Songs') + '</h4>' +
            '<p class="gs-sub">' + self.t(
              'پیشنهاد آموزشی بر اساس ESLSongs — پخش از یوتیوب',
              'Educational picks inspired by ESLSongs — play on YouTube'
            ) + '</p>' +
          '</div>' +
        '</div>' +
        songCards +
        '<p class="gs-disclaimer">' + self.t(
          'متن و تمرین از منابع آموزشی؛ پخش آهنگ در یوتیوب انجام می‌شود. LingoVault مالک آهنگ‌ها نیست.',
          'Lesson context is educational; audio plays on YouTube. LingoVault does not own these songs.'
        ) + '</p>' +
      '</section>'
    );
  },

  bind: function (container, point) {
    if (!container) return;
    var svc = this.service();
    var title = (point && (point.titleEn || point.title)) || '';
    container.querySelectorAll('.gs-btn-yt').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var url = btn.getAttribute('data-yt');
        svc.track('play_clicked', { songId: btn.getAttribute('data-sid'), grammar: title });
        svc.openExternal(url);
      });
    });
    container.querySelectorAll('.gs-btn-esl').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var url = btn.getAttribute('data-esl');
        svc.track('lesson_opened', { songId: btn.getAttribute('data-sid'), grammar: title });
        svc.openExternal(url);
      });
    });
    container.querySelectorAll('.gs-btn-pdf').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var url = btn.getAttribute('data-pdf');
        svc.track('pdf_opened', { songId: btn.getAttribute('data-sid'), grammar: title });
        svc.openExternal(url);
      });
    });
    if (container.querySelector('.gs-block')) {
      svc.track('recommendation_opened', { grammar: title });
    }

    container.querySelectorAll('.gs-btn-quiz').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var sid = btn.getAttribute('data-sid');
        var mount = container.querySelector('.gs-quiz-mount[data-sid="' + sid + '"]');
        if (!mount) return;
        svc.track('quiz_opened', { songId: sid, grammar: title });
        GrammarSongsUI.openQuiz(mount, sid, point);
      });
    });
  },

  _quizCache: {},

  openQuiz: async function (mount, songId, point) {
    if (!mount) return;
    var self = this;
    var svc = this.service();
    var songs = await svc.getSongsForGrammar(point);
    var song = null;
    for (var i = 0; i < songs.length; i++) {
      if (songs[i].id === songId) { song = songs[i]; break; }
    }
    if (!song || !song.quiz || !song.quiz.length) {
      mount.hidden = true;
      mount.innerHTML = '';
      return;
    }

    var state = { idx: 0, score: 0, answered: false };
    var questions = song.quiz;

    function renderQ() {
      var q = questions[state.idx];
      if (!q) {
        var total = questions.length;
        mount.innerHTML =
          '<div class="gs-quiz">' +
            '<div class="gs-quiz-result">' +
              '<div class="gs-quiz-score">' + state.score + ' / ' + total + '</div>' +
              '<p>' + self.t(
                state.score === total ? 'عالی! الگوها را خوب گرفتی.' :
                state.score >= total * 0.6 ? 'خوب بود. یک‌بار دیگر الگوها را مرور کن.' :
                'اشکالی ندارد — دوباره گوش بده و الگوها را ببین.',
                state.score === total ? 'Perfect! You nailed the patterns.' :
                state.score >= total * 0.6 ? 'Good. Review the patterns once more.' :
                'No problem — listen again and check the patterns.'
              ) + '</p>' +
              '<button type="button" class="btn btn-primary btn-sm gs-quiz-retry" data-stop-flip="1">' +
                self.t('از نو', 'Try again') +
              '</button>' +
              '<button type="button" class="btn btn-ghost btn-sm gs-quiz-close" data-stop-flip="1">' +
                self.t('بستن', 'Close') +
              '</button>' +
            '</div>' +
          '</div>';
        mount.querySelector('.gs-quiz-retry').onclick = function (e) {
          e.stopPropagation();
          state.idx = 0; state.score = 0; state.answered = false;
          renderQ();
        };
        mount.querySelector('.gs-quiz-close').onclick = function (e) {
          e.stopPropagation();
          mount.hidden = true;
          mount.innerHTML = '';
        };
        svc.track('quiz_completed', { songId: songId, score: state.score, total: total });
        return;
      }

      var opts = (q.options || []).map(function (opt, oi) {
        return '<button type="button" class="gs-quiz-opt" data-opt="' + self.esc(opt) + '" data-stop-flip="1">' +
          self.esc(opt) + '</button>';
      }).join('');

      mount.hidden = false;
      mount.innerHTML =
        '<div class="gs-quiz" data-stop-flip="1">' +
          '<div class="gs-quiz-progress">' + self.t('سوال', 'Question') + ' ' + (state.idx + 1) + ' / ' + questions.length + '</div>' +
          '<div class="gs-quiz-prompt">' + self.esc(self.t(q.promptFa || q.promptEn, q.promptEn)) + '</div>' +
          '<div class="gs-quiz-opts">' + opts + '</div>' +
          '<div class="gs-quiz-feedback" hidden></div>' +
        '</div>';

      mount.querySelectorAll('.gs-quiz-opt').forEach(function (ob) {
        ob.addEventListener('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
          if (state.answered) return;
          state.answered = true;
          var chosen = ob.getAttribute('data-opt');
          var ok = chosen === q.answer;
          if (ok) state.score += 1;
          ob.classList.add(ok ? 'is-correct' : 'is-wrong');
          mount.querySelectorAll('.gs-quiz-opt').forEach(function (x) {
            x.disabled = true;
            if (x.getAttribute('data-opt') === q.answer) x.classList.add('is-correct');
          });
          var fb = mount.querySelector('.gs-quiz-feedback');
          fb.hidden = false;
          fb.className = 'gs-quiz-feedback ' + (ok ? 'ok' : 'bad');
          fb.innerHTML = ok
            ? self.t('درست ✓', 'Correct ✓')
            : (self.t('جواب: ', 'Answer: ') + self.esc(q.answer) +
               (q.hintFa || q.hintEn ? '<br><span class="gs-quiz-hint">' + self.esc(self.t(q.hintFa || q.hintEn, q.hintEn)) + '</span>' : ''));
          setTimeout(function () {
            state.idx += 1;
            state.answered = false;
            renderQ();
          }, ok ? 700 : 1400);
        });
      });
    }

    renderQ();
  }
};

window.GrammarSongsUI = GrammarSongsUI;
