function initWeeklyChart() {
    const chartDom = document.getElementById('weeklyChart');
    if (!chartDom) return;

    const days = JSON.parse(document.getElementById('days-data').textContent || '[]');
    let values = JSON.parse(document.getElementById('values-data').textContent || '[]');

    // 🟢 خريطة تحويل النصوص لأرقام (عشان يظهر طول العمود)
    const evaluationMap = {
        "ضعيف": 20,
        "جيد": 40,
        "جيد جدا": 60,
        "ممتاز": 80,
        "ممتاز جدا": 100
    };

    // 🟢 نرجّع مصفوفة فيها الرقم + التسمية
    const numericValues = values.map(v => ({
        value: evaluationMap[v] || 0,
        label: v || "في انتظار التقييم"
    }));

    const chart = echarts.init(chartDom);

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                const item = numericValues[params[0].dataIndex];
                return `${params[0].axisValue}: ${item.label}`;
            }
        },
        grid: {
            right: '20%', // 🟢 مساحة فاضية على اليمين للتقييمات
            left: '5%',
            bottom: '5%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: days,
            axisLine: { lineStyle: { color: '#9ca3af' } },
            axisLabel: { color: '#6b7280' }
        },
        yAxis: {
            type: 'value',
            min: 0,
            max: 100,
            interval: 20,
            axisLine: { show: false },
            axisLabel: {
                color: '#6b7280',
                formatter: function (val) {
                    return Object.keys(evaluationMap).find(key => evaluationMap[key] === val) || "";
                }
            },
            splitLine: { lineStyle: { color: '#e5e7eb' } }
        },
        series: [{
            data: numericValues.map(item => item.value),
            type: 'bar',
            label: {
                show: true,
                position: 'right', // 🟢 التقييم يظهر على اليمين خالص
                formatter: function (params) {
                    return numericValues[params.dataIndex].label;
                },
                color: '#2563eb',
                fontWeight: 'bold'
            },
            showBackground: true,
            backgroundStyle: { color: 'rgba(180, 180, 180, 0.1)' },
            itemStyle: {
                color: '#2563eb',
                borderRadius: [4, 4, 0, 0]
            }
        }]
    };

    chart.setOption(option);
    window.addEventListener('resize', chart.resize);
}



// Initialize progress rings
function initProgressRings() {
    const rings = document.querySelectorAll('.progress-ring-circle');
    rings.forEach(ring => {
        const circle = ring;
        const radius = circle.r.baseVal.value;
        const circumference = radius * 2 * Math.PI;
        const percent = parseInt(circle.getAttribute('data-percent') || '0', 10);
        const offset = circumference - (percent / 100) * circumference;
        
        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = circumference;
        circle.style.strokeDashoffset = offset;
    });
}

// Add hover effects to cards
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
            this.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)';
        });
    });
}

// Initialize tab functionality
function initTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            tabButtons.forEach(btn => 
                btn.classList.remove('active', 'bg-primary', 'text-white')
            );
            this.classList.add('active', 'bg-primary', 'text-white');
        });
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            const menu = document.getElementById('mobile-menu');
            if (menu) {
                menu.classList.toggle('hidden');
            }
        });
    }
}

