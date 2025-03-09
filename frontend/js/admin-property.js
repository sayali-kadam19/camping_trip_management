let user_id = localStorage.getItem('user_id');
let userType = localStorage.getItem("isOwner");

async function getProperties() {
    isLoggedOut();
    if (userType == 'false') {
        window.location.href = "./home.html";
    }
    blockUI();
    await fetch(`${BASE_URL}properties?owner_id=${user_id}`)
        .then(async response => {
            const res = await response.json();
            properties = res.data;
            getPropertyCards();
        })
        .catch(error => console.log('error', error));
    unblockUI();
}

function getPropertyCards() {
    let cards = "";
    let main = document.getElementById("property-main");
    const images = ["../images/property_1.jpg", "../images/property_2.jpg", "../images/property_3.jpg"];
    for (let i = 0; i < properties.length; i++) {
        cards += ` <div class="rental-card" >
        <img
            src="${images[i]}" />

        <div class="card-body">
            <div>
                <h3>${properties[i]?.name}</h3>
                <p>${properties[i]?.location}</p>
            </div>

            <div>
                <p>Rent Amount: <b>$ ${properties[i]?.rental_amount}</b></p>
                <p>Advance Amount: <b>$ ${properties[i]?.advance_amount}</b></p>
            </div>
        </div>

        <div class="card-actions">
        <p style="background-color: blue; padding: 10px 20px;  margin-right:20px; width: max-content;color: white" onclick="openUModal(${properties[i]?.id}, '${properties[i]?.name}', '${properties[i]?.location}',${properties[i]?.rental_amount}, ${properties[i]?.advance_amount}, ${properties[i]?.availability})"" >Update</p>
        <p style="background-color: red; padding: 10px 20px; width: max-content;color: white" onclick="deleteProperty(${properties[i]?.id})" >Delete</p>
        
        </div>

    </div>`
    }

    main.innerHTML = cards;
}


async function addProperty() {
    let name = document.getElementById("name").value;
    let place = document.getElementById("place").value;
    let rent = document.getElementById("rent").value;
    let advance = document.getElementById("advance").value;
    // let availability = document.getElementById("available").value;
    blockUI();
    var requestOptions = {
        method: 'POST',
        body: JSON.stringify({
            "name": name,
            "location": place,
            "rent_amount": rent,
            "advance_amount": advance
        }),
    };

    await fetch(`${BASE_URL}properties/${user_id}`, requestOptions)
        .then(async response => {
            const res = await response.json();
            console.log(res.response);
            showToast(res.response);
            if (response.status == 200) {
                closeModal();
                getProperties();
            }

        })
        .catch(error => { console.log('error', error); showToast(res.data.response); });

    unblockUI();
}

async function updateProperty() {

    let name = document.getElementById("uname").value;
    let place = document.getElementById("uplace").value;
    let rent = document.getElementById("urent").value;
    let advance = document.getElementById("uadvance").value;

    blockUI();
    var requestOptions = {
        method: 'PUT',
        body: JSON.stringify({
            "name": name,
            "location": place,
            "rent_amount": rent,
            "advance_amount": advance
        }),
        redirect: 'follow'
    };

    await fetch(`${BASE_URL}properties/${update_id}`, requestOptions)
        .then(async response => {
            const res = await response.json();
            showToast(res.response);
            if (response.status == 200) {
                closeUModal();
                getProperties();
            }
        })
        .catch(error => console.log('error', error));
    unblockUI();
}


async function deleteProperty(delete_id) {

    var requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
    };
    blockUI();
    await fetch(`${BASE_URL}properties/${delete_id}`, requestOptions)
        .then(async response => {
            const res = await response.json();
            showToast(res.response);
            if (response.status == 200) {
                getProperties();
            }
        })
        .catch(error => console.log('error', error));
    unblockUI();
}


//ADD PROPERTY
let modal = document.getElementById("modal");
modal.style.display = "none";

function closeModal() {
    modal.style.display = "none";
}

function openModal() {
    modal.style.display = "flex";
}

// UPDATE PROPERTY
let update_id;
let umodal = document.getElementById("update-modal");
umodal.style.display = "none";

function closeUModal() {
    umodal.style.display = "none";
}

function openUModal(id, name, place, rent, advance, availability) {
    update_id = id;
    document.getElementById("uname").value = name;
    document.getElementById("uplace").value = place;
    document.getElementById("urent").value = rent;
    document.getElementById("uadvance").value = advance;
    umodal.style.display = "flex";
}
