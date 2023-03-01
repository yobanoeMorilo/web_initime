const inputDirection = $( "#inputDirection" )
const inputFaculty = $( "#inputFaculty" )
const inputGroup = $( "#inputGroup" )
const inputProffessor = $('#inputProffessor')
const inputAuditory = $('#inputAuditory')
const addModal = $("#addModal")
const delModal = $("#delModal")
const editModal = $("#editModal")
const examplePair = $("#template")

let editing_cell

//Логика модальных окон

$("#edit_btn_modal").on('click', function(){

  //запрос
  let proff = $("#edit_discipline").val()
  let audit = $("#edit_auditory").val()
  let discip = $("#edit_discipline").val()
  let type = $("#edit_type").val()

  $(editing_cell).find('#Lesson').text(discip);
  $(editing_cell).find('#Auditory').text(audit);
  $(editing_cell).removeClass()
  $(editing_cell).addClass("timeslot")
  choseType($(editing_cell), type)

  editModal.modal('hide')

  editing_cell = null
})

$("#addPairBtn").on('click', function(){

  addPairModal(editing_cell)
  addModal.modal('hide')

})

$("#deletePair").on('click', function(){
  //send delete request and recieve an good awnser
  deletePairModal(editing_cell)
  delModal.modal('hide')

})

//Функционал открытия / закрытия модальных окон

$("#close_BTN").on('click', function(){
  addModal.modal('hide')
})

$("#disableModal").on('click', function(){
  delModal.modal('hide')
  editModal.modal('show')
})

$("#delete_btn").on('click', function(){
  editModal.modal('hide')
  delModal.modal('show')
})

$("#tableHolder tbody tr td ").on('click', function(event){

    if(event.target.localName == "td") {
      editing_cell = event.currentTarget
      addModal.modal('show')
    }

    if(event.target.localName == "div") {
      editing_cell = event.currentTarget.lastElementChild
      editModal.modal('show')
    }
  })

inputGroup.change(function() {
  var str = ""
  $( "#inputGroup option:selected" ).each(function() {
    str = $( this )[0].id
    url = `https://localhost:7272/api/schedule/group/${str}`
    console.log(url)
    sendRequest(url)
  });
})  

inputDirection.change(function() {
  var str = ""
  $('#inputGroup option').remove()
  $('#inputGroup').append($(`<option id="placeHolder">Группа</option>`))
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
    $('#inputGroup').append($(`<option id="placeHolder">Группа</option>`))
    $('#inputDirection').append($(`<option id="placeHolder">Направление</option>`))

    $( "#inputFaculty option:selected" ).each(function() {
      str = $( this )[0].id
      var url = `https://localhost:7272/api/direction/${str}`

      response(url, inputDirection)
    });
})

function addPairModal(elem){
  let pair = examplePair.clone()
  //запрос
  let proff = $("#add_discipline").val()
  let audit = $("#add_auditory").val()
  let discip = $("#add_discipline").val()
  let type = $("#add_type").val()

  choseType(pair, type)
  pair.id = ""
  pair.find("#Lesson").text(discip)
  pair.find("#Auditory").text(audit)

  elem.append(pair[0])
}

function deletePairModal(elem){
  elem.remove()
}

function choseType(elem, type){
  switch (type){
    case 'Лекция': elem.addClass("lection")
      break;
    case 'Семинар': elem.addClass("seminar")
      break;
    case 'Практика': elem.addClass("practice")
      break;
    case 'Контрольная точка': elem.addClass("control")
      break;
  }
}

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

  sessionStorage.setItem('mainPageSession', 'teacher')

  response(url, inputProffessor)
}

function navAuditory(){
  inputAuditory.removeClass("d-none")

  sessionStorage.setItem('mainPageSession', 'auditory')

  let url = 'https://localhost:7272/api/auditories'
  response(url, inputAuditory)
}

function navGroup(){
  inputDirection.removeClass("d-none")
  inputFaculty.removeClass("d-none")
  inputGroup.removeClass("d-none")

  sessionStorage.setItem('mainPageSession', 'group')

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

function checkCookies(target){
  switch(target){
    case "auditory" : navAuditory()
    return true
    case "teacher" : navTeacher()
    return true
    case "group" : navGroup()
    return true
    default: return false
  }
}


function main(){
  var target = (document.cookie).split('=')[1]

  if(!checkCookies(target))
    target = sessionStorage.getItem('mainPageSession')

  if(!checkCookies(target))
    window.location.href = "path.html";
}

main()