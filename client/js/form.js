document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("form");

  form.onsubmit = function (event) {
    event.preventDefault();

    var formData = {};
    var inputs = form.querySelectorAll("input, select");

    inputs.forEach(function (input) {
      formData[input.id] = input.value;
    });

    console.log("PUSH opportunity/new");
    console.log(formData);

    var myModal = new bootstrap.Modal(document.getElementById('thankYouModal'), {
      keyboard: false
    });
    myModal.show();
  };
});
