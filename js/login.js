$("#log_in").bind({
    click: function() {
        loginRequest()
    }
});
$('#hoverCard').hover(function(){
    $(".flip-card-inner").addClass('fliped')
});

function loginRequest(){
    const pwd = $("#pwd_field")
    const email = $("#email_field")


    if (pwd.val() == null){
        pwd.addClass("wrong")
        $("#pwd").addClass("wrong")
        return
    }
    
    if (checkEmail(email.val()) == null){
        email.addClass("wrong")
        $("#email").addClass("wrong")
        alert("this email format does not support")
        return
    }

    const data = {
        "email":  email.val(),
        "password": pwd.val()
    }
    sendLoginRequest(data)
    .then(response =>{
        if (response.status == 200){
            return response.json();
        }
    })
    .then(response => {
        console.log(response.token, "after")
        window.sessionStorage.setItem('token', response.token)
        window.location.href = "path.html"
    })
}

function checkEmail(email){
    const re = new RegExp("^([a-z0-9]|_|\-|\!|\$|\#|\&)+@([a-z0-9]+\.)*([a-z0-9])+$")
    return email.match(re)
}

async function sendLoginRequest(data){
    let url = 'https://localhost:7272/api/admin/login' 
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response;
}