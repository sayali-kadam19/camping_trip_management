

function loginAPI(username, password, userType) {
    const res = fetch(`${BASE_URL}login/${userType}`, {
        method: 'POST',
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
        .then(async (response) => {
            const res = await response.json();
            const resStatus = {
                status: response.status,
                data: res
            }
            console.log(resStatus);
            return resStatus;
        })
        .catch(error => console.error('Error:', error));

    console.log(res);
    return res;
}

function changeUserType(evt) {
    console.log(evt.target.value)
}


async function login() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let userType = document.getElementById('user-type').checked;
    console.log(username, password, userType);
    blockUI();
    if (username.length > 0 && password.length > 0) {

        const res = await loginAPI(username, password, userType ? "owner" : "user");
        if (res?.status === 200) {
            localStorage.setItem("username", username);
            localStorage.setItem("user_id", res?.data?.data?.id);
            localStorage.setItem("isOwner", userType);
            if (userType) {
                window.location.href = "./admin-property.html";
            } else {
                window.location.href = "./home.html";
            }

        } else {
            showToast(res?.data?.response);
        }
    } else {
        showToast("Fill all the fields");
    }
    unblockUI();
}
