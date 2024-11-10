/// <reference types="../@types/jquery" />
let viewData = document.getElementById("viewData");
let searchArea = document.getElementById("searchArea");


$('#icon').on('click',function(){
    if ($("#icon").hasClass("fa-x") == false) {
        $('.Navbar-content').animate({width:'toggle' , paddingInline:'toggle'}    ,1000)
    $('ul li').animate({top:'0' , right:'0' } ,1000)
    
    $('#icon').toggleClass('fa-x')
      } else {

        $('.Navbar-content').animate({width:'toggle' , paddingInline:'toggle'}    ,1000)
    $('ul li').animate({top:'300' , right:'300' } ,1000)
    $('#icon').toggleClass('fa-x')
      }
        
    
    
});

$(document).ready(() => {
  searchByName("").then(() => {
      $(".loading-screen").fadeOut(500)
      $("body").css("overflow", "visible")

  })
})

// search ---------------------------------------------------------------------------------

async function searchByName(term) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
  response = await response.json()
  console.log(response.meals);
  response.meals ? displayData(response.meals) : displayData([])
}
async function searchByFlitter(term) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${term}`)
  response = await response.json()
  console.log(response.meals);
  response.meals ? displayData(response.meals) : displayData([])
}

// display ------------------------------------------------------

function displayData(data){
  let cols = "";

  for (  let i =0   ; i < data.length    ;  i++  ){

    cols+=`
    <div class="col-md-3">
                    <div onclick="getMealDetails('${data[i].idMeal}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src="${data[i].strMealThumb}" alt="" srcset="">
                        <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                            <h3>${data[i].strMeal}</h3>
                        </div>
                    </div>
                </div>
    
    `
  }


  document.getElementById('viewData').innerHTML = cols
}

searchByName("")

// meal details -------------------------------------------------------------------------

async function getMealDetails(mealID) {
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`);
  response = await response.json();
  displayMealDetails(response.meals[0])
}

function displayMealDetails(meal) {
    
  let ingredients = ``

    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients += `<li class="alert alert-info m-2 p-1">${meal[`strMeasure${i}`]} ${meal[`strIngredient${i}`]}</li>`
        }
    }

  

  let tags = meal.strTags?.split(",")
  if (!tags) tags = []

  let tagsStr = ''
  for (let i = 0; i < tags.length; i++) {
      tagsStr += `
      <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`
  }
      let cols = `
      <div class="col-md-4">
  <img class="w-100 rounded-3" src="${meal.strMealThumb}" alt="">
      <h2>${meal.strMeal}</h2>
</div>
<div class="col-md-8">
  <h2>Instructions</h2>
  <p>${meal.strInstructions}</p>
  <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
  <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
  <h3>Recipes :</h3>
  <ul class="list-unstyled d-flex g-3 flex-wrap">
      ${ingredients}
  </ul>

  <h3>Tags :</h3>
  <ul class="list-unstyled d-flex g-3 flex-wrap">
      
  ${tagsStr}
  </ul>

  <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
  <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
</div>`
document.getElementById('viewData').innerHTML = cols
  }




function showSearchInputs() {
  searchArea.innerHTML = `
  <div class="row py-4">
            <div class="col-md-6">
                <input  oninput="searchByName(this.value)"  class="form-control bg-transparent text-white" type="search" placeholder="Search By Name">
            </div>
            <div class="col-md-6">
                <input id="searchFirstLetter" oninput="searchByFlitter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
            </div>
        </div>`
        viewData.innerHTML =""
        $('.Navbar-content').animate({width:'toggle' , paddingInline:'toggle'}    ,1000)
    $('ul li').animate({top:'0' , right:'0' } ,1000)
    
    $('#icon').toggleClass('fa-x')
    $(".loading-screen").fadeOut(300)
    $("body").css("overflow", "visible")
}

// main categories -----------------------------------------------------------------------

async function getCategories(){
  viewData.innerHTML = ""
  $(".loading-screen").fadeIn(300)
  $("body").css("overflow", "hidden")
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/categories.php`)
  response = await response.json()
  
  searchArea.innerHTML = ""
  displayCategories(response.categories)
  $('.Navbar-content').animate({width:'toggle' , paddingInline:'toggle'}    ,1000)
    $('ul li').animate({top:'0' , right:'0' } ,1000)
    
    $('#icon').toggleClass('fa-x')
    $(".loading-screen").fadeOut(300)
    $("body").css("overflow", "visible")
}

// categories -----------------------------------------------------------------------

function displayCategories(data){
  let cols = "";

  for (  let i =0   ; i < data.length    ;  i++  ){

    cols+=`
    <div class="col-md-3">
                    <div onclick="getCategoriMeals('${data[i].strCategory}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                        <img class="w-100" src="${data[i].strCategoryThumb}" alt="" srcset="">
                        <div class="meal-layer position-absolute text-center text-black p-2">
                            <h3>${data[i].strCategory}</h3>
                            <p>${data[i].strCategoryDescription.split(" ").slice(0,20).join(" ")}</p>
                        </div>
                    </div>
                </div>
    
    `
  }
  document.getElementById('viewData').innerHTML = cols;
}


async function getCategoriMeals(categori) {
  $(".loading-screen").fadeIn(300)
    $("body").css("overflow", "hidden")
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${categori}`)
  response = await response.json()
  console.log(response);
  displayData(response.meals.slice(0,20))
  $('.Navbar-content').animate({width:'toggle' , paddingInline:'toggle'}    ,1000)
    $('ul li').animate({top:'0' , right:'0' } ,1000)
    
    $('#icon').toggleClass('fa-x')
    $(".loading-screen").fadeOut(300)
    $("body").css("overflow", "visible")
}

//  area --------------------------------------------------------------------------------

async function getArea() {
  $(".loading-screen").fadeIn(300)
    $("body").css("overflow", "hidden")
  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?a=list`)
  response = await response.json()
  console.log(response.meals);
  displayArea(response.meals)
  $('.Navbar-content').animate({width:'toggle' , paddingInline:'toggle'}    ,1000)
    $('ul li').animate({top:'0' , right:'0' } ,1000)
    
    $('#icon').toggleClass('fa-x')
    $(".loading-screen").fadeOut(300)
    $("body").css("overflow", "visible")
}

function displayArea(data) {
  let cols = "";

  for (  let i =0   ; i < data.length    ;  i++  ){

    cols+=`
    <div class="col-md-3">
                    <div class="rounded-2 text-center cursor-pointer">
                        <i class="bi bi-map" style="font-size: 2rem; color: cornflowerblue;"></i>
                            <h3>${data[i].strArea}</h3>
                        
                    </div>
                </div>
    
    `
  }
  document.getElementById('viewData').innerHTML = cols;
}

// ingredients --------------------------------------------------------------------------

async function getIngredients() {

  $(".loading-screen").fadeIn(300)
    $("body").css("overflow", "hidden")

  let response = await fetch(`https://www.themealdb.com/api/json/v1/1/list.php?i=list`)
  response = await response.json()
  console.log(response.meals);
  displayIngredients(response.meals.slice(0,20))
  $('.Navbar-content').animate({width:'toggle' , paddingInline:'toggle'}    ,1000)
    $('ul li').animate({top:'0' , right:'0' } ,1000)
    
    $('#icon').toggleClass('fa-x')
    $(".loading-screen").fadeOut(300)
    $("body").css("overflow", "visible")
}

function displayIngredients(data) {
  let cols = "";

  for (  let i =0   ; i < data.length    ;  i++  ){

    cols+=`
    <div class="col-md-3">
                    <div class="rounded-2 text-center cursor-pointer">
                        <i class="fa-solid fa-mortar-pestle fa-4x" style="color: #6495ED"></i>
                            <h3>${data[i].strIngredient}</h3>
                            <p>${data[i].strDescription.split(" ").slice(0,20).join(" ")}</p>
                        
                    </div>
                </div>
    
    `
  }
  document.getElementById('viewData').innerHTML = cols;
}

// contact us ---------------------------------------------------------------------------

function showContact() {
  viewData.innerHTML =`
  <div class="contact min-vh-100 d-flex justify-content-center align-items-center">
        <div class="container w-75 text-center">
            <div class="row g-4">
                <div class="col-md-6">
                    <input id="nameInput" oninput="inputsValidation()" type="text" class="form-control" placeholder="Enter Your Name">
                    <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
                </div>
                <div class="col-md-6">
                    <input id="emailInput" oninput="inputsValidation()" type="email" class="form-control" placeholder="Enter Your Email">
                    <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
                </div>
                <div class="col-md-6">
                    <input id="phoneInput" oninput="inputsValidation()" type="number" class="form-control" placeholder="Enter Your Phone">
                    <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
                </div>
                <div class="col-md-6">
                    <input id="ageInput" oninput="inputsValidation()" type="number" class="form-control" placeholder="Enter Your Age">
                    <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
                </div>
                <div class="col-md-6">
                    <input id="passwordInput" oninput="inputsValidation()" type="password" class="form-control" placeholder="Enter Your Password">
                    <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
                </div>
                <div class="col-md-6">
                    <input id="repasswordInput" oninput="inputsValidation()" type="password" class="form-control" placeholder="Repassword">
                    <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
                </div>
            </div>
            <button id="submitBtn" disabled class="btn btn-outline-danger px-2 mt-3">Submit</button>
        </div>
    </div>
  `
  $('.Navbar-content').animate({width:'toggle' , paddingInline:'toggle'}    ,1000)
    $('ul li').animate({top:'0' , right:'0' } ,1000)
    $('#icon').toggleClass('fa-x')

    submitBtn = document.getElementById("submitBtn")
    document.getElementById("nameInput").addEventListener("focus", () => {
      nameInputTouched = true
  })

  document.getElementById("emailInput").addEventListener("focus", () => {
      emailInputTouched = true
  })

  document.getElementById("phoneInput").addEventListener("focus", () => {
      phoneInputTouched = true
  })

  document.getElementById("ageInput").addEventListener("focus", () => {
      ageInputTouched = true
  })

  document.getElementById("passwordInput").addEventListener("focus", () => {
      passwordInputTouched = true
  })

  document.getElementById("repasswordInput").addEventListener("focus", () => {
      repasswordInputTouched = true
  })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;




function inputsValidation() {
  if (nameInputTouched) {
      if (nameValidation()) {
          document.getElementById("nameAlert").classList.replace("d-block", "d-none")

      } else {
          document.getElementById("nameAlert").classList.replace("d-none", "d-block")

      }
  }
  if (emailInputTouched) {

      if (emailValidation()) {
          document.getElementById("emailAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("emailAlert").classList.replace("d-none", "d-block")

      }
  }

  if (phoneInputTouched) {
      if (phoneValidation()) {
          document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

      }
  }

  if (ageInputTouched) {
      if (ageValidation()) {
          document.getElementById("ageAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("ageAlert").classList.replace("d-none", "d-block")

      }
  }

  if (passwordInputTouched) {
      if (passwordValidation()) {
          document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

      }
  }
  if (repasswordInputTouched) {
      if (repasswordValidation()) {
          document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
      } else {
          document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

      }
  }


  if (nameValidation() &&
      emailValidation() &&
      phoneValidation() &&
      ageValidation() &&
      passwordValidation() &&
      repasswordValidation()) {
      submitBtn.removeAttribute("disabled")
  } else {
      submitBtn.setAttribute("disabled", true)
  }
}

function nameValidation() {
  return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
  return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
  return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
  return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
  return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
  return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}


