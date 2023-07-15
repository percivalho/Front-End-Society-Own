const newPostButton = document.querySelector('.new-post-button');
const articleElement = document.querySelector('.sample-img');
const createButton = document.querySelector('#crate');
const searchButton = document.querySelector('#searchBtn');
let historyEl = document.getElementById('history');
/*newPostButton.addEventListener('click', () => {
  articleElement.classList.remove('d-none');
});

const submitBlogHandler = async (event) => {
    event.preventDefault();
  
    const title = document.querySelector('#title').value.trim();
    const description = document.querySelector('#description').value.trim();
    if (title && description) {
      const response = await fetch(`/myPlaylist`, {
        method: 'POST',
        body: JSON.stringify({
            title: title,
            description, description,
        }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace(`/myPlaylist`);
      } else {
        alert('Failed to add blog.');
      }
    }
  };
  
  document
    .querySelector('#create')
    .addEventListener('submit', submitBlogHandler);
*/

const submitSearchHandler = async (event) => {
  //event.preventDefault();
  //console.log("here!!");
  let searchTerm = document.querySelector('#search').value;
  if (!searchTerm){
    searchTerm = event.target.textContent;
    //console.log("Event");
    //console.log(city);
  }
  
  console.log(searchTerm);
  if (searchTerm) {
    const response = await fetch(`/myResult/search?query=${searchTerm}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {

      const data = await response.json(); // Get data as JSON

      //document.location.replace(`/myPlaylist`);
      var mycard = document.querySelector('.mycard');
      var myresult = document.querySelector('.myresult');

      // Clear the contents of songContainerInMyResult
      let songContainerInMyResult = document.querySelector('.myresult .mysong-container');
      // Clear the contents of songContainerInMyResult
      songContainerInMyResult.innerHTML = '';    

      if(data.songs.length > 0) {
        for (let song of data.songs) {
          // Create the elements
          const section = document.createElement('section');
          const article = document.createElement('article');
          const div = document.createElement('div');
          const div1 = document.createElement('div');
          const iframe = document.createElement('iframe');
          const button = document.createElement('button');
          const pEl = document.createElement('p');

          // Set the classes and attributes
          section.className = 'mysong-section';
          article.className = 'sample-img';
          div.className = 'detail';
          div1.className = "media-container";
          pEl.classNmae = 'message';
          pEl.id = 'message' + song.id;  
          iframe.width = '90%';
          iframe.height = '80px';
          //iframe.frameBorder = '0';
          iframe.allowTransparency = 'true';
          iframe.allow = 'encrypted-media';
          iframe.src = 'https://open.spotify.com/embed/track/' + song.songlink; // Assuming songlink is a variable containing your song link
          button.className = "adjust-button";

          // Set button properties
          button.innerText = '+';
          button.setAttribute('data-id', song.id); // Assuming song id is available as song.id
          button.addEventListener('click', addSongToPlaylist); // Add event listener
          console.log(song.id);
          // Append the elements
          div1.appendChild(iframe); // Append iframe to the inner div
          div1.appendChild(button); // Append button to the inner div
          div.appendChild(div1); // Append inner div to the outer div
          div.appendChild(pEl); // Append pEl to the outer div
          article.appendChild(div); // Append outer div to article
          section.appendChild(article); // Append article to section

          //songContainerInMyResult = document.querySelector('.myresult .mysong-container');
          
          songContainerInMyResult.appendChild(section);   
          
          // push to array and local storage
        }
        if (myresult.classList.contains('hidden')) {      
          mycard.classList.toggle('visible');
          mycard.classList.toggle('hidden');
          myresult.classList.toggle('visible');
          myresult.classList.toggle('hidden');
        }
        saveHistory(searchTerm);        
      }
      else {
        console.log('No songs found');
        let messageElement = document.querySelector(".search-message");
        messageElement.textContent = "No songs found!";
        setTimeout(function() {
          messageElement.textContent = '';
        }, 2000);    
      }
      //console.log("ok");
      //data = response.text();
      //console.log(data);
      //document.body.innerHTML = data;
      //document.location.replace(`/myResult`);
  
      // Clear existing results
      //const resultsContainer = document.querySelector('.results');
      //resultsContainer.innerHTML = '';
  
      // Create new result elements
      //for (let song of data.songs) {
      //  const songElement = document.createElement('p');
      //  songElement.textContent = `${song.name} by ${song.artist.name}`;
      //  resultsContainer.appendChild(songElement);
     // }


    } else {
      alert('Failed to retrive search result.');
    }
  }
};

/**
 * to save the city to save history (local storage)
 * @param searchTerm
 * @returns None
 */
function saveHistory(searchTerm){
  // get localHistory to array
  var array = [];
  if (localStorage.getItem('searchTerm')!= null){
    array = JSON.parse(localStorage.getItem('searchTerm'));
  }
  // Find the index of the element in the array
  var index = array.indexOf(searchTerm);
  // Check if the element exists (index will be -1 if the element is not found)
  if (index !== -1) {
    // Remove the element using splice()
    array.splice(index, 1);
  }  
  array.push(searchTerm);
  //console.log(array);
  localStorage.setItem('searchTerm', JSON.stringify(array));
  // remove existing entries
  // Remove all li elements (children) from the ul
  while (historyEl.firstChild) {
    historyEl.removeChild(historyEl.firstChild);
  }  
  // create all childs
  for (i=array.length-1; i>=0; i--){
    liEl = document.createElement('li');
    liEl.textContent = array[i];
    liEl.classList.add('histBtn',  'btn', 'btn-primary', 'w-100', 'list-group-item', 'list-group-item-action', 'mb-1');
    //console.log(liEl);
    historyEl.appendChild(liEl);
  }
  
}

/**
 * to load the save history from local history
 * @param None
 * @returns None
 */
function loadFromLocalStorage(){
  var array = [];
  if (localStorage.getItem('searchTerm')!= null){
    array = JSON.parse(localStorage.getItem('searchTerm'));
  }
  while (historyEl.firstChild) {
    historyEl.removeChild(historyEl.firstChild);
  }  
  // create all childs
  for (i=array.length-1; i>=0; i--){
    liEl = document.createElement('li');
    liEl.textContent = array[i];
    liEl.classList.add('histBtn',  'btn', 'btn-primary', 'w-100', 'list-group-item', 'list-group-item-action', 'mb-2');
    //console.log(liEl);
    historyEl.appendChild(liEl);
  }

}


/*document
.querySelector('#searchBtn')
.addEventListener('submit', submitSearchHandler);*/


document.querySelector('#search').addEventListener('keypress', function (e) {
  if (e.key === 'Enter') {
    console.log("key pressed");
    e.preventDefault(); // Prevents the default action
    submitSearchHandler(e); 

  }
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
  let messageElement = document.querySelector('#message' + `${songId}`); // Use the identifier to select the p element
  messageElement.textContent = message;  

  // Clear the message after 3 seconds
  setTimeout(function() {
    messageElement.textContent = '';
  }, 2000);    

}



let deleteButtons = document.querySelectorAll('.delete');
deleteButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
        console.log("clicked here!!!");
        e.preventDefault(); // Prevents the default action
        deleteSongFromPlaylist(e); 
    });
});

async function deleteSongFromPlaylist(event) {
  const songId = event.target.getAttribute('data-id');
  console.log(songId);

  const response = await fetch(`/myPlaylist/${songId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    console.log(`Song with id ${songId} deleted to playlist.`);
    location.reload(); // Refresh the page
  } else {
    console.error(`Failed to delete song id ${songId} to playlist.`);
  }
}





document.addEventListener("DOMContentLoaded", function() {
  loadFromLocalStorage();

  // for clicking on saved history button
  document.addEventListener('click', function(event) {
    if (event.target.matches('.histBtn')) {
      event.preventDefault(); // Prevents the default action
      submitSearchHandler(event); 
    }
  }); 

});