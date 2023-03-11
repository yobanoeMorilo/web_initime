
$("#edit_teacher_btn").on('click', function(){
  $("#editModal").modal('show')
  fillFields()
})

$("#close_BTN").on('click', function(){
  $("#editModal").modal('hide')
})


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

function disciplinesFilling(elem){
  sendGetRequest('https://localhost:7272/api/disciplines')
  .then(response => {
    if(response.status == 200){
      return response.json()
    }
  })
  .then(response => {
    setOptionsModal(elem, response)
  })
}

function fillFields(){
  sendGetRequest('https://localhost:7272/api/teachers')
  .then(response => {
    if(response.status == 200){
      return response.json()
    }
  })
  .then(response => {
    setOptionsModal($('#edit_proff'), response)
  })
  disciplinesFilling($('#edit_disc'))

}

async function sendGetRequest(url){
  const response = await fetch(url, {
      method: 'GET',
      headers: new Headers({
        'Content-Type': 'application/json'
    })
    })
  return response;
}

disciplinesFilling($('#add_disc'))