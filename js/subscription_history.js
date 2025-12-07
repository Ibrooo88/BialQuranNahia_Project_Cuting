// محاكاة بيانات الاشتراكات JSON
const subscriptions = [
    {id:1, plan:{name:"المرحلة 1"}, price:500, display_status:"نشط", start_date:"2025-11-01 10:00", end_date:"2025-12-01 10:00", payment_image:"https://via.placeholder.com/100"},
    {id:2, plan:{name:"المرحلة 2"}, price:400, display_status:"منتهي", start_date:"2025-10-01 10:00", end_date:"2025-11-01 10:00", payment_image:null},
];

// تعبئة الجدول
const tbody = document.querySelector("#subscriptions-table tbody");
if (tbody) {
    if(subscriptions.length === 0){
        const tr = document.createElement("tr");
        tr.innerHTML = `<td colspan="7" class="text-center py-4">لا يوجد اشتراكات</td>`;
        tbody.appendChild(tr);
    } else {
        subscriptions.forEach(sub => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${sub.id}</td>
                <td>${sub.plan.name}</td>
                <td>${sub.price} جنيه</td>
                <td>${sub.display_status}</td>
                <td>${sub.start_date}</td>
                <td>${sub.end_date}</td>
                <td>${sub.payment_image ? `<a href="${sub.payment_image}" target="_blank">عرض الإيصال</a>` : "لا يوجد"}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

