const url = "https://web2-project-pvk5.onrender.com";

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("add-opportunity-form")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const user = JSON.parse(sessionStorage.getItem("user"));
      let userID = user.userID ? user.userID : "";
      let userRole = user.role ? user.role : "";
      const formData = {
        userID: userID,
        role: userRole,
        title: document.getElementById("title").value,
        region: document.getElementById("region").value,
        city: document.getElementById("city").value,
        img: document.getElementById("img").value,
        date: document.getElementById("date").value,
        description: document.getElementById("description").value,
        rate: 0,
        reviews: 0,
      };


      Swal.fire({
        title: "Are you sure?",
        text: "Do you want to create this opportunity?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Save",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            console.log("Creating opportunity:", formData);
            const response = await fetch(`${url}/api/opportunities/create`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formData),
            });

            if (response.ok) {
              Swal.fire(
                "Saved!",
                "Your opportunity has been created.",
                "success"
              ).then(() => {
                window.location.href = "list.html";
              });
            } else {
              const errorData = await response.json();
              Swal.fire("Error", errorData.error, "error");
            }
          } catch (error) {
            console.error("Error creating opportunity:", error);
            Swal.fire(
              "Error",
              "Failed to create opportunity. Please try again.",
              "error"
            );
          }
        }
      });
    });
});
