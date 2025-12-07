// محاكاة المواعيد JSON
const appointments = [
    {id:1, day:'السبت', time:'10:00', period:'ص', is_booked:false},
    {id:2, day:'الأحد', time:'14:00', period:'م', is_booked:true},
    {id:3, day:'الإثنين', time:'12:00', period:'م', is_booked:false}
];

const appointmentInput = document.getElementById("appointment_id");
const paymentInput = document.getElementById("payment-image");
const confirmBtn = document.getElementById("confirmPaymentBtn");
const appointmentWarn = document.getElementById("appointment-warning");
const paymentWarn = document.getElementById("payment-warning");
const previewImg = document.getElementById("preview-img");

function checkFormReady(showWarnings=false){
    let ok = true;

    if(!appointmentInput || !appointmentInput.value){
        ok = false;
        if(showWarnings && appointmentWarn){ 
            appointmentWarn.textContent = "يجب اختيار موعد"; 
            appointmentWarn.style.display = "inline-block"; 
        }
    } else if (appointmentWarn) { 
        appointmentWarn.style.display = "none"; 
    }

    if(!(paymentInput && paymentInput.files && paymentInput.files.length > 0)){
        ok = false;
        if(showWarnings && paymentWarn){ 
            paymentWarn.textContent = "يجب رفع صورة إيصال الدفع"; 
            paymentWarn.style.display = "inline-block"; 
        }
    } else if (paymentWarn) { 
        paymentWarn.style.display = "none"; 
    }

    if (confirmBtn) {
        confirmBtn.disabled = !ok;
    }
    return ok;
}

// تحميل المواعيد
function loadAppointments(){
    const container = document.getElementById("appointments-container");
    if (!container) return;
    
    container.innerHTML = "";
    appointments.forEach(app => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn-outline-primary appointment-btn";
        btn.textContent = `${app.day} - ${app.time} ${app.period}`;
        if(app.is_booked){
            btn.disabled = true;
            btn.classList.add("booked");
        } else {
            btn.addEventListener("click", ()=>{
                if (appointmentInput) {
                    appointmentInput.value = app.id;
                }
                container.querySelectorAll("button").forEach(b=>b.classList.remove("active"));
                btn.classList.add("active");
                checkFormReady();
            });
        }
        container.appendChild(btn);
    });
}

// معاينة صورة الدفع
if (paymentInput) {
    paymentInput.addEventListener('change', function(){
        if(this.files && this.files[0]){
            const reader = new FileReader();
            reader.onload = e => { 
                if (previewImg) {
                    previewImg.src = e.target.result; 
                    previewImg.style.display='block'; 
                }
                checkFormReady(); 
            }
            reader.readAsDataURL(this.files[0]);
        }
    });
}

const subscriptionForm = document.getElementById("subscriptionForm");
if (subscriptionForm) {
    subscriptionForm.addEventListener("submit", function(e){
        if(!checkFormReady(true)){
            e.preventDefault();
            alert("يجب اختيار موعد ورفع إيصال الدفع قبل التأكيد!");
            return;
        }
        // بعد التأكيد الناجح، التوجيه إلى صفحة الدفع
        e.preventDefault();
        // يمكن إضافة منطق إرسال البيانات هنا
        window.location.href = "payment.html";
    });
}

// بدء التحميل
loadAppointments();

