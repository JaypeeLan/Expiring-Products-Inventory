const inpvalue = document.querySelector("#inputItem");
const btn = document.querySelector("#btn");
const inpDate = document.querySelector("#dateInput");
let dataO = document.querySelector("#isOutput");
const form = document.getElementById("form");

window.addEventListener("load", displayData);
var todayDate = new Date();
var day = 1000 * 60 * 60 * 24; //day in milliseconds

const signIn = (e) => {
  var expDate = new Date(inpDate.value); //expiring date of the item
  var noOfTimeToExpire = expDate.getTime() - todayDate.getTime(); //subtract expiring date from current date (day the item was logged) in milliseconds
  var noOfDaysLeft = Math.round(noOfTimeToExpire / day); //convert from milliseconds to days

  itemDetails = JSON.parse(localStorage.getItem("itemDetails")) || [];
  let item = {
    text: inpvalue.value,
    days: noOfDaysLeft,
  };
  itemDetails.push(item); //push details to local storage array

  localStorage.setItem("itemDetails", JSON.stringify(itemDetails)); //add the item to the local storage
  form.reset();
  displayData(); //display whatever we have in the local storage
  e.preventDefault();
};

function displayData() {
  if (localStorage.getItem("itemDetails")) {
    dataO.innerHTML = " ";
    let allItems = JSON.parse(localStorage.getItem("itemDetails"));

    allItems.forEach((items) => {
      const status = document.createElement("p");
      const deleteBtn = document.createElement("button");
      const container = document.createElement("div"); //wrapper to container our data and delete button
      deleteBtn.innerHTML = "delete";

      if (items.days <= 5) {
        status.innerHTML = "Consider replacing";
        container.classList.add("warning");
        container.innerHTML += `                          
                                <p> ${items.text} </p>
                                <p> ${items.days} days </p>
                            `;
      } else {
        status.innerHTML = "Okay";
        container.innerHTML += `
                                <p> ${items.text} </p>
                                <p> ${items.days} days</p>     
                            `;
      }
      container.appendChild(status);
      container.appendChild(deleteBtn);
      dataO.appendChild(container); //append the container to our output div to display it

      deleteBtn.addEventListener("click", () => {
        allItems = allItems.filter((i) => i != items); //takes the particular and checks if the object matches any object in our local storage
        localStorage.setItem("itemDetails", JSON.stringify(allItems));
        displayData();
      });
    });
  }
}

//updates expiring date
// get the current date, subtract it from the remaining days left for the item to expire then updates the inventory and displays the new data
function updateExpiringDate() {
  let allItems = JSON.parse(localStorage.getItem("itemDetails"));
  allItems.forEach((items) => {
    setInterval(() => {
      updatedDays = items.days - 1;
      items.days = updatedDays;
      localStorage.setItem("itemDetails", JSON.stringify(allItems));
      displayData();
    }, day);
  });
}

updateExpiringDate();
