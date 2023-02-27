
$("#tableHolder").bind({
    click: function(event) {
        console.log(event.target)
    }
  });

const inputDirection = $( "#inputDirection" )
const inputFaculty = $( "#inputFaculty" )

inputFaculty.change(function() {
    var str = ""
    $( "#inputFaculty option:selected" ).each(function() {
      str = $( this )
      inputDirection.removeClass('d-none')
      url = `https://localhost:7272/api/direction/${str}`
      sendRequest(url)
      .then(response => response.json())
      .then(response => console.log(response))
    });
})


async function sendRequest(url){
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
      })
    return response;
}

function attachDirections(response){
  response.forEach(element => {
    inputFaculty.append($(`<option id="${element.number}">${element.name}</option>`))
  });
}
let url = 'https://localhost:7272/api/faculty'
sendRequest(url)
.then(response => {
  if(response.ok){
    return response.json();
  }
  //прописать ошибку
})
.then(response => attachDirections(response))