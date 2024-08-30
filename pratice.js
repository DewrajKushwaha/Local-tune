console.log('The code is start from here!!!!');

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response= await a.text()
   
    let div= document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    let songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
       
        if(element.href.endsWith(".m4a")){
            songs.push(element.href.split("/songs/")[1])
        }
    }

    return songs
}

async function getsongs() {
    let a=await fetch("http://127.0.0.1:5500/songs/yoyo/")
    let response=await a.text()
    let div=document.createElement("div")
    div.innerHTML=response
    let as=div.getElementsByTagName("a")
    for (let index = 0; index < as.length; index++) {
        const e = as[index];
        if (e.href.endsWith(".mp3") || e.href.endsWith(".m4a")) {
            let song=e.href.split("/yoyo/")[1]
            console.log(decodeURI(song))
        }
    }    
}
getsongs()
