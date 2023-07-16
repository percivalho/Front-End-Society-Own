// Get select element
let selectElement = document.getElementById("login-sound");


const signupFormHandler = async (event) => {
    event.preventDefault();
  
    const username = document.querySelector('#username-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();
    let sound = selectElement.options[selectElement.selectedIndex].text.trim();
  
    if (username && password) {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        body: JSON.stringify({ username, password, sound }),
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (response.ok) {
        document.location.replace('/');
      } else {
        alert('Failed to sign up.');
      }
    }
  };
  
  document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);


// Add event listener
selectElement.addEventListener("change", function() {
  // Get the selected option text
  let sound = selectElement.options[selectElement.selectedIndex].text;
  console.log(sound); 
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
