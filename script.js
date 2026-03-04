document.addEventListener("DOMContentLoaded", () => {
    // 1. Собираем все нужные элементы
    const hInput = document.getElementById("hours"); // Добавил часы
    const minInput = document.getElementById("minutes");
    const secInput = document.getElementById("seconds");
    const distInput = document.getElementById("distance");
    const unitBtn = document.getElementById("unitToggle");
    const paceOut = document.getElementById("paceOut");
    const speedOut = document.getElementById("speedOut");

    let currentUnit = "km";

    function formatTime(totalSeconds) {
        if (totalSeconds <= 0 || isNaN(totalSeconds)) return "0:00";
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = Math.round(totalSeconds % 60);
        if (h > 0) return `${h}:${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
        return `${m}:${s < 10 ? '0' + s : s}`;
    }

    function calculate() {
        const hrs = parseFloat(hInput?.value) || 0; // Считываем часы
        const mins = parseFloat(minInput.value) || 0;
        const secs = parseFloat(secInput.value) || 0;
        const dist = parseFloat(distInput.value) || 0;
        
        const distanceInMeters = (currentUnit === "m") ? dist : dist * 1000;

        if (distanceInMeters > 0 && (hrs > 0 || mins > 0 || secs > 0)) {
            const totalSeconds = (hrs * 3600) + (mins * 60) + secs;
            const totalKm = distanceInMeters / 1000;
            const pacePerKm = totalSeconds / totalKm;
            const kmph = totalKm / (totalSeconds / 3600);

            // Основной вывод
            paceOut.innerText = formatTime(pacePerKm);
            speedOut.innerText = kmph.toFixed(1);

            // Прогнозы (используем ID, которые есть в сбросе для единства)
            const p1 = document.getElementById("p1");
            const p5 = document.getElementById("p5");
            const p10 = document.getElementById("p10");
            const p21 = document.getElementById("p21");

            if (p1) p1.innerText = formatTime(pacePerKm);
            if (p5) p5.innerText = formatTime(pacePerKm * 5);
            if (p10) p10.innerText = formatTime(pacePerKm * 10);
            if (p21) p21.innerText = formatTime(pacePerKm * 21.1);
        } else {
            paceOut.innerText = "0:00";
            speedOut.innerText = "0";
        }
    }

    // Делаем функцию доступной глобально, чтобы onclick в HTML сработал
    window.resetAll = function() {
        if (hInput) hInput.value = '';
        minInput.value = '';
        secInput.value = '';
        distInput.value = '1';
        
        paceOut.innerText = '0:00';
        speedOut.innerText = '0';

        ['p1', 'p5', 'p10', 'p21'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerText = '0:00';
        });
        console.log("Мгновенный сброс выполнен");
    };

    // Слушатель для переключения КМ/М
    unitBtn.addEventListener("click", () => {
        let val = parseFloat(distInput.value) || 0;
        if (currentUnit === "km") {
            currentUnit = "m";
            unitBtn.innerText = "м";
            distInput.value = Math.round(val * 1000);
        } else {
            currentUnit = "km";
            unitBtn.innerText = "км";
            distInput.value = Number((val / 1000).toFixed(2));
        }
        calculate();
    });

    // Слушатели ввода
    [hInput, minInput, secInput, distInput].forEach(input => {
        if (input) input.addEventListener("input", calculate);
    });

    // Бургер
    const burgerBtn = document.getElementById("burgerBtn");
    const menuItems = document.getElementById("menuItems");
    
    burgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        menuItems.classList.toggle("show");
    });
    
    document.addEventListener("click", () => menuItems.classList.remove("show"));
});