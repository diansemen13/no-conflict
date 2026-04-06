/**
 * Школа Согласия - Основные скрипты
 * оптимизация: была удалена зависимость от глобального event, добавлена валидация
 */

// ===== константы =====
const SELECTORS = {
    FADE_IN: '.fade-in',
    CONFLICT_CONTENT: '.conflict-content',
    TOGGLE_BTN: '.toggle-btn',
    REC_CONTENT: '.rec-content',
    REC_TAB: '.rec-tab',
    CHARACTER_CARD: '.character-card',
    CHOICE_BTN: '.choice-btn',
    RESULT: '#result',
    NAV_ANCHOR: 'nav a'
};

const OBSERVER_OPTIONS = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

// ===== анимации при скролле =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target); // Оптимизация: перестаем следить после показа
        }
    });
}, OBSERVER_OPTIONS);

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(SELECTORS.FADE_IN).forEach(el => observer.observe(el));
});

// ===== переключение вкладов конфликтов =====
function showConflict(type, btn) {
    if (!btn) return;
    
    document.querySelectorAll(SELECTORS.CONFLICT_CONTENT).forEach(c => {
        c.classList.remove('active');
        c.hidden = true;
    });
    document.querySelectorAll(SELECTORS.TOGGLE_BTN).forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
    });
    
    const content = document.getElementById(type);
    if (content) {
        content.classList.add('active');
        content.hidden = false;
    }
    
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
}

// ===== переключение рекомендаций  =====
function showRec(type, btn) {
    if (!btn) return;
    
    document.querySelectorAll(SELECTORS.REC_CONTENT).forEach(c => {
        c.classList.remove('active');
        c.hidden = true;
    });
    document.querySelectorAll(SELECTORS.REC_TAB).forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
    });
    
    const content = document.getElementById(type);
    if (content) {
        content.classList.add('active');
        content.hidden = false;
    }
    
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
}

// ===== бросок кубиков  =====
function rollDice(element) {
    if (!element) return;
    
    const diceType = element.textContent;
    const maxValues = { 'd20': 20, 'd6': 6, 'd4': 4 };
    const max = maxValues[diceType] || 20;
    
    const result = Math.floor(Math.random() * max) + 1;
    
    element.style.transform = 'rotate(360deg) scale(1.1)';
    element.textContent = '🎲';
    element.disabled = true;
    
    setTimeout(() => {
        element.textContent = result;
        element.style.transform = 'rotate(0deg) scale(1)';
        
        setTimeout(() => {
            element.textContent = diceType;
            element.disabled = false;
        }, 1000);
    }, 300);
}

// ===== выбор персонажа =====
function selectCharacter(card) {
    if (!card) return;
    
    document.querySelectorAll(SELECTORS.CHARACTER_CARD).forEach(c => {
        c.style.background = '';
        c.style.border = '';
        c.setAttribute('aria-pressed', 'false');
    });
    
    card.setAttribute('aria-pressed', 'true');
    
// здесь мы определяем тему
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const bgActive = isDark 
        ? 'rgba(255,255,255,0.25)' 
        : 'rgba(255,255,255,0.3)';
    
    card.style.background = bgActive;
    card.style.border = '2px solid #4ade80';
}

// ===== показ результата выбора =====
function showResult(btn, type) {
    const resultDiv = document.querySelector(SELECTORS.RESULT);
    if (!resultDiv) return;
    
    resultDiv.className = 'result-message';
    resultDiv.setAttribute('role', 'status');
    
    // блокируем кнопки
    document.querySelectorAll(SELECTORS.CHOICE_BTN).forEach(b => {
        b.disabled = true;
        b.style.opacity = '0.6';
        b.style.cursor = 'not-allowed';
    });
    
    // текст результата
    const messages = {
        bad: {
            class: 'warning',
            html: '<strong>-2 очка гармонии</strong><br>Обвинение приведёт к эскалации конфликта. Попробуй найти конструктивное решение.'
        },
        good: {
            class: 'success',
            html: '<strong>+2 очка гармонии!</strong><br>Хороший выбор! Конструктивный диалог — ключ к решению.'
        },
        best: {
            class: 'success',
            html: '<strong>+3 очка гармонии!</strong><br>Превосходно! Справедливое решение для всех.'
        }
    };
    
    const msg = messages[type];
    if (msg) {
        resultDiv.classList.add(msg.class);
        resultDiv.innerHTML = msg.html;
    }
}

// ===== плавная навигация =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll(SELECTORS.NAV_ANCHOR).forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Обновляем URL без перезагрузки
                history.pushState(null, null, targetId);
            }
        });
    });
    
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }
});

// ===== улучшено: отслеживание смены темы =====
// для динамического обновления стилей при смене системной темы
if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        // перерисовка выбранных карточек персонажей
        document.querySelectorAll(`${SELECTORS.CHARACTER_CARD}[aria-pressed="true"]`).forEach(card => {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            card.style.background = isDark ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.3)';
        });
    });
}