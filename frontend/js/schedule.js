let id = localStorage.getItem('prop_id');
let prop_name = localStorage.getItem('prop_name');
let place = localStorage.getItem('prop_place');
let rent = localStorage.getItem('prop_rent');
let advance = localStorage.getItem('prop_advance');
let availability = localStorage.getItem('prop_availability');


document.getElementById('name').innerHTML = prop_name;
document.getElementById('place').innerHTML = place;
document.getElementById('available').innerHTML = availability == 1 ? "Available" : "Not Available";
document.getElementById('rent').innerHTML = `Rent Amount : $ ${rent}`;
document.getElementById('advance').innerHTML = `Advance Amount : $ ${advance}`;



async function schedule() {
    isLoggedOut();
    let dateTime = document.getElementById('date-input').value;
    if (dateTime.length > 0) {

        const date = new Date(dateTime);

        const formattedDate = date.toISOString().slice(0, 19).replace('T', ' ');
        console.log(dateTime, formattedDate);

        blockUI();
        let user_id = localStorage.getItem("user_id");
        var raw = JSON.stringify({
            "property_id": id,
            "user_id": user_id,
            "date_time": formattedDate
        });

        var requestOptions = {
            method: 'POST',
            body: raw,
            redirect: 'follow'
        };

        await fetch(`${BASE_URL}property/book`, requestOptions)
            .then(response => {
                if (response.status == 200) {
                    showToast("Booked Successfully")
                }
            })
            .then(result => console.log(result))
            .catch(error => console.log('error', error));
        unblockUI();
    } else {
        showToast("Date cannot be empty")
    }

}