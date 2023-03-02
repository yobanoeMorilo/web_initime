const inputFaculty = $( "#inputFaculty" )
const inputGroup = $( "#inputGroup" )
const inputProffessor = $('#inputProffessor')
const inputAuditory = $('#inputAuditory')
const addModal = $("#addModal")
const delModal = $("#delModal")
const editModal = $("#editModal")
const examplePair = $("#template")
const moveNextWeek = $("#next_week")
const movePrevWeek = $("#prev_week")

let editing_cell
let endDate
let startDate
let currentDate


//пагинация

$("#prev_week").on('click', function(){

  endDate.setDate(endDate.getDate() - 7)
  startDate.setDate(startDate.getDate() - 7)
  console.log(startDate.toISOString().slice(0,10), "start\n", "current\n", endDate.toISOString().slice(0,10), "enddate\n")
})

$("#next_week").on('click', function(){
  endDate.setDate(endDate.getDate() + 7)
  startDate.setDate(startDate.getDate() + 7)
  console.log(startDate.toISOString().slice(0,10), "start\n", endDate.toISOString().slice(0,10), "enddate\n")
})

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
    //console.log(url)
    //sendRequest(url)
  });
})  

inputFaculty.change(function() {
    var str = ""
    $('#inputGroup option').remove()
    $('#inputGroup').append($(`<option id="placeHolder">Группа</option>`))

    $( "#inputFaculty option:selected" ).each(function() {
      str = $( this )[0].id
      //var url = `https://localhost:7272/api/direction/${str}`

      //response(url, inputGroup)
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

function checkRoute(target){
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

function dateFinder(){
    const D = new Date();
    const startD = new Date();

    currentDate = D.toISOString().slice(0, 10).replace('-', '.').replace('-', '.')

    D.setDate(D.getDate() - D.getDay() + (D.getDay() ? 7 : 0))
    endDate = D
    //endDate = D.toISOString().slice(0, 10).replace('-', '.').replace('-', '.')

    startD.setDate(D.getDate() - (D.getDay() ? (D.getDay() - 1) : 6))
    startDate = startD
    //startDate = startD.toISOString().slice(0, 10).replace('-', '.').replace('-', '.')

    console.log(startDate, "start\n", currentDate, "current\n", endDate, "enddate\n")
}


function main(){
  dateFinder()
  var target = (document.cookie).split('=')[1]

  if(!checkRoute(target))
    target = sessionStorage.getItem('mainPageSession')

  if(!checkRoute(target))
    window.location.href = "path.html";
}

main()