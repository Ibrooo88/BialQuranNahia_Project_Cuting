// ✅ طلب إذن لإرسال الإشعارات من المتصفح
document.addEventListener("DOMContentLoaded", () => {
    if ("Notification" in window) {
        if (Notification.permission !== "granted" && Notification.permission !== "denied") {
            Notification.requestPermission();
        }
    }
});

// ✅ دالة لإظهار إشعار فوري
function showNotification(title, message) {
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification(title, {
            body: message,
            icon: "../images/logo.png" // أيقونة الإشعارات
        });
    }
}

// ✅ مثال: محاكاة وصول تنبيه جديد بعد 5 ثواني
setTimeout(() => {
    showNotification("📌 خطة المراجعة", "حان وقت مراجعة سورة البقرة اليوم!");
}, 5000);

