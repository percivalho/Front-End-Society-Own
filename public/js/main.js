
document.addEventListener("DOMContentLoaded", function() {
    // Create a new Howl instance
    let sound = window.sound;
    let soundSrc = './assets/' + sound;
    let soundToPlay = new Howl({
        src: [soundSrc],
        autoplay: true 
    });
    message = soundSrc;
    console.log(message);
    
    // Play the sound
    soundToPlay.play();
});
  