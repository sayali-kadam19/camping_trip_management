let schedulings = [];

async function getSchedulingsById() {
    isLoggedOut();
    let userType = localStorage.getItem('isOwner') == 'true' ? 'owner' : 'user';
    let user_id = localStorage.getItem("user_id")
    blockUI();
    await fetch(`${BASE_URL}property/book/${userType}/${user_id}`)
        .then(async response => {
            const res = await response.json();
            if (response.status === 200) {
                console.log(res.data);
                schedulings = res.data;
                renderScheduleCards()

            }
        })
        .catch(error => console.log('error', error));
    unblockUI();
}

function renderScheduleCards() {
    let cards = "";
    let main = document.getElementById("schedule-main");
    const images = ["../images/property_1.jpg", "../images/property_2.jpg"];
    for (let i = 0; i < schedulings.length; i++) {
        cards += ` <div class="booking-card">
        <div style="display: flex; align-items: center;">
            <img
                src="${images[i]}" />

            <div class="booking-card-body">
                <h2>${schedulings[i]?.property_name}</h2>
                <p style="margin-top: 15px;">Booking Date : ${schedulings[i]?.time_slot}</p>
            </div>
        </div>
        <p style="background-color: grey; color: white; padding: 10px 20px;">${schedulings[i]?.is_approved ? "Confirmed" : "Pending"}</p>
    </div>`
    }

    main.innerHTML = cards;
}