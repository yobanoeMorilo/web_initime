
$("#group_btn").bind({
    click: function() {

        document.cookie = "target=group; max-age=600";
        window.location.href = "MainPage.html";
    }
  });

$("#teacher_btn").bind({
    click: function() {
      document.cookie = "target=teacher; max-age=600";
      window.location.href = "MainPage.html";
    }
});
$("#auditory_btn").bind({
  click: function() {
    document.cookie = "target=auditory; max-age=600";
    window.location.href = "MainPage.html";
  }
});

async function sendRequest(){
  url = ""
  const response = await fetch(url, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    }
  })
  return response;
}


function AuthorizeRequest(){
  sendRequest()
  .then(response => {
    return response.json()
  })
  .then()
}

function checkAuthorization(){
  if (localStorage.getItem('token') == null || AuthorizeRequest())
    window.location.href = "login.html";
}

//checkAuthorization()

