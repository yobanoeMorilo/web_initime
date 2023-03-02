$("#log_in").bind({
    click: function() {
        loginRequest()
    }
  });


function loginRequest(){
    const pwd = $("#pwd_field")
    const pwd_req = $("#pwd_req_field")
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
    /*sendLoginRequest(data)*/
    console.log(data)
}

function checkEmail(email){
    const re = new RegExp("^([a-z0-9]|_|\-|\!|\$|\#|\&)+@([a-z0-9]+\.)*([a-z0-9])+$")
    return email.match(re)
}

async function sendLoginRequest(data){
    let url = '' 
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return response.json()
}