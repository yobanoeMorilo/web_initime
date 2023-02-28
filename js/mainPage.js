const inputDirection = $( "#inputDirection" )
const inputFaculty = $( "#inputFaculty" )
const inputGroup = $( "#inputGroup" )
const inputProffessor = $('#inputProffessor')
const inputAuditory = $('#inputAuditory')
const addModal = $("#addModal")
const delModal = $("#delModal")

$("#disableModal").on('click', function(){
  delModal.modal('hide')
})


  $("#tableHolder tbody tr td ").on('click', function(event){
    console.log(event.target.localName == "td")
    if(event.target.localName == "td") {
      addModal.modal('show')
    }

    if(event.target.localName == "div") {
      delModal.modal('show')
    }
  })

inputDirection.change(function() {
  var str = ""
  $('#inputGroup option').remove()
  
  $( "#inputDirection option:selected" ).each(function() {
    str = $( this )[0].id
    url = `https://localhost:7272/api/groups/${str}`
    response(url, inputGroup)
  });
})


inputFaculty.change(function() {
    var str = ""
    $('#inputDirection option').remove()
    $('#inputGroup option').remove()

    $( "#inputFaculty option:selected" ).each(function() {
      str = $( this )[0].id
      var url = `https://localhost:7272/api/direction/${str}`

      response(url, inputDirection)
    });
})

function response(url, elem){
  sendRequest(url)
    .then(response => {
      if(response.ok){
        return response.json();
      }
    })
    .then(response => {
      console.log(response)
      attachDirections(response, elem)
    })
}

function navTeacher(){
  inputProffessor.removeClass("d-none")
  let url = 'https://localhost:7272/api/teachers'

  response(url, inputProffessor)
}

function navAuditory(){
  inputAuditory.removeClass("d-none")

  let url = 'https://localhost:7272/api/auditories'
  response(url, inputAuditory)
}

function navGroup(){
  inputDirection.removeClass("d-none")
  inputFaculty.removeClass("d-none")
  inputGroup.removeClass("d-none")

  let url = 'https://localhost:7272/api/faculties'
  response(url, inputFaculty)
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
}

main()