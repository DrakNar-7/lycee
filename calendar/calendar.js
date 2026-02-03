let currentOffset = 0;
let events = JSON.parse(localStorage.getItem('hijriEvents')) || {};
let activeDateKey = "";

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    const monthDisplay = document.getElementById('monthDisplay');
    grid.innerHTML = '';

    const now = new Date(); // The actual current time
    const todayParts = new Intl.DateTimeFormat('en-u-ca-islamic-nu-latn', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
    }).formatToParts(now);

    // Create a key for today to compare
    const todayDay = todayParts.find(p => p.type === 'day')?.value;
    const todayMonth = todayParts.find(p => p.type === 'month')?.value;
    const todayYear = todayParts.find(p => p.type === 'year')?.value;
    const todayKey = `${todayDay}-${todayMonth}-${todayYear}`;

    const target = new Date(now);
    target.setDate(now.getDate() + currentOffset * 30);

    const monthFmt = new Intl.DateTimeFormat('en-u-ca-islamic', {month:'long', year:'numeric'});
    monthDisplay.textContent = monthFmt.format(target);

    let start = new Date(target);
    start.setDate(1);

    for (let i = 0; i < 42; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);

        const parts = new Intl.DateTimeFormat('en-u-ca-islamic-nu-latn', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).formatToParts(date);

        const hijriDay = parts.find(p => p.type === 'day')?.value || '?';
        const hijriMonth = parts.find(p => p.type === 'month')?.value;
        const hijriYear = parts.find(p => p.type === 'year')?.value;

        const key = `${hijriDay}-${hijriMonth}-${hijriYear}`;

        const el = document.createElement('div');
        el.className = 'day';
        
        // CHECK IF IT IS TODAY
        if (key === todayKey) {
            el.classList.add('today');
        }

        el.innerHTML = `<span>${hijriDay}</span>`;

        if (events[key]?.length > 0) {
            el.innerHTML += `<div class="event-dot"></div>`;
        }

        el.onclick = () => openModal(key);
        grid.appendChild(el);
    }
}
// Replace your old convertDate() function with this more robust version
function convertToHijri() {
    const input = document.getElementById('gregInput');
    const resultEl = document.getElementById('hijriResult');

    if (!input.value) {
        resultEl.innerText = "Select a date";
        return;
    }

    try {
        const gregDate = new Date(input.value);

        // Most reliable way using Intl (works in modern browsers)
        const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-nu-latn', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });

        const hijriFormatted = formatter.format(gregDate);

        // Optional: cleaner format
        const parts = new Intl.DateTimeFormat('en-u-ca-islamic-nu-latn', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        }).formatToParts(gregDate);

        const day   = parts.find(p => p.type === 'day')?.value   || '?';
        const month = parts.find(p => p.type === 'month')?.value || '?';
        const year  = parts.find(p => p.type === 'year')?.value  || '?';

        resultEl.innerText = `${day} ${getHijriMonthName(month)} ${year} AH`;
        // resultEl.innerText = hijriFormatted;   ← alternative (long month name)
    } catch (e) {
        resultEl.innerText = "Error - invalid date";
        console.error("Hijri conversion error:", e);
    }
}

// Helper - because month number → name is more user friendly
function getHijriMonthName(monthNum) {
    const names = [
        "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani",
        "Jumada al-Ula", "Jumada al-Thani", "Rajab", "Sha'ban",
        "Ramadan", "Shawwal", "Dhu al-Qi'dah", "Dhu al-Hijjah"
    ];
    return names[parseInt(monthNum) - 1] || "???";
}
// ── Event Modal & Management ──────────────────────────────────────

function openModal(dateKey) {
    activeDateKey = dateKey;
    document.getElementById('selectedDate').innerText = dateKey;
    renderEventList();
    document.getElementById('eventModal').style.display = 'block';
}

function renderEventList() {
    const list = document.getElementById('eventList');
    if (!list) return; // safety

    list.innerHTML = "";
    
    const dayEvents = events[activeDateKey] || [];
    
    dayEvents.forEach((task, index) => {
        const li = document.createElement('li');
        li.style.display = "flex";
        li.style.justifyContent = "space-between";
        li.style.marginBottom = "8px";
        li.innerHTML = `
            <span>• ${task}</span>
            <button onclick="deleteEvent(${index})" 
                    style="color:red; border:none; background:none; font-size:18px; cursor:pointer;">×</button>
        `;
        list.appendChild(li);
    });
}

function addEvent() {
    const input = document.getElementById('eventInput');
    if (!input) return;

    const task = input.value.trim();
    
    if (task) {
        if (!events[activeDateKey]) {
            events[activeDateKey] = [];
        }
        events[activeDateKey].push(task);
        
        localStorage.setItem('hijriEvents', JSON.stringify(events));
        input.value = "";
        renderEventList();
        renderCalendar(); // refresh dots & counters
    }
}

function deleteEvent(index) {
    if (!events[activeDateKey]) return;
    
    events[activeDateKey].splice(index, 1);
    
    if (events[activeDateKey].length === 0) {
        delete events[activeDateKey];
    }
    
    localStorage.setItem('hijriEvents', JSON.stringify(events));
    renderEventList();
    renderCalendar(); // refresh view
}

function closeModal() {
    document.getElementById('eventModal').style.display = 'none';
}
document.getElementById('prevMonth').onclick = () => { currentOffset--; renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentOffset++; renderCalendar(); };

renderCalendar();