document.addEventListener("DOMContentLoaded", function () {

  console.log("DOM fully loaded and parsed");

  var form = document.getElementById("form");

  form.onsubmit = function (event) {
    event.preventDefault();

    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "Save",
      denyButtonText: `Don't save`
    }).then((result) => {
      if (result.isConfirmed) {
        var formData = {};
        var inputs = form.querySelectorAll("input, select");

        inputs.forEach(function (input) {
          formData[input.id] = input.value;
        });

        console.log("PUSH opportunity/new");
        console.log(formData);

        Swal.fire("Saved!", "", "success").then(() => {
          var myModal = new bootstrap.Modal(document.getElementById('thankYouModal'), {
            keyboard: false
          });
          myModal.show();
        });
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  };
});
