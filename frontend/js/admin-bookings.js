let schedulings = [];

async function getSchedulingsById() {
    isLoggedOut();
    let userType = localStorage.getItem('isOwner') == 'true' ? 'owner' : 'user';
    let user_id = localStorage.getItem("user_id");

    if (userType == 'user') {
        window.location.href = "./home.html";
    }

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
                <h3> User name : ${schedulings[i]?.user_name}</h3>
                <p style="margin-top: 15px;">Booking Date : ${schedulings[i]?.time_slot}</p>
            </div>

            
        </div>
        <div style="display: flex;">
            ${schedulings[i]?.is_approved ? `<p 
                style="background-color: gray; color: white; padding: 10px 20px;margin-right: 15px;cursor: pointer;border-radius: 5px;">
                Confirmed
            </p>` :
                `<p onclick="updateBookings(${schedulings[i]?.id})"
                style="background-color: teal; color: white; padding: 10px 20px;cursor: pointer; border-radius: 5px;">
                Confirm</p>`}
        </div>
    </div>`
    }

    main.innerHTML = cards;
}


async function updateBookings(id) {
    blockUI();
    var requestOptions = {
        method: 'PUT',
        body: JSON.stringify({
            "id": id,
            "is_approved": true
        })
    };

    await fetch(`${BASE_URL}property/book`, requestOptions)
        .then(async response => {
            const res = await response.json();
            showToast(res.response);
            if (response.status == 200) {
                getSchedulingsById();
            }
        })
        .catch(error => console.log('error', error));
    unblockUI();
}