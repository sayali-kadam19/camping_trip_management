const BASE_URL = "http://3.147.57.198/";

function showToast(msg) {
    var snackBar = document.getElementById("snackbar");
    snackBar.innerHTML = msg;
    snackBar.className = "show";
    setTimeout(function () { snackBar.className = snackBar.className.replace("show", ""); }, 3000);
}

function blockUI() {
    var blockUI = document.getElementById("ui-blocker");
    blockUI.style.display = "block";
}

function unblockUI() {
    var blockUI = document.getElementById("ui-blocker");
    blockUI.style.display = "none";
}

function goToHome() {
    window.location.href = "./home.html";
}

function goToBookings() {
    window.location.href = "./bookings.html";
}

function goToAdminBookings() {
    window.location.href = "./admin-bookings.html";
}

function goToProperty() {
    window.location.href = "./admin-property.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "./index.html";
}

function isLoggedIn() {
    let userType = localStorage.getItem("isOwner");
    if (userType !== null) {
        if (userType == 'true') {
            window.location.href = "./admin-property.html";
        } else {
            window.location.href = "./home.html";
        }
    }
}


function isLoggedOut() {
    let userType = localStorage.getItem("isOwner");
    if (userType == null) {
        window.location.href = "./index.html";
    }
}

