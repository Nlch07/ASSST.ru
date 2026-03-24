document.addEventListener("DOMContentLoaded", () => {
    const minInput = document.getElementById("minutes");
    const secInput = document.getElementById("seconds");
    const distInput = document.getElementById("distance");
    const unitBtn = document.getElementById("unitToggle");
    const paceOut = document.getElementById("paceOut");
    const speedOut = document.getElementById("speedOut");
    const themeToggle = document.getElementById("themeToggle");
    const langToggle = document.getElementById("langToggle");

    let currentUnit = "km";
    let currentLang = "ru";

    const texts = {
        ru: {
            hintTime: "Введите время:", hintDist: "Укажите дистанцию:",
            min: "мин", sec: "сек", km: "км", m: "м",
            paceUnit: "мин/км", speedUnit: "км/ч", reset: "СБРОСИТЬ ВСЁ",
            orientTitle: "Ориентиры по темпу", recordsTitle: "Мировые рекорды",
            p1_lab: "Новичок (Легкий бег)", p1_txt: "Темп, при котором можно свободно разговаривать. Идеально для начала пути и жиросжигания.",
            p2_lab: "Средний уровень (Фитнес)", p2_txt: "Уверенный бег для тех, кто тренируется 2-3 раза в неделю. Позволяет пробежать 10 км без остановок.",
            p3_lab: "Продвинутый / Профи", p3_txt: "Темп соревнований и скоростных тренировок. Требует системной подготовки и выносливости.",
            paceLabel: "Темп:", speedLabel: "Скорость:",
            // Рекорды
            rec_dist: ["1 КМ", "5 КМ", "10 КМ", "21.1 КМ (Полумарафон)", "42.2 КМ (Марафон)"],
            rec_athletes: [
                "Ноа Нгени (Кения), Риети, 1999",
                "Джошуа Чептегеи (Уганда), Монако, 2020",
                "Джошуа Чептегеи (Уганда), Валенсия, 2020",
                "Йомиф Кеджелча (Эфиопия), Валенсия, 2024",
                "Келвин Киптум (Кения), Чикаго, 2023"
            ]
        },
        en: {
            hintTime: "Enter time:", hintDist: "Distance:",
            min: "min", sec: "sec", km: "km", m: "m",
            paceUnit: "min/km", speedUnit: "km/h", reset: "RESET ALL",
            orientTitle: "Pace Benchmarks", recordsTitle: "World Records",
            p1_lab: "Beginner (Easy Run)", p1_txt: "Pace where you can talk freely. Perfect for weight loss and recovery.",
            p2_lab: "Intermediate (Fitness)", p2_txt: "Steady running for those training 2-3 times a week. Allows to run 10 km without stops.",
            p3_lab: "Advanced / Pro", p3_txt: "Competition and interval pace. Requires systematic training and endurance.",
            paceLabel: "Pace:", speedLabel: "Speed:",
            // Records
            rec_dist: ["1 KM", "5 KM", "10 KM", "21.1 KM (Half-marathon)", "42.2 KM (Marathon)"],
            rec_athletes: [
                "Noah Ngeny (Kenya), Rieti, 1999",
                "Joshua Cheptegei (Uganda), Monaco, 2020",
                "Joshua Cheptegei (Uganda), Valencia, 2020",
                "Yomif Kejelcha (Ethiopia), Valencia, 2024",
                "Kelvin Kiptum (Kenya), Chicago, 2023"
            ]
        }
    };

    function formatTime(totalSeconds) {
        if (totalSeconds <= 0 || isNaN(totalSeconds)) return "0:00";
        const m = Math.floor(totalSeconds / 60);
        const s = Math.round(totalSeconds % 60);
        return `${m}:${s < 10 ? '0' + s : s}`;
    }

    function calculate() {
        const mins = parseFloat(minInput.value) || 0;
        const secs = parseFloat(secInput.value) || 0;
        const dist = parseFloat(distInput.value) || 0;
        const distanceInKm = (currentUnit === "m") ? dist / 1000 : dist;

        if (distanceInKm > 0 && (mins > 0 || secs > 0)) {
            const totalSeconds = (mins * 60) + secs;
            const pacePerKm = totalSeconds / distanceInKm;
            const kmph = distanceInKm / (totalSeconds / 3600);
            paceOut.innerText = formatTime(pacePerKm);
            speedOut.innerText = kmph.toFixed(1);

            ["1k", "5k", "10k", "21k"].forEach((id, i) => {
                const el = document.getElementById("t" + id);
                const mults = [1, 5, 10, 21.1];
                if (el) el.innerText = formatTime(pacePerKm * mults[i]);
            });
        }
    }

    function updateLanguage() {
        const t = texts[currentLang];
        
        // Инпуты
        const h = document.querySelectorAll('.input-hint');
        if(h[0]) h[0].innerText = t.hintTime;
        if(h[1]) h[1].innerText = t.hintDist;
        
        const l = document.querySelectorAll('.label');
        if(l[0]) l[0].innerText = t.min;
        if(l[1]) l[1].innerText = t.sec;

        if(unitBtn) unitBtn.innerText = currentUnit === "km" ? t.km : t.m;
        
        const u = document.querySelectorAll('.unit');
        if(u[0]) u[0].innerText = t.paceUnit;
        if(u[1]) u[1].innerText = t.speedUnit;

        const rb = document.querySelector('.reset-action');
        if(rb) rb.innerText = t.reset;

        // Заголовки
        const pt = document.querySelector('.pace-info h3');
        const rt = document.querySelector('.records-info h3');
        if(pt) pt.innerText = t.orientTitle;
        if(rt) rt.innerText = t.recordsTitle;

        // Ориентиры
        const ib = document.querySelectorAll('.info-block');
        ib.forEach((block, i) => {
            const label = block.querySelector('.info-label');
            const p = block.querySelector('p');
            if(i === 0) { label.innerText = t.p1_lab; p.innerText = t.p1_txt; }
            if(i === 1) { label.innerText = t.p2_lab; p.innerText = t.p2_txt; }
            if(i === 2) { label.innerText = t.p3_lab; p.innerText = t.p3_txt; }
        });

        // РЕКОРДЫ (включая Темп и Скорость)
        const items = document.querySelectorAll('.record-item');
        items.forEach((item, i) => {
            // 1. Дистанция
            const distLabel = item.querySelector('.rec-dist');
            if(distLabel) distLabel.innerText = t.rec_dist[i];

                    // МЕНЯЕМ ЛОГОТИП
            const logo = document.getElementById("logo");
            if (logo) {
                logo.innerHTML = currentLang === "ru" 
                    ? 'КАЛЬКУЛЯТОР <span>ТЕМПА</span>' 
                    : 'PACE<span>CALC</span>';
            }
            
            // 2. Темп и Скорость (исправленная логика)
            const stats = item.querySelector('.rec-stats');
            if(stats) {
                // Извлекаем только цифры из текущей строки, чтобы не потерять их
                const numbers = stats.innerText.match(/\d+:\d+|\d+\.\d+/g);
                if (numbers && numbers.length >= 2) {
                    const paceVal = numbers[0];
                    const speedVal = numbers[1];
                    // Собираем строку заново с правильным языком
                    stats.innerText = `${t.paceLabel} ${paceVal} ${t.paceUnit} | ${t.speedLabel} ${speedVal} ${t.speedUnit}`;
                }
            }

            // 3. Имя атлета и страна
            const athlete = item.querySelector('p');
            if(athlete) athlete.innerText = t.rec_athletes[i];
        });
    }

    // События
    langToggle?.addEventListener("click", () => {
        currentLang = currentLang === "ru" ? "en" : "ru";
        langToggle.innerText = currentLang === "ru" ? "EN" : "RU";
        updateLanguage();
    });

    themeToggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        themeToggle.innerText = document.body.classList.contains("dark-theme") ? "☀️" : "🌙";
    });

    unitBtn?.addEventListener("click", () => {
        let val = parseFloat(distInput.value) || 0;
        currentUnit = (currentUnit === "km") ? "m" : "km";
        distInput.value = (currentUnit === "m") ? Math.round(val * 1000) : Number((val / 1000).toFixed(2));
        updateLanguage();
        calculate();
    });

    [minInput, secInput, distInput].forEach(inp => inp?.addEventListener("input", calculate));

    window.resetAll = function() {
        minInput.value = ''; secInput.value = ''; distInput.value = '1';
        paceOut.innerText = '0:00'; speedOut.innerText = '0';
        ["t1k", "t5k", "t10k", "t21k"].forEach(id => {
            const el = document.getElementById(id);
            if(el) el.innerText = '0:00';
        });
    };
});