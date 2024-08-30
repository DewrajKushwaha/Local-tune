console.log('Lets write the second time javascript');


let currentSong=new Audio();
let songs;
let currfolder;

function secondToMinutesSeconds(seconds){
    if (isNaN(seconds)|| seconds<0) {
        return "00:00";
    }

const minutes=Math.floor(seconds/60);
const remainingSeconds=Math.floor(seconds % 60)
const formattedMinutes=String(minutes).padStart(2,'0')
const formattedSeconds=String(remainingSeconds).padStart(2,'0')

return `${formattedMinutes}:${formattedSeconds}`
}


async function getSongs(folder) {
    currfolder=folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response)
    let div= document.createElement("div")
    div.innerHTML=response;
    let as=div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")|| element.href.endsWith(".opus")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
        
    }

    let songUL=document.querySelector(".songs_list").getElementsByTagName("ul")[0]
    songUL.innerHTML=" "
    
    for (const song of songs) {
        
        // songUL.innerHTML=songUL.innerHTML + `<li> ${song.replaceAll("%20"|"%2", " ")} </li>`;
       
        songUL.innerHTML = songUL.innerHTML + `<li> 
        <img src="img/music.svg" alt="">
        <div class="info ">
            <div> ${decodeURI(song)}
              </div>
            <div>by Dewraj</div>
        </div>
        <div class="flex list_item_play">
            <span>Play Now</span>
            <img src="img/pause.svg  " alt="">

        </div>      
        </li>`;
        // ${song.replaceAll(/%20|%2B|%5B|%5D|%EF%BD%9C|%EF%BC%9A|%2C/g, match => ({'%20': ' ', '%2B': ' ', '%5B': ' ', '%5D': ' ','%EF%BD%9C':' ','%EF%BC%9A':' ','%2C':' '}[match]))}
          
        
    }
    // //play first song of the list
    // var audio=new Audio(songs[0])
    // audio.play();

    // audio.addEventListener("loadeddata",()=>{
    //     let duration=audio.duration
    //     console.log(audio.duration,audio.src)
    // })

    // Attach an event listener to each song
    Array.from(document.querySelector(".songs_list").getElementsByTagName("li")).forEach(e=>{

        e.addEventListener("click",()=>{         
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
    return songs
}
//play music
const playMusic= (track,pause=false)=>{
    // let audio=new Audio("/songs/"+track)
    currentSong.src=`/${currfolder}/`+track
    if (!pause) {  
        currentSong.play()
        play.src="img/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI(track) 
    document.querySelector(".songtime").innerHTML="00:00/00:00"

    
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div=document.createElement("div")
    div.innerHTML=response;
    let anchors=div.getElementsByTagName("a")
    let cardContainer=document.querySelector(".card_container")
    let array=Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        
    
        if(e.href.includes("/songs/") && !e.href.includes(".htaccess")) 
            {
                let folder = e.href.split("/").slice(-2)[1]
               
               
               //get the metadata of the folder
               let a = await fetch(`/songs/${folder}/info.json`)
             let response = await a.json();
             
            cardContainer.innerHTML=cardContainer.innerHTML+`  <div data-folder="${folder}" class="card border">
                <div class="play">
                    <img src="img/play_icon.svg" alt="">
                </div>
                <img class="img_border" src="/songs/${folder}/cover.jpeg"
                    alt="">
                <h3>${response.title}</h3>
                <p>${response.description} </p>
            </div>`
            }
            
        
    }
    // Load the playlist whenever card is clicked
 Array.from(document.getElementsByClassName("card")).forEach(e => { 
    e.addEventListener("click", async item => {
    //    console.log("Fetching Songs")
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
        playMusic(songs[0])

    })
})
}

async function main() {
    // get the list of the song
     await getSongs("songs/yoyo")
    playMusic(songs[0],true)
    // Display all the albums on the page
    await displayAlbums()
   

    //Attach an event listerner to play next previous
    play.addEventListener("click",()=>{
        if (currentSong.paused) {
            currentSong.play()
             play.src="img/play.svg"
        }
        else{
            currentSong.pause()
            play.src="img/pause.svg"
        }
    })

    //listen for timeupdate event
    currentSong.addEventListener("timeupdate",()=>{
    //    console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songtime").innerHTML=`${secondToMinutesSeconds(currentSong.currentTime)}/${secondToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
    })
    //Add on event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100;
        // let seekTime=(e.offsetX/document.querySelector(".seekbar").offsetWidth)*currentSong.duration
        // currentSong.currentTime=seekTime
       document.querySelector(".circle").style.left=percent+"%";
        currentSong.currentTime=(currentSong.duration/100)*percent
    })

    //Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left=0 
    })
    //Add an event listener for close
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%"
    })
    //Add an event listener for previous 
    previous.addEventListener("click",()=>{
       let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
       if((index-1)>=0)
        { 

            playMusic(songs[index-1])
        }
    })
    //Add an event listener for next 
    next.addEventListener("click",()=>{
        currentSong.pause()
       let index=songs.indexOf(currentSong.src.split("/").slice(-1)[0])
       if((index+1)<songs.length-1 )
        {
            playMusic(songs[index+1])
        }
    })
    //Add an event listener for volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
     //   console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

 
}

main()
 




















// async function main(){
//     let songs = await getSongs() 
//     console.log(songs)

//     let songOL=document.querySelector(".songs_list").getElementsByTagName("ol")[0]
//     for (const song of songs) {
//         songOL.innerHTML=songOL.innerHTML+ `<li> ${song} <\li>`;
        
//     }

//     //play the first song
//     var audio = new Audio(songs[0]);
// // audio.play();

// audio.addEventListener("loadeddata",()=>{
//     // console.log(audio.currentTime)
//     let duration= audio.duration;
//     console.log(duration);

// })

// Array.from(document.querySelector(".songs_list").getElementsByTagName("li")).forEach(e=>{
//     console.log(e.target.getElementsByTagName("div")[0])
// })

// }


// main()

// // document.getElementById('playButton').addEventListener('click', function() {
// //     audio.play();
// // });