// Preview image function
function previewImage(event) {
    var reader = new FileReader();
    reader.onload = function () {
        var output = document.getElementById('image-preview');
        if (output) {
            output.src = reader.result;
        }
    };
    if (event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

// Profile form AJAX update
function initProfileForm() {
    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            let formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    const mainImage = document.getElementById('main-image');
                    const mainName = document.getElementById('main-name');
                    const mainAge = document.getElementById('main-age');
                    const mainCity = document.getElementById('main-city');
                    const mainExtra = document.getElementById('main-extra');

                    if (mainImage) mainImage.src = data.image_url;
                    if (mainName) mainName.textContent = data.name;
                    if (mainAge) mainAge.textContent = data.age;
                    if (mainCity) mainCity.textContent = data.city;

                    let extraHtml = '';

                    if (data.level || data.current_surah || data.current_juz) {
                        extraHtml += '<div class="w-full border-t border-gray-200 my-4"></div>';
                        extraHtml += '<div class="w-full space-y-2">';

                        if (data.level)
                            extraHtml += `<div class="flex justify-between"><span class="text-gray-600">المستوى الحالي:</span><span class="font-medium text-primary text-right">${data.level}</span></div>`;

                        if (data.current_surah)
                            extraHtml += `<div class="flex justify-between"><span class="text-gray-600">السورة الحالية:</span><span class="font-medium text-primary text-right">${data.current_surah}</span></div>`;

                        if (data.current_juz)
                            extraHtml += `<div class="flex justify-between"><span class="text-gray-600">الجزء الحالي:</span><span class="font-medium text-primary text-right">${data.current_juz}</span></div>`;

                        extraHtml += '</div>';
                    }

                    if (mainExtra) mainExtra.innerHTML = extraHtml;

                    let alertBox = document.getElementById("alert-box");
                    if (alertBox) {
                        alertBox.textContent = data.message || "تم الحفظ بنجاح";
                        alertBox.classList.remove("hidden");
                        setTimeout(() => alertBox.classList.add("hidden"), 3000);
                    }
                });
        });
    }
}

// Weekly line chart initialization
const yLabels = ['ضعيف', 'جيد', 'جيد جدًا', 'ممتاز', 'ممتاز جدًا'];

async function initWeeklyLineChart(studentId) {
    let data;
    try {
        const response = await fetch(`/weekly-progress/${studentId}/`);
        data = await response.json();
    } catch (e) {
        data = null;
    }

    let days = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];
    let memorized = [];
    let reviews = [];

    if (!data || !data.memorized || !data.reviews) {
        memorized = Array(7).fill('ضعيف');
        reviews = Array(7).fill('ضعيف');
    } else {
        days = data.days || days;
        memorized = data.memorized;
        reviews = data.reviews;
    }

    const memorizedIdx = memorized.map(v => yLabels.indexOf(v));
    const reviewsIdx = reviews.map(v => yLabels.indexOf(v));

    const chartDom = document.getElementById('weeklyLineChart');
    if (!chartDom || typeof echarts === 'undefined') return;
    
    const chart = echarts.init(chartDom);

    const option = {
        tooltip: {
            trigger: 'axis',
            formatter: function (params) {
                let res = params[0].axisValue + '<br>';
                params.forEach(function (item) {
                    let rating = yLabels[item.value];
                    res += `${item.seriesName}:<br><b>${rating}</b><br>`;
                });
                return res;
            }
        },
        legend: { data: ['الآيات المحفوظة', 'المراجعات'], right: 20 },
        grid: { left: '5%', right: '5%', bottom: '5%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: days },
        yAxis: { type: 'category', data: yLabels },
        series: [
            {
                name: 'الآيات المحفوظة',
                type: 'line',
                smooth: true,
                data: memorizedIdx,
                itemStyle: { color: '#2563eb' },
                areaStyle: {},
                label: {
                    show: true,
                    position: 'right',
                    formatter: p => yLabels[p.value]
                }
            },
            {
                name: 'المراجعات',
                type: 'line',
                smooth: true,
                data: reviewsIdx,
                itemStyle: { color: '#10b981' },
                areaStyle: {},
                label: {
                    show: true,
                    position: 'right',
                    formatter: p => yLabels[p.value]
                }
            }
        ]
    };

    chart.setOption(option);
    window.addEventListener('resize', chart.resize);
}

// Tab switching functionality
function initTabSwitching() {
    const btnUpcoming = document.getElementById('show-upcoming');
    const btnPast = document.getElementById('show-past');

    if (!btnUpcoming || !btnPast) return;

    btnUpcoming.addEventListener('click', () => switchTab('upcoming'));
    btnPast.addEventListener('click', () => switchTab('past'));

    function switchTab(type) {
        btnUpcoming.classList.toggle('bg-primary', type === 'upcoming');
        btnUpcoming.classList.toggle('text-white', type === 'upcoming');
        btnUpcoming.classList.toggle('bg-gray-100', type !== 'upcoming');
        btnUpcoming.classList.toggle('text-gray-700', type !== 'upcoming');

        btnPast.classList.toggle('bg-primary', type === 'past');
        btnPast.classList.toggle('text-white', type === 'past');
        btnPast.classList.toggle('bg-gray-100', type !== 'past');
        btnPast.classList.toggle('text-gray-700', type !== 'past');

        document.querySelectorAll('.row-upcoming').forEach(r => r.style.display = type === 'upcoming' ? '' : 'none');
        document.querySelectorAll('.row-past').forEach(r => r.style.display = type === 'past' ? '' : 'none');
    }

    // الوضع الافتراضي
    switchTab('upcoming');
}

// Notifications and toggles
function showNotification(title, message) {
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            title: title,
            text: message,
            icon: 'info',
            allowOutsideClick: false,
            showConfirmButton: true,
            confirmButtonText: "إغلاق"
        });
    }
}

function initNotifications() {
    // جلب آخر إشعار
    setInterval(() => {
        fetch("/notifications/latest/")
            .then(r => r.json())
            .then(data => {
                if (data.title) showNotification(data.title, data.message);
            })
            .catch(() => {});
    }, 60000);
}

function initToggles() {
    // Toggle reminder
    document.querySelectorAll(".reminder-toggle").forEach(toggle => {
        toggle.addEventListener("change", function () {
            let planId = this.dataset.id;
            let checked = this.checked;

            fetch("/toggle-reminder/" + planId + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ reminder_enabled: checked })
            }).catch(() => {});
        });
    });

    // Toggle completed
    document.querySelectorAll(".completed-toggle").forEach(toggle => {
        toggle.addEventListener("change", function () {
            let planId = this.dataset.id;
            let checked = this.checked;

            fetch("/toggle-completed/" + planId + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_completed: checked })
            }).catch(() => {});
        });
    });
}

// Profile completion modal
function initProfileCompletionModal() {
    let isComplete = false; // بدلها حسب الحالة الحقيقية
    if (!isComplete && typeof Swal !== 'undefined') {
        Swal.fire({
            title: "أكمل بياناتك",
            html: `
            <form id="profileForm">
                <label>إدخال صورة لك:</label>
                <input type="file" name="image" class="swal2-file">

                <label>الاسم:</label>
                <input type="text" name="name" class="swal2-input" value="USER_NAME">

                <label>العمر:</label>
                <input type="number" name="age" class="swal2-input" value="USER_AGE">

                <label>المدينة:</label>
                <input type="text" name="city" class="swal2-input" value="USER_CITY">

                <label>المستوى:</label>
                <input type="text" name="level" class="swal2-input" value="USER_LEVEL">

                <label>السورة الحالية:</label>
                <input type="text" name="current_surah" class="swal2-input" value="CURRENT_SURA">

                <label>الجزء الحالي:</label>
                <input type="text" name="current_juz" class="swal2-input" value="CURRENT_JUZ">
            </form>
            `,
            confirmButtonText: "حفظ",
            allowOutsideClick: false,
            preConfirm: () => {
                // هنا يتم إرسال الفورم عبر fetch
                return true;
            }
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof echarts !== 'undefined') {
        initWeeklyChart();
    }
    initProgressRings();
    initCardHoverEffects();
    initTabs();
    initMobileMenu();
    initProfileForm();
    initTabSwitching();
    initNotifications();
    initToggles();
    initProfileCompletionModal();
    
    // Initialize weekly line chart if student ID is available
    const studentId = "STUDENT_ID";
    if (studentId && studentId !== "STUDENT_ID") {
        initWeeklyLineChart(studentId);
    }
});

// Make previewImage available globally for inline event handlers
window.previewImage = previewImage;