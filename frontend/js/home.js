let properties = [];

async function getProperties() {
    isLoggedOut();
    blockUI();
    await fetch(`${BASE_URL}properties`)
        .then(async response => {
            const res = await response.json();
            console.log(res);
            properties = res.data;
            getPropertyCards();
        })
        .catch(error => console.log('error', error));
    unblockUI();
}

function getPropertyCards() {
    let cards = "";
    let main = document.getElementById("home-main");
    const images = ["../images/property_1.jpg", "../images/property_2.jpg", "../images/property_3.jpg"];
    for (let i = 0; i < properties.length; i++) {
        cards += ` <div class="rental-card" onclick="goToSchedule(${properties[i]?.id}, '${properties[i]?.name}', '${properties[i]?.location}',${properties[i]?.rental_amount}, ${properties[i]?.advance_amount}, ${properties[i]?.availability}  )" >
        <img
            src= "${images[i]}"/>

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

    </div>`
    }

    main.innerHTML = cards;
}

function searchProperties() {
    let pname = document.getElementById('property-input').value;
    let main = document.getElementById('home-main');

    console.log(pname);
    let cards = "";
    const images = ["../images/property_1.jpg", "../images/property_2.jpg", "../images/property_3.jpg"];
    for (let i = 0; i < properties?.length; i++) {
        if (properties[i]?.name.toLowerCase().includes(pname) || properties[i]?.location.toLowerCase().includes(pname)) {
            cards += ` <div class="rental-card" onclick="goToSchedule(${properties[i]?.id}, '${properties[i]?.name}', '${properties[i]?.location}',${properties[i]?.rental_amount}, ${properties[i]?.advance_amount}, ${properties[i]?.availability}  )" >
                            <img
                                src= "${images[i]}" />

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

                        </div>`
        }
    }

    main.innerHTML = cards;
}

function goToSchedule(id, name, location, rental_amount, advance_amount, availability) {
    localStorage.setItem("prop_id", id);
    localStorage.setItem("prop_name", name);
    localStorage.setItem("prop_place", location);
    localStorage.setItem("prop_rent", rental_amount);
    localStorage.setItem("prop_advance", advance_amount);
    localStorage.setItem("prop_availability", availability);
    window.location.href = "./schedule.html";
}