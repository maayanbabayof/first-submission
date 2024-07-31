const url = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.role == "farmer") {
    const applicationsList = document.getElementById("my-applications-grid");
    console.log(applicationsList);

    fetch(`${url}/api/applications/user/${user.userID}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: user.role,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length === 0) {
        } else {
          data.forEach((card) => {
            const applicationDiv = document.createElement("div");
            applicationDiv.className = "application-div";

            const title = document.createElement("p");
            title.className = "title";
            title.textContent = "Application: " + card.title;

            const description = document.createElement("p");
            description.className = "description";
            description.innerHTML = `
              Volunteer Name: ${card.name} <br>
              Volunteer Age: ${card.age} <br>
              Volunteer City: ${card.u_city} <br>
              Volunteer Address: ${card.u_address} <br>
              Volunteer Phone: ${card.phone} <br>
            `;

            const buttons = document.createElement("div");
            buttons.className = "buttons";

            if (card.status == "pending") {
              const approve = document.createElement("button");
              approve.className = "approve";
              approve.textContent = "Approve";

              const reject = document.createElement("button");
              reject.className = "reject";
              reject.textContent = "Reject";

              approve.addEventListener("click", () =>
                handleStatusChange(
                  card.applicationID,
                  "approved",
                  approve,
                  reject
                )
              );
              reject.addEventListener("click", () =>
                handleStatusChange(
                  card.applicationID,
                  "rejected",
                  approve,
                  reject
                )
              );

              buttons.appendChild(approve);
              buttons.appendChild(reject);
            } else if (card.status == "approved") {
              const approved = document.createElement("button");
              approved.className = "approve";
              approved.textContent = "Status: Approved";
              buttons.appendChild(approved);
            } else {
              const rejected = document.createElement("button");
              rejected.className = "reject";
              rejected.textContent = "Status: Rejected";
              buttons.appendChild(rejected);
            }

            applicationDiv.appendChild(title);
            applicationDiv.appendChild(description);
            applicationDiv.appendChild(buttons);

            applicationsList.appendChild(applicationDiv);
          });
        }
      });
  } else {
    document.getElementsByClassName("container-applications").style.display =
      "none";
  }
});

const handleStatusChange = (
  applicationID,
  status,
  approveButton,
  rejectButton
) => {
  fetch(`${url}/api/applications/update/${applicationID}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      status: status,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        alert("Success");
        approveButton.style.display = "none";
        rejectButton.style.display = "none";
        const statusButton = document.createElement("button");
        statusButton.className = status;
        statusButton.textContent = `Status: ${status.charAt(0).toUpperCase() + status.slice(1)
          }`;
        approveButton.parentNode.appendChild(statusButton);
      } else {
        alert("Failed to update application.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while updating the application.");
    });
};
