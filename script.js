let current_song=new Audio();
let current_folder;
function formatTime(seconds) {
    // Ensure input is an integer
    seconds = Math.floor(seconds);

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Pad minutes and seconds with leading zeros if necessary
    const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const paddedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    // Return formatted time
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
    let a= await fetch(`http://127.0.0.1:5500/${current_folder}`);
    let response = await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    let songs=[];
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
        <div class="play-now">
            <span>Play Now</span>
            <img src="images/play.svg" class="invert" alt="">
        </div></li>`;
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
        console.log(index)
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

async function main() {
    await getsongs("songs/non-copyright")
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

current_song.addEventListener("timeupdate",()=>{
let curr_time=formatTime(current_song.currentTime);
let duration=formatTime(current_song.duration);
document.querySelector(".duration").innerHTML=`${curr_time}/${duration}
<img src="images/volume.svg" alt="">
<input type="range">`
let newwidth=current_song.currentTime/current_song.duration*100 + "%";
document.querySelector(".circle1").style.left=newwidth
})

document.querySelector(".seekbar").addEventListener("click",e=>{
    console.log(e)
    let percent=e.offsetX/e.target.getBoundingClientRect().width;
    let newtime=percent*100 +"%";
    current_song.currentTime=current_song.duration*percent;
    document.querySelector(".circle1").style.left=newtime;
let curr_time=formatTime(current_song.currentTime);
let duration=formatTime(current_song.duration);
document.querySelector(".duration").innerHTML=`${curr_time}/${duration}`
})

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async ev=>{
        songs= await getsongs(`songs/${ev.currentTarget.dataset.folder}`);
        })
    })
}

main();
