
$("#tableHolder").bind({
    click: function(event) {
        console.log(event.target)
    }
  });

$( "#inputFaculty" ).change(function() {
    var str = ""
    $( "#inputFaculty option:selected" ).each(function() {
      str = $( this ).text()
    });
    console.log(str)
})

var faculty
var direction
var group

async function sendRequest(url){
    const response = await fetch(url, {
        method: 'GET',
        mode : 'no-cors',
        headers: {
            'Content-Type': 'application/json',
        }
      })
    return response;
}

function attachDirections(){

}
let url = 'https://localhost:7272/api/faculty'
sendRequest(url)
.then(response => response.json())
.then (response => console.log(response))