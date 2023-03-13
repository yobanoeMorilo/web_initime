const inputFaculty = $( "#inputFaculty" )
const inputGroup = $( "#inputGroup" )
const addModal = $("#addModal")
const delModal = $("#delModal")
const editModal = $("#editModal")
const examplePair = $("#template")
const moveNextWeek = $("#next_week")
const movePrevWeek = $("#prev_week")

let requestEditDay
let requestEditPair
let groupSelected
let editing_cell
let endDate
let startDate
let editUrl


//пагинация

$("#prev_week").on('click', function(){

  endDate.setDate(endDate.getDate() - 7)
  startDate.setDate(startDate.getDate() - 7)
  setDates()
  getSchedule(makeRequest())
})

$("#next_week").on('click', function(){
  endDate.setDate(endDate.getDate() + 7)
  startDate.setDate(startDate.getDate() + 7)
  setDates()
  getSchedule(makeRequest())
})

//Логика модальных окон

$("#edit_btn_modal").on('click', function(){

  let groups = pickSelectGroups()
  let proff = $("#edit_proffessor")[0]
  let audit = $("#edit_auditory").val()
  let discip = $("#edit_discipline")[0]
  let type = translateType($("#edit_type").val())
  let date = new Date(startDate.getTime() + parseInt(requestEditDay-1)*24*60*60*1000).toISOString()
  let reProf = $(proff).find('option:selected')[0].id
  let reDiscip = $(discip).find('option:selected')[0].id

  var data = {
    "date": date,
    "pairNumber": requestEditPair,
    "type": type,
    "professor": reProf,
    "groups": groups,
    "discipline": reDiscip,
    "auditory": audit
  }

  sendPutRequest(`https://localhost:7272/api/admin/edit/pair/${editUrl}`, JSON.stringify(data))
  .then(response => {
    if (response.status == 200)
    return response.json()
  })
  .then(response =>{
      getSchedule(makeRequest())
      console.log(response)
  })
  editModal.modal('hide')
})


function pickSelectGroups(){
  var selected = $("#inputGroup").find("option:selected");
  var result = []
  selected.each(function(){
    result.push($(this).val());
  });
  console.log(result, "result")
  return result
}

function translateType(type){
  switch(type){
      case "Лекция":
        return "Lection"
      case "Семинар":
        return "Seminar"
      case "Контрольная точка":
        return "Control"
      case "Практика":
        return "Practice"
  }
}

$("#addPairBtn").on('click', function(){

  let groups = pickSelectGroups()
  let proff = $("#add_proffessor")[0]
  let audit = $("#add_auditory").val()
  let discip = $("#add_discipline")[0]
  let type = translateType($("#add_type").val())
  let date = new Date(startDate.getTime() + parseInt(requestEditDay-1)*24*60*60*1000).toISOString()/*.slice(0,10).split('-')
  date = date[1] + '-' + date[2] + '-' + date[0]*/
  let reProf = $(proff).find('option:selected')[0].id
  let reDiscip = $(discip).find('option:selected')[0].id

  var data = {
    "date": date,
    "pairNumber": requestEditPair,
    "type": type,
    "professor": reProf,
    "groups": groups,
    "discipline": reDiscip,
    "auditory": audit
  }

  sendPostRequest("https://localhost:7272/api/admin/add/pair", JSON.stringify(data))
  .then(response => {
    if (response.status == 200)
    return response.json()
  })
  .then(response =>{
      getSchedule(makeRequest())
      console.log(response)
  })
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
      var dateEdit = editing_cell.id.split('_')
      requestEditDay = dateEdit[0]
      requestEditPair = dateEdit[1]
      console.log(dateEdit)
      addPairModal()
      addModal.modal('show')
    }

    if(event.target.localName == "div") {
      let first_id = event.target.parentElement.id
      let second_id = event.target.id
      let pairId 
      if (first_id.indexOf('_') == -1){
          pairId = second_id
      }
      else{
          pairId = first_id
      }
      console.log(pairId)

      editUrl = pairId
      editPairModal()
      editModal.modal('show')
    }
  })

inputFaculty.change(function() {
    var str = ""
    $("#inputGroup").find('option').remove();
    $("#inputGroup").selectpicker('refresh');

    var str = $( "#inputFaculty").find("option:selected")[0].id
    var url = `https://localhost:7272/api/groups/${str}`

    attachGroup(url)
    
})

function makeRequest(){
  var str = pickSelectGroups()
  var url = `https://localhost:7272/api/schedule/group?`
  str.forEach(element => {
    url += `number=${element}&`
  }); 
  var startTime = new Date(startDate.getTime())
  var endTime = new Date(endDate.getTime() + 24*60*60*1000) 
  startTime = startTime.toISOString()
  endTime = endTime.toISOString()
  url += `startDate=${startTime}&`
  url += `endDate=${endTime}`
  $('.timeslot').remove()
  return url
}

inputGroup.change(function() { //--------------------------------------------- get schedule
  getSchedule(makeRequest())
})

$("#add_discipline").change(function(){
  var result = $(this).find("option:selected")[0].id
  url = `https://localhost:7272/api/teachers/${result}`
  sendGetRequest(url)
  .then(response => {
    if (response.status == 200){
      return response.json()
    }
  })
  .then(response => {
    setOptionsModal($("#add_proffessor"), response)
  })
})

function getSchedule(url){
  sendGetRequest(url)
  .then(response => {
    if (response.status == 200){
      return response.json()
    }
  })
  .then(response => {
    console.log(response)
    fillPairsSchedule(response.days)
  })
}

function fillPairsSchedule(response){
  response.forEach(element => {
    let day = selectDay(element.day.split(' ')[0].split('.')[0])
    element.timeslot.forEach(elem=>{
      elem.pairs.forEach(pair =>{
        var Pair = parseInt(elem.slotNumber)
        var insertElem = $("#template").clone()
          insertElem.find('#Lesson').text(pair.discipline)
          insertElem.find('#Auditory').text(pair.auditory)
          insertElem.find('#Proffessor').text(pair.proffessor)
          insertElem[0].id = pair.pairId
          insertElem.addClass('timeslot')
          choseType(insertElem, pair.lessonType)
          console.log($(`#${day}_${Pair}`)[0])
          $(`#${day}_${Pair}`).append(insertElem)
      })
    })
  });
}

function selectDay(day){
  return parseInt(day) - parseInt(startDate.getDate()) + 1
}


function setOptionsModal(elem, response){
  elem.find('option').remove();
  elem.selectpicker('refresh');
  response.forEach(element => {
      elem.append(`<option value="${element.number}" id='${element.id}'>${element.name}</option>`);

    elem.val(element.name);

    // Refresh the selectpicker
    elem.selectpicker("refresh");
  });
}

function addPairModal(){
  /* ----- Предметы в модальном окне-----*/ 
  var faculty = $("#inputFaculty").find("option:selected")[0].id
  console.log(faculty)
  let url = `https://localhost:7272/api/disciplines/${faculty}`
  sendGetRequest(url)
  .then(response => {
    if (response.status == 200){
      return response.json()
    }
  })
  .then(response => {
    setOptionsModal($("#add_discipline"), response)
  })

  url = `https://localhost:7272/api/auditories`
  sendGetRequest(url)
  .then(response => {
    if (response.status == 200){
      return response.json()
    }
  })
  .then(response => {
    setOptionsModal($("#add_auditory"), response)
  })
}

function editPairModal(){
  /* ----- Предметы в модальном окне-----*/ 
  var faculty = $("#inputFaculty").find("option:selected")[0].id
  console.log(faculty)
  let url = `https://localhost:7272/api/disciplines/${faculty}`
  sendGetRequest(url)
  .then(response => {
    if (response.status == 200){
      return response.json()
    }
  })
  .then(response => {
    setOptionsModal($("#edit_discipline"), response)
  })

  url = `https://localhost:7272/api/auditories`
  sendGetRequest(url)
  .then(response => {
    if (response.status == 200){
      return response.json()
    }
  })
  .then(response => {
    setOptionsModal($("#edit_auditory"), response)
  })
}

function deletePairModal(elem){
  elem.remove()
}

function choseType(elem, type){
  switch (type){
    case 'Lection': elem.addClass("lection")
      break;
    case 'Seminar': elem.addClass("seminar")
      break;
    case 'Practice': elem.addClass("practice")
      break;
    case 'Control': elem.addClass("control")
      break;
}
}

async function sendPostRequest(url, data){
  const response = await fetch(url, {
      method: 'POST',
      headers: {
        "accept": "*/*" ,
        "Accept-Encoding" : [
          "gzip", "deflate", "br"
        ],
        "Connection": "keep-alive",
        'Authorization': "Bearer " + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
    },
    body: data
    })
  return response;
}
async function sendPutRequest(url){
  const response = await fetch(url, {
      method: 'PUT',
      headers: {
        "accept": "*/*" ,
        "Accept-Encoding" : [
          "gzip", "deflate", "br"
        ],
        "Connection": "keep-alive",
        'Authorization': "Bearer " + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
    },
    body: data
    })
  return response;
}
async function sendDeleteRequest(url){
  const response = await fetch(url, {
      method: 'DELETE',
      headers: new Headers({
        'Authorization': "Bearer " + sessionStorage.getItem('token'),
        'Content-Type': 'application/json'
    })
    })
  return response;
}

async function sendGetRequest(url){
    const response = await fetch(url, {
        method: 'GET',
        headers: new Headers({
          'Authorization': "Bearer " + sessionStorage.getItem('token'),
          'Content-Type': 'application/json'
      })
      })
    return response;
}

function attachFaculty(url){
  sendGetRequest(url)
  .then(response =>{
    if (response.status == 200){
      return response.json() ;
    }
  })
  .then(response => {
    setOptionsModal(inputFaculty, response)
  })
}

function attachGroup(url){
  sendGetRequest(url)
  .then(response =>{
    if (response.status == 200){
      return response.json() ;
    }
  })
  .then(response => {
    console.log(response)
    response.forEach(element => {
      $("#inputGroup").append(`<option value="${element.number}" id='${element.id}'>${element.number}</option>`);
  
      $("#inputGroup").val(element.name);
  
      // Refresh the selectpicker
      $("#inputGroup").selectpicker("refresh");
    });
  })

}
function dateFinder(){
  const D = new Date();
  //date.toJSON(); // this is the JavaScript date as a c# DateTime
  const startD = new Date();

  currentDate = D.toISOString().slice(0, 10)

  D.setDate(D.getDate() - D.getDay() + (D.getDay() ? 7 : 0))
  endDate = D

  startD.setDate(D.getDate() - (D.getDay() ? (D.getDay() - 1) : 6))
  startDate = startD

  console.log(startDate, "start\n", currentDate, "current\n", endDate, "enddate\n")
}

function translateDayTags(date){
  switch(date){
    case 'Mon':
      return 'Понедельник'
    case 'Tue':
      return 'Вторник'
    case 'Wed':
      return 'Среда'
    case 'Thu':
      return 'Четверг'
    case 'Fri':
      return 'Пятница'
    case 'Sat':
      return 'Суббота'
  }
}

function translateMonths(date){
  switch(date){
    case 'Jan':
      return 'Января'
    case 'Feb':
      return 'Февраля'
    case 'Mar':
      return 'Марта'
    case 'Apr':
      return 'Апреля'
    case 'May':
      return 'Мая'
    case 'Jun':
      return 'Июня'
    case 'Jul':
        return 'Июля'
    case 'Aug':
        return 'Августа'
    case 'Sep':
        return 'Сентября'
    case 'Oct':
        return 'Октября'
    case 'Nov':
        return 'Ноября'
    case 'Dec':
        return 'Декабря'
  }
}

function setDates(){
  for(var i = 1; i < 7; i++){
    let date = new Date(startDate.getTime() + parseInt(i-1)*24*60*60*1000).toDateString().slice(0,10).split(' ')
    $(`.date_${i}`).text(date[2] +' '+ translateMonths(date[1]))
    $(`.day-tag_${i}`).text(translateDayTags(date[0]))
  }
}


function checkAuthorization(){
  if(sessionStorage.getItem('token') == null)
    window.location.href = "path.html";
}

function main(){
  dateFinder()
  setDates()
  checkAuthorization()
  attachFaculty('https://localhost:7272/api/faculties')
}

main()