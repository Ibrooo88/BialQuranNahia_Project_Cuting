function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

const inboxUrl = "inbox.html"; // رابط ثابت للصفحة الرئيسية
const fromPayment = getQueryParam('from') === 'payment';

if (fromPayment) {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', function () {
        window.location.href = inboxUrl;
    });

    let seconds = 10;
    const timerSpan = document.getElementById('timer');
    if (timerSpan) {
        const interval = setInterval(function() {
            seconds--;
            timerSpan.textContent = seconds;
            if (seconds <= 0) {
                clearInterval(interval);
                window.location.href = inboxUrl;
            }
        }, 1000);
    }
} else {
    const timerBlock = document.getElementById('timerBlock');
    const homeBtnBlock = document.getElementById('homeBtnBlock');
    if (timerBlock) timerBlock.style.display = 'none';
    if (homeBtnBlock) homeBtnBlock.style.display = 'block';
}

