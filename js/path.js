
$("#group_btn").bind({
    click: function() {

        document.cookie = "target=group; max-age=1";
        window.location.href = "MainPage.html";
    }
  });

$("#teacher_btn").bind({
    click: function() {
      document.cookie = "target=teacher; max-age=1";
      window.location.href = "MainPage.html";
    }
  });
  $("#auditory_btn").bind({
    click: function() {
      document.cookie = "target=auditory; max-age=1";
      window.location.href = "MainPage.html";
    }
  });

