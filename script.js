const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

function showConflict(type) {
    document.querySelectorAll('.conflict-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(type).classList.add('active');
    event.target.classList.add('active');
}

function showRec(type) {
    document.querySelectorAll('.rec-content').forEach(c => c.classList.remove('active'));
    document.querySelectorAll('.rec-tab').forEach(t => t.classList.remove('active'));
    
    document.getElementById(type).classList.add('active');
    event.target.classList.add('active');
}

function rollDice(element) {
    const diceType = element.textContent;
    let max = 20;
    if (diceType === 'd6') max = 6;
    if (diceType === 'd4') max = 4;
    
    const result = Math.floor(Math.random() * max) + 1;
    element.textContent = result;
    element.style.transform = 'rotate(360deg)';
    
    setTimeout(() => {
        element.style.transform = 'rotate(0deg)';
        setTimeout(() => {
            element.textContent = diceType;
        }, 1000);
    }, 600);
}

function selectCharacter(card) {
    document.querySelectorAll('.character-card').forEach(c => {
        c.style.background = 'rgba(255,255,255,0.1)';
        c.style.border = '1px solid rgba(255,255,255,0.2)';
    });
    card.style.background = 'rgba(255,255,255,0.3)';
    card.style.border = '2px solid #4ade80';
}

function showResult(btn, type) {
    const resultDiv = document.getElementById('result');
    resultDiv.className = 'result-message';
    
    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
    
    if (type === 'bad') {
        resultDiv.classList.add('warning');
        resultDiv.innerHTML = '<strong>-2 очка гармонии</strong><br>Обвинение приведёт к эскалации конфликта. Попробуй найти конструктивное решение.';
    } else if (type === 'good') {
        resultDiv.classList.add('success');
        resultDiv.innerHTML = '<strong>+2 очка гармонии!</strong><br>Хороший выбор! Конструктивный диалог — ключ к решению.';
    } else if (type === 'best') {
        resultDiv.classList.add('success');
        resultDiv.innerHTML = '<strong>+3 очка гармонии!</strong><br>Превосходно! Справедливое решение для всех.';
    }
}

document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== УПРАВЛЕНИЕ ТЕМНОЙ ТЕМОЙ =====
(function() {
    // Создаём кнопку переключения темы
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.setAttribute('aria-label', 'Переключить тему (светлая/тёмная)');
    themeToggle.innerHTML = '🌙 Тёмная тема';
    document.body.appendChild(themeToggle);

    // Проверяем сохранённую тему в localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '☀️ Светлая тема';
    }

    // Обработчик клика по кнопке
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '☀️ Светлая тема';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '🌙 Тёмная тема';
        }
    });
})();

// ===== УЛУЧШЕНИЯ ДОСТУПНОСТИ =====

// Добавляем возможность закрывать модальные окна по клавише Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Закрыть возможные активные модальные окна
        const activeModals = document.querySelectorAll('.result-message.success, .result-message.warning');
        activeModals.forEach(modal => {
            modal.style.display = 'none';
        });
    }
});

// Автоматически добавляем атрибуты aria для интерактивных элементов
document.querySelectorAll('.character-card').forEach((card, index) => {
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Выбрать персонажа ${card.querySelector('h4')?.textContent || index}`);
});

document.querySelectorAll('.choice-btn').forEach((btn, index) => {
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', `Вариант ответа ${index + 1}: ${btn.textContent}`);
});

// Улучшаем навигацию с клавиатуры
document.querySelectorAll('a, button, .character-card, .choice-btn, .dice').forEach(el => {
    el.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            el.click();
        }
    });
});
