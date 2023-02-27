const inputDirection = $( "#inputDirection" )
const inputFaculty = $( "#inputFaculty" )
const inputGroup = $( "#inputGroup" )
const inputProffessor = $('#inputProffessor')
const inputAuditory = $('#inputAuditory')

$("#tableHolder").bind({
    click: function(event) {
        console.log(event.target)
    }
  });

inputDirection.change(function() {
  var str = ""
  $('#inputGroup option').remove()
  
  $( "#inputDirection option:selected" ).each(function() {
    str = $( this )[0].id
    url = `https://localhost:7272/api/groups/${str}`
    response(url)
  });
})


inputFaculty.change(function() {
    var str = ""
    $('#inputDirection option').remove()
    $('#inputGroup option').remove()

    $( "#inputFaculty option:selected" ).each(function() {
      str = $( this )[0].id
      var url = 'https://localhost:7272/api/direction/${str}'
      response(url)
    });
})

function response(url){
  sendRequest(url)
    .then(response => {
      if(response.ok){
        return response.json();
      }
    })
    .then(response => {
      let elem = inputDirection
      attachDirections(response, elem)
    })
}
function navTeacher(){
  inputProffessor.removeClass("d-none")
}
function navAuditory(){
  inputAuditory.removeClass("d-none")
}
function navGroup(){
  inputDirection.removeClass("d-none")
  inputFaculty.removeClass("d-none")
  inputGroup.removeClass("d-none")
}

async function sendRequest(url){
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
      })
    return response;
}

function attachDirections(response, elem){
  response.forEach(element => {
    elem.append($(`<option id="${element.number}">${element.name}</option>`))
  });
}


function main(){
  var target = (document.cookie).split('=')[1]
  switch(target){
    case "auditory" : navAuditory()
    break;
    case "teacher" : navTeacher()
    break;
    case "group" : navGroup()
    break;
  }
  let url = 'https://localhost:7272/api/faculties'
  response(url)
}

main()