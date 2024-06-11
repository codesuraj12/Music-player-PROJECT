
let currentsong = new Audio();
let songs;
let currentfolder;

function convertSecondsToMinutesSeconds(totalSeconds) {
    // Round the totalSeconds to the nearest integer to remove milliseconds
    totalSeconds = Math.floor(totalSeconds);

    // Calculate minutes and seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // Ensure seconds are always two digits
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

    // Return the formatted time
    return `${minutes}:${formattedSeconds}`;
}


async function getSongs(folder) {
    currentfolder = folder;
    let a = await fetch(`/${folder}/`)
    let response = await a.text();
    // console.log(response)

    // sirf uper ka run kiya to aapko table ke formate me aapke songs milenge anchor tag href ke sath  

    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")

    // esse aapke table me a tag sb naye div me aayenge 
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
   
   

    // show all the songs in playlist
    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]

    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
       
                       <img class="invert" width="34" src="img/music.svg" alt="">
                       
                   <div class="info">
                       <div>${song.replaceAll("%20", " ")}</div>
                       <div>harry</div>
                   </div>
                       <div class="playnow">
                       
   
                          <span>
                           play now
                       </span>
                           <img class="invert" src="img/play.svg" alt="">
                       </div>
 
         </li>`;
    }

    //    attch an event listener to each song esse aap agar song ko touch krenge to vo play hoga
    Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
    return songs
}
const playmusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentsong.src = `/${currentfolder}/` + track
    if (!pause) {

        currentsong.play()
        play.src = "img/pause.svg"

    }
    document.querySelector(".song-info").innerHTML = decodeURI(track)
    document.querySelector(".song-time").innerHTML = "00:00 / 00:00"

}
async function displayalbums() {
    console.log("displaying album")

    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
   let array = Array.from(anchors)

        for (let index = 0; index < array.length; index++) {
            const e = array[index];
       
        if (e.href.includes("/songs") && !e.href.includes(".htaccess")) {
            let folder = e.href.split("/").slice(-2)[0]

            // get the metadata of the folder 
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json();
         

            cardContainer.innerHTML = cardContainer.innerHTML + ` <div data-folder="${folder}" class="card ">

            <div  class="play">
                <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 64 64">
                    <!-- Define the circular green background -->
                    <circle cx="32" cy="32" r="32" fill="green" />

                    <!-- Create a simple play button -->
                    <polygon points="26,20 26,44 42,32" fill="black" />
                </svg>

            </div>
            <img src= "/songs/${folder}/cover.jpg" alt="">
            <h2> ${response.title} </h2>
            <p> ${response.description}</p>
        </div>`
        }

    }

        // load thw playlist whenever card is clicked

        Array.from(document.getElementsByClassName("card")).forEach(e => {
            e.addEventListener("click", async item => {
    
                console.log("fetching songs")
                songs = await getSongs(`songs/ ${item.currentTarget.dataset.folder}`)
                playmusic(songs[0])
            })
        })

}

async function main() {


    // get the list of all songs

    // yha aap "cs" ye ek folder ka naam he aap "ncs" bhi laga skte he
    await getSongs("songs/ncs")

    playmusic(songs[0], true)

    // display all the albums on the page

   await displayalbums()

    // attach an eventlistener to prious,play and next images

    // esse aaap song ke play button play ya pause kr skte he 

    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    // listent for timeupdate event esse aap time bhi badal skte he jaise song chlega 

    currentsong.addEventListener("timeupdate", () => {
        
        document.querySelector(".song-time").innerHTML = `${convertSecondsToMinutesSeconds(currentsong.currentTime)} / ${convertSecondsToMinutesSeconds(currentsong.duration)}`

        // esse aap circle ko move kr skte ho jaise time chalega 
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%";
    }
    )
    // add an event listener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"

        // getBoundingClientRect() ye function use krne se aapko seekbarki width,  x axis,yaxis kitna he  ye aayega aur agar "getBoundingClientRect().width" kre to sirf width aayegi 
        currentsong.currentTime = ((currentsong.duration) * percent) / 100

    })


    // add an event listener to hamburger agar aap hamburger pe click jroge to aap ko playist dikhegi
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"

    })

    // add an event listener to cancel button agar aap cancel pe click kroge to aapki playist nhi dikhegi

    document.querySelector(".cancel").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    // add an event listener to prvious 

    previous.addEventListener("click", () => {
        currentsong.pause()
        console.log("previous clicked")
      

        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index - 1) >= 0) {

            playmusic(songs[index - 1])
        }
    })

    // add an event listener to next
    next.addEventListener("click", () => {

currentsong.pause()
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])

        if ((index + 1) < songs.length) {

            playmusic(songs[index + 1])
        }
    })


    // add an event listener to volume

    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("setting volume to", e.target.value, "/100")
        currentsong.volume = parseInt(e.target.value) / 100
        if (currentsong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

// add event listener to mute the track
document.querySelector(".volume>img").addEventListener("click",e=>{
   
    if(e.target.src.includes("volume.svg") ){
        e.target.src = e.target.src.replace("volume.svg","mute.svg")
        currentsong.volume = 0;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 0 ;
    }
    else{
        e.target.src = e.target.src.replace("mute.svg","volume.svg")
        currentsong.volume = .10;
        document.querySelector(".range").getElementsByTagName("input")[0].value = 10 ;
    }
})


}


main()