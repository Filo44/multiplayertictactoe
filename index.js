var playerCounter=document.getElementById("playerCount")
var database = firebase.database();
var sidebar=document.getElementsByClassName("sidebar")[0]
var subcontainer=document.getElementsByClassName("subcontainer")[0]
var usernameButton=document.getElementById("usernameBtn")
var something
var usernameInput=document.getElementById("usernameInput")
var username=""
var els=document.getElementsByClassName("something")
var els2=document.getElementsByClassName("something2")
var mode=0
var popup=document.getElementById("popup")
var popupText=document.getElementById("popupText")



//Increase player count
database.ref("playerCount").get().then((data)=>{
    database.ref("playerCount").set(parseInt(data.val())+1)
}
)

//Changes playercounter when playercount changes
database.ref("playerCount").on("value", data => {
    console.log(data.val())
    playerCounter.innerText="Players online: "+data.val()
});

//Creates cards for online players
database.ref("onlinePlayers").on("value", data => {
    if(data.val()){    
        something=data.val()
        subcontainer.innerHTML=""
        for(let i=0;i<Object.keys(something).length;i++){
            createDuelBox(Object.keys(something)[i])
        }
    }
});


//Set username button and input
usernameButton.addEventListener("click",()=>{
    database.ref("onlinePlayers/"+usernameInput.value).set({
        duelling:"",
        table:[[null,null,null],
                [null,null,null],
                [null,null,null]],
        won:""
    })
    username=usernameInput.value
    usernameButton.outerHTML=""
    usernameInput.outerHTML=""
    database.ref("onlinePlayers/"+username+"/duelling").on("value", data => {
        console.log(data.val())
        if(data.val()!=""){
            popupText.innerText=data.val()+" is duelling you, do you accept?"
            popup.style.visibility="visible"
        }
    });
})



//Shows popup on duelling status changed
/*
database.ref("onlinePlayers/"+username+"/duelling").on("value", (data) => {
    console.log(data.val())
    if(data.val()!=""){
        popupText.innerText=data.val()+" is duelling you, do you accept?"
        popup.style.visibility="hidden"
    }
});
*/



window.addEventListener('beforeunload', function (e) {
    if(username!=""){
        database.ref("onlinePlayers/"+username).set(null)
    }
    database.ref("playerCount").get().then((data)=>{
        database.ref("playerCount").set(parseInt(data.val())-1)
    }
    )
});

for(let i=0; i<els.length;i++) {
    els2[i].addEventListener("click",()=>{
        //console.log(els[i])
        if(mode==0 && els[i].textContent==""){
            els[i].textContent="X"
            mode=1
            arrhor[Math.floor(i/3)][i-Math.floor(i/3)*3]="x"
            arrver[i-Math.floor(i/3)*3][Math.floor(i/3)]="x"
            //console.log(checkIfWon(arrver,arrhor))
            if(checkIfWon(arrver,arrhor)=="x"){
                win("x")
            }if(checkIfWon(arrver,arrhor)=="draw"){
                overlay.style.top="0px"
                overlay.style.height="100%"
                overlay.style.width="100%"
                overlay.style.background="rgba(128, 128, 128, 0.747)"
                wintext.textContent="Its a draw"
                greybutton.style.left="0"
            }
            return
        }if(mode==1 && els[i].textContent==""){
            els[i].textContent="O"
            mode=0
            arrhor[Math.floor(i/3)][i-Math.floor(i/3)*3]="o"
            arrver[i-Math.floor(i/3)*3][Math.floor(i/3)]="o"
            //console.log(checkIfWon(arrver,arrhor))
            if(checkIfWon(arrver,arrhor)=="o"){
                win("O")
            }
        }
    })
}

function createDuelBox(username){
    let para = document.createElement("div");
    subcontainer.appendChild(para);
    para.outerHTML= `
    <div class="duelBox">
    `+username+`
    </div>
    <button class="duelButton">Chalange</button>
    `
    for(let i=0;i<document.getElementsByClassName("duelButton").length;i++){
        document.getElementsByClassName("duelButton")[i].addEventListener("click",()=>{
            if(username!="" && username!="test(not actual person)"){
                database.ref("onlinePlayers/"+document.getElementsByClassName("duelBox")[i].innerText+"/duelling").set(username)
            }
        })
    }
}

function createSelfDuelBox(username){
    let para = document.createElement("div");
    subcontainer.appendChild(para);
    para.outerHTML= `
    <div class="duelBox">
    `+username+`
    </div>
    `
    
}


/*
if(localStorage.getItem("username")!=""){
    username=localStorage.getItem("username")
    console.log("klsdfjlsdfj")
    database.ref("onlinePlayers/"+localStorage.getItem("username")).set({
        duelling:"",
        table:[[null,null,null],
                [null,null,null],
                [null,null,null]],
        won:""
    })
    usernameButton.outerHTML=""
    usernameInput.outerHTML=""
    database.ref("onlinePlayers/"+username+"/duelling").on("value", data => {
        console.log(data.val())
        if(data.val()!=""){
            popupText.innerText=data.val()+" is duelling you, do you accept?"
            popup.style.visibility="visible"
        }
    });
}else{
    usernameButton.addEventListener("click",()=>{
        database.ref("onlinePlayers/"+usernameInput.value).set({
            duelling:"",
            table:[[null,null,null],
                    [null,null,null],
                    [null,null,null]],
            won:""
        })
        username=usernameInput.value
        usernameButton.outerHTML=""
        usernameInput.outerHTML=""
        database.ref("onlinePlayers/"+username+"/duelling").on("value", data => {
            console.log(data.val())
            if(data.val()!=""){
                popupText.innerText=data.val()+" is duelling you, do you accept?"
                popup.style.visibility="visible"
            }
        });
        localStorage.setItem("username",username)
    })
    console.log("sldfsljf")
}
*/