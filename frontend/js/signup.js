function signupAPI(name, username, password) {
    const res = fetch(`${BASE_URL}register`, {
        method: 'POST',
        body: JSON.stringify({
            "name": name,
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

    return res;

}

async function signup() {
    let name = document.getElementById('name').value;
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    console.log(name, username, password);

    blockUI();
    if (name.length > 0 && username.length > 0 && password.length > 0) {

        const res = await signupAPI(name, username, password);
        if (res?.status === 200) {
            showToast(res?.data?.response);
        } else {
            showToast(res?.data?.response);
        }
    } else {
        showToast("Fill all the fields");
    }
    unblockUI();
}