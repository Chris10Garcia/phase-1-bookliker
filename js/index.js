urlJSON_Books = 'http://localhost:3000/books'
urlJSON_Users = 'http://localhost:3000/users'
currentUser = undefined


function updateLikeStatus(e){
    fetch(`${urlJSON_Books}/${e.target.id}`)
    .then(resp => resp.json())
    .then(data => {

        const text = determineStatus.call(data)
        switch (text){
            case "Unlike": 
                removeLike.call(data)
                break;
            case "Like":
                addLike.call(data)
                break;
        }
        patchData.call(data)
    })

}

function determineStatus(){
    const status = Boolean(this.users.find(element => element.username === currentUser.username))
    return status ? "Unlike" : "Like"
}

function removeLike(){
    const index = this.users.indexOf(this.users.find(user => user.username === currentUser.username))
    this.users.splice(index, 1)
}

function addLike(){
    this.users.push(currentUser)
}


function patchData(){
    fetch(urlJSON_Books + "/" + this.id, {
        method: 'PATCH',
        headers: {
            "Content-Type" : "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify(this)
    })
    .then(resp => resp.json())
    .then(data =>{
        buildBookDetails(data)
    })
}


// separated this to use elsewhere within program?
function buildUserLikeList(array){

    const ulList = document.createElement('ul')
    array.forEach(user => {
        const li = document.createElement('li')
        li.innerText = user.username
        ulList.append(li)
    })
    return ulList
}


function buildBookDetails(obj){
    const divShowPanel = document.getElementById('show-panel')

    divShowPanel.innerHTML = 
        `<img src = ${obj.img_url}>
        <h1>${obj.title}</h1>
        <h2>${obj.subtitle}</h2>
        <h3>${obj.author}</h3>
        <p>${obj.description}</p>`

    const likeList = buildUserLikeList(obj.users)

    const button = document.createElement('button')
    button.id = obj.id
    button.innerText = determineStatus.call(obj)
    button.addEventListener('click', updateLikeStatus)

    divShowPanel.append(likeList, button)
}


// THIS USES BOOK TITLE TO SEARCH FOR BOOK. YIELDS SINGLE RESULT BUT WITHIN AN ARRAY
function getBookDetails(title){
    const titleFormated = encodeURIComponent(title).trim()      //need to format title so that it's URL compatible

    fetch(`${urlJSON_Books}?title_like=${titleFormated}`)
    .then(response => response.json())
    .then(data => buildBookDetails(data[0]))   // passing single object and not the entire array
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
    currentUser = array[Math.floor(Math.random()*array.length)]
    console.log(currentUser)
}



// get both user data and book data and pass it to their handlers
function getDataStart(){
    fetch(urlJSON_Books)
    .then(response => response.json())
    .then(data => buildBookList(data))

    fetch(urlJSON_Users)
    .then(response => response.json())
    .then(data => selectUser(data))
}


document.addEventListener("DOMContentLoaded", function() {
    getDataStart()
});
