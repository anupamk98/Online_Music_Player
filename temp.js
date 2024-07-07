let current_song=new Audio();
let current_folder;
function formatTime(seconds) {
    seconds = Math.floor(seconds);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;
    return paddedMinutes + ':' + paddedSeconds;
}

const playMusic=(track,song,artist)=>{
    current_song.src=`/${current_folder}/`+track
    current_song.play();
    document.querySelector(".main-btn").src = "images/pause.svg";
    document.querySelector(".songdet").innerHTML=`${song} by ${artist}`;
}

async function getsongs(folder) {
    current_folder=folder;
    let a= await fetch(`/${current_folder}`);
    let response = await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    let songs=[];
    songs.length=0;
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if(element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${current_folder}/`)[1]);
        }
    } 
    let song_list = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    song_list.innerHTML="";
    for (const song of songs) {
        let sname=song.replaceAll("%20"," ").replace(".mp3","");
        let song_name="";
        let i;
        for(i=0;i<sname.length;i++) {
        if(sname[i]=='-') break;
        song_name+=sname[i];
        }
        let artist=""
        for(let j=i+1;j<sname.length;j++) {
        artist+=sname[j];
        }
        song_list.innerHTML+=
        `<li><div class="info">
        <img src="images/music.svg" class="invert" alt="">
            <div class="artist">
                <div>${song_name}</div>
                <div>${artist}</</div>
            </div>
        </div>
        </li>`;
    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=> {
        let Song=e.querySelector(".artist").getElementsByTagName("div")[0].innerText.trim();
        let Artist=e.querySelector(".artist").getElementsByTagName("div")[1].innerText.trim();
        let song_name=Song+"%20-%20"+Artist+".mp3";
        e.addEventListener("click",ev=>playMusic(song_name,Song,Artist));
    });
    document.querySelector(".lft-btn").addEventListener("click",()=>{
        let req=current_song.src.split("/").slice(-1)[0];
        for (let i = 0; i < songs.length; i++) {
            const element = songs[i];
            if(req==element) {
                index=i;break;
            }
        }
        console.log(songs)
        if(index-1>=0){
            let sname=songs[index-1].replaceAll("%20"," ").replace(".mp3","");
            let song_name="";
            let i;
            for(i=0;i<sname.length;i++) {
            if(sname[i]=='-') break;
            song_name+=sname[i];
            }
            let artist=""
            for(let j=i+1;j<sname.length;j++) {
            artist+=sname[j];
            }
            playMusic(songs[index-1],song_name,artist);
        }
    })
    
    document.querySelector(".ryt-btn").addEventListener("click",()=>{
        let req=current_song.src.split("/").slice(-1)[0];
        for (let i = 0; i < songs.length; i++) {
            const element = songs[i];
            if(req==element) {
                index=i;break;
            }
        }
        if(index+1<songs.length){
            let sname=songs[index+1].replaceAll("%20"," ").replace(".mp3","");
            let song_name="";
            let i;
            for(i=0;i<sname.length;i++) {
            if(sname[i]=='-') break;
            song_name+=sname[i];
            }
            let artist=""
            for(let j=i+1;j<sname.length;j++) {
            artist+=sname[j];
            }
            playMusic(songs[index+1],song_name,artist);
        }
        })
}

async function displayAblums(){
    let a = await fetch("/songs/")
    let response = await a.text();
    let div=document.createElement("div")
    div.innerHTML=response
    let cardcontainer=document.querySelector(".card-container")
    let anchors=div.getElementsByTagName("a")
    let array=Array.from(anchors)
    let k=0
        for (let i = 0; i < array.length; i++) {
        const e = array[i];
        if(e.href.includes("/songs")) {
            if(k==0) {
                k++ 
                continue
            }
            let folder=e.href.split("/").slice(-1)[0]
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json()
            cardcontainer.innerHTML+=
            `<div class="card" data-folder=${folder}>
            <svg width="50" class="play-btn" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="20" fill="#1fdf64"/>
                <polygon points="20,17 20,33 33,25" fill="black"/>
              </svg>                                                                                                                              
            <img src="songs/${folder}/cover.jpg" alt="cover">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`
        }
        Array.from(document.getElementsByClassName("card")).forEach(e=>{
            e.addEventListener("click",async ev=>{
            songs= await getsongs(`songs/${ev.currentTarget.dataset.folder}`);
            })
        })
    };
    }

async function main() {
    await displayAblums()
document.querySelector(".main-btn").addEventListener("click",e=>{
    if(current_song.src=="") {
    let e=document.querySelector(".songlist").getElementsByTagName("li")[0];
    let Song=e.querySelector(".artist").getElementsByTagName("div")[0].innerText.trim();
    let Artist=e.querySelector(".artist").getElementsByTagName("div")[1].innerText.trim();
    let song_name=Song+"%20-%20"+Artist+".mp3";
    playMusic(song_name,Song,Artist)
    }
    else if(current_song.paused) {
        current_song.play();
        document.querySelector(".main-btn").src = "images/pause.svg";
    }
    else {
        current_song.pause();
        document.querySelector(".main-btn").src="images/play.svg";
    }
})

document.getElementsByTagName("input")[0].addEventListener("change",(e)=>{
    let x=parseInt(e.target.value)/100
    current_song.volume=x
})

current_song.addEventListener("timeupdate",()=>{
let curr_time=formatTime(current_song.currentTime);
let duration=formatTime(current_song.duration);
document.querySelector(".time-gon").innerHTML=`${curr_time}/${duration}`
let newwidth=current_song.currentTime/current_song.duration*100 + "%";
document.querySelector(".circle1").style.left=newwidth
})

document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent=e.offsetX/e.target.getBoundingClientRect().width;
    let newtime=percent*100 +"%";
    current_song.currentTime=current_song.duration*percent;
    document.querySelector(".circle1").style.left=newtime;
let curr_time=formatTime(current_song.currentTime);
let duration=formatTime(current_song.duration);
document.querySelector(".duration").innerHTML=`${curr_time}/${duration}`
})

document.querySelector(".nav").getElementsByTagName("img")[0].addEventListener("click",(e)=>{
    console.log(e)
    document.querySelector(".left").style.zIndex="1" 
    document.querySelector(".left").style.left="0"
})
document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.zIndex="-1" 
    document.querySelector(".left").style.left="-100%"
})
}

main();
