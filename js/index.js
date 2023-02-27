urlJSON_Books = 'http://localhost:3000/books'
urlJSON_Users = 'http://localhost:3000/users'
currentUser = undefined
/*
json data structure-books: id, title, subtitle, description, author, img_url, users[array], users[array].id, users[array].username
json data structure-users: id, username
*/
// GET all users -> randomly select one

// GET all data -> pull list of titles -> add list of titles to DOM + eventlistener to each title

// when user clicks title -> GET (single) data for that title -> add book info to DOM + event listener for like /unlike button
    // -> when button is being built, check if current user is in like list : yes => unlike no => like

// when button is pressed -> get data for user -> invert likes / unlikes -> PATCH data -> update like list on DOM







function updateLikeStatus(e){
    //e.target.id

}



function buildBookDetails(obj){
    const divShowPanel = document.getElementById('show-panel')

    divShowPanel.innerHTML = 
        `<img src = ${obj.img_url}>
        <h1>${obj.title}</h1>
        <h2>${obj.subtitle}</h2>
        <h3>${obj.author}</h3>
        <p>${obj.description}</p>`

    const ulList = document.createElement('ul')
    obj.users.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username
        ulList.append(li)
    })

    divShowPanel.append(ulList)


    const likeStatus = Boolean(obj.users.find(element => element.username === currentUser))
    const button = document.createElement('button')
    button.id = obj.id

    if (likeStatus){
        button.innerText = "Unlike"
    } else {
        button.innerText = 'Like'
    }

    button.addEventListener('click', updateLikeStatus)
    divShowPanel.append(button)

}

// THIS USES BOOK TITLE TO SEARCH FOR BOOK. YIELDS SINGLE RESULT BUT WITHIN AN ARRAY
function getBookDetails(title){
    const titleFormated = encodeURIComponent(title).trim()      //need to format title so that it's URL compatible

    fetch(`${urlJSON_Books}?title_like=${titleFormated}`)
    .then(response => response.json())
    .then(data => buildBookDetails(data[0]))
}



// Builds book title list and adds event listener to each title
function buildBookList(array){
    const ulList = document.getElementById('list')

    array.forEach(obj => {
        const li = document.createElement('li')
        li.innerText = obj.title

        li.addEventListener('click', () => getBookDetails(obj.title))   //IMPORTANT: I'M PASSING THE TITLE, NOT THE BOOK ID
        ulList.append(li)
    })
}



function selectUser(array){
    currentUser = array[Math.floor(Math.random()*array.length)].username
    console.log(currentUser)
}



// get both user data and book data and pass it to their handlers
function getData(){
    fetch(urlJSON_Books)
    .then(response => response.json())
    .then(data => buildBookList(data))

    fetch(urlJSON_Users)
    .then(response => response.json())
    .then(data => selectUser(data))
}


document.addEventListener("DOMContentLoaded", function() {
    getData()
});
