// refs for main section based on login/out
const loggedIn = document.querySelectorAll('.logged-in');
const loggedOut = document.querySelectorAll('.logged-out'); 

///////////////// SIGNUP 

// get reference to signup form
const signupForm = document.querySelector('#signup-form');

// Add event listener to submit form
signupForm.addEventListener('submit', event => {
  event.preventDefault(); 

  const email = signupForm['signup-email'].value;
  const password = signupForm['signup-password'].value;

  // Create user (auth)
  auth.createUserWithEmailAndPassword(email, password)
  .then(cred => {
    // Form disappears
   document.querySelector('.modal.signup').style.display = 'none';

    // Clear input fields
    signupForm.reset();
  }); 
  
    // Background opacity back to 1
    document.querySelector('#content').style.opacity = 1;
});

///////////////// LOGIN

// get reference to login form
const loginForm = document.querySelector('#login-form');

// event listener to login submit
loginForm.addEventListener('submit', event => {
  event.preventDefault();

  const email = loginForm['login-email'].value;
  const password = loginForm['login-password'].value;

  auth.signInWithEmailAndPassword(email, password).then(cred => {
    // Form disappears
    document.querySelector('.modal.login').style.display = 'none';

    // Clear input fields
    loginForm.reset();
  });

  // Background opacity back to 1 
  document.querySelector('#content').style.opacity = 1;

  // Call user to click on button to display all contacts
  setInterval(() => {
    displayContactBtn.classList.toggle('green');
  }, 500)
});

///////////////// LOGOUT

const logout = document.querySelector('#logout__btn');

logout.addEventListener('click', event => {
  event.preventDefault();

  // sign out method using auth object
  auth.signOut();
});
