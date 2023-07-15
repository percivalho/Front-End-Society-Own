// playlist add function:
let addButtons = document.querySelectorAll('.playlist-add');
addButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
        console.log("clicked public add here!!!");
        e.preventDefault(); // Prevents the default action
        addSongToPlaylist(e); 
    });
});

async function addSongToPlaylist(event) {
    const songId = event.target.getAttribute('data-id');
    console.log(songId);
  
    const response = await fetch(`/myPlaylist/addSong/${songId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    let message = "";
    if (response.ok) {
      console.log(`Song with id ${songId} added to playlist.`);
      message = `Song with id ${songId} added to playlist.`;
    } else {
      console.error(`Failed to add song id ${songId} to playlist.`);
      message = `Failed to add song id ${songId} to playlist.`;
    }
    // Update the message element
    let messageElement = event.target.parentElement.nextElementSibling;
    messageElement.textContent = message;

    // Clear the message after 3 seconds
    setTimeout(function() {
      messageElement.textContent = '';
    }, 2000);    
  }
  