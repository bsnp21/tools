const urlParams = new URLSearchParams("" + window.location.search);
var viId = urlParams.get("vid")

if(!viId) alert("vid ?")
viId = "c0IhZeHvj0w"


    // 2. This code loads the IFrame Player API code asynchronously.
    var tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    //tag.src="https://www.youtube.com/watch?v=c0IhZeHvj0w&list=PLEJKF_V6_xtg_jaIWoBIbHpEbDdjjux4v&ab_channel=Nate-OnionEnglish";
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '390',
            width: '640',
            videoId: viId,// 'M7lc1UVf-VE',
            playerVars: {
                autoplay: 1, //issue?
                controls: 1, //show yt contrls.
            },
            events: {
                'onReady': onPlayerReady,
            },

        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        player.setPlaybackRate(.75);
        event.target.playVideo();
    }


