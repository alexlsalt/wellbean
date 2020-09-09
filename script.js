
const loginButton = document.querySelector('#login__btn');
const signupButton = document.querySelector('#signup__btn');


//////////////// LOGIN 
const loginModalAppear = () => {
  document.querySelector('.login').style.display = 'block';
  document.querySelector('#content').style.opacity = 0.6;
  
  // exit modal functionality
  const exitLoginButton = document.querySelector('.exit.login');
  const exitModal = () => {
    document.querySelector('.modal.login').style.display = 'none';
    document.querySelector('#content').style.opacity = 1;
  };
  exitLoginButton.addEventListener('click', exitModal);
}

loginButton.addEventListener('click', loginModalAppear);

//////////////// SIGNUP
const signupModalAppear = () => {
  document.querySelector('.signup').style.display = 'block';
  document.querySelector('#content').style.opacity = 0.6;

  // exit modal functionality
  const exitSignupButton = document.querySelector('.exit.signup');
  const exitModal = () => {
    document.querySelector('.modal.signup').style.display = 'none';
    document.querySelector('#content').style.opacity = 1;
    signupForm.reset();
    
  };

  exitSignupButton.addEventListener('click', exitModal);
}

signupButton.addEventListener('click', signupModalAppear);

//////////////// DISPLAY CURRENT CONTACTS FROM DATABASE (only need to do once to refresh location)

const displayContactBtn = document.querySelector('#display-contacts-btn');

displayContactBtn.addEventListener('click', e => {

  // Reload location (to pull contacts from database)
  location.reload();
  return false;
});


//////////////// ADDING CONTACT TO LIST 
const contactForm = document.querySelector('#new-contact-form');

contactForm.addEventListener('submit', event => {
  event.preventDefault();

  const contactName = document.querySelector('#newContact__input').value;
  const contactFrequency = document.querySelector('#newFrequency__input').value;

  const ID = auth.currentUser.uid;

  let data = {}

  if (contactName !== '' && contactFrequency !== '') {
    data['name'] = contactName;
    data['frequency'] = contactFrequency;
    data['id'] = ID;
    // Milliseconds > hours
    data['created_on'] = Date.now() / 3600000;

    db.collection('contacts').doc().set(data);

    // Clear input fields
    contactForm.reset();
  } else {
    alert('Please provide both a name and an alert frequency.');
  }

  // Put the focus back on name input after submit
  document.querySelector('#newContact__input').focus();

});

/////////////// CREATE NEW CONTACT AND RENDER ON LIST
const contactList = document.querySelector('.contact-list');

function renderContact(doc) { 
  let li = document.createElement('li');
  let name = document.createElement('span');
  let frequency = document.createElement('span');
  let div = document.createElement('div');

  li.setAttribute('id', doc.id);

  name.textContent = doc.data().name;
  frequency.textContent = doc.data().frequency;
  div.innerHTML = '<i class="fas fa-times cross"></i>';

  
  li.appendChild(name);
  li.appendChild(frequency);
  li.appendChild(div);
  

  contactList.appendChild(li);

  // deleting data 
  let cross = document.querySelectorAll('.cross');
  cross.forEach(cross => {
    cross.addEventListener('click', e => {
      e.stopPropagation();

      let id = e.target.parentElement.parentElement.getAttribute('id');
      db.collection('contacts').doc(id).delete();
    });
  });
};


////////// Render contacts as soon as they're added to the database

db.collection('contacts').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if (change.type === 'added' && change.doc.data().id === auth.currentUser.uid) {
      renderContact(change.doc);
    } else if (change.type === 'removed') {
      let li = document.getElementById(change.doc.id);
      contactList.removeChild(li);
    }
  });
});

//////////// RESET CONTACT LIST ON LOGOUT

const logoutButton = document.querySelector('#logout__btn');

logoutButton.addEventListener('click', event => {
  event.preventDefault();
  contactList.innerHTML = '';
});


///////////// TIMING LOGIC: IF THE DESIGNATED NUMBER OF HOURS HAS PASSED, EACH LINE ITEM BACKGROUND COLOR WILL CHANGE TO RED


auth.onAuthStateChanged(user => {
  if (user) {
    // update UI for logged in state
    loggedIn.forEach(el => el.style.display = 'block');
    loggedOut.forEach(el => el.style.display = 'none');

    // app functionality
    let userId = auth.currentUser.uid;
    let now = Date.now() / 3600000; // Milliseconds > hours
    
    // Query docs in database to pull up only those that match with current user
    db.collection('contacts').where('id', '==', userId).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching docs');
      }
    
      snapshot.forEach(doc => {
        let id = doc.id;
        let createdOn = doc.data().created_on;
        let frequency = doc.data().frequency;

        function timerExpired() { // This function will update the UI each time the timer expires on each list item
          document.getElementById(id).classList.add('expired');
          
          document.getElementById(id).childNodes[2].insertAdjacentHTML('beforeend', '<i class="fas fa-check"></i>');

        }

        // Testing purposes only
        // if (now - createdOn > 4 && frequency == 'Daily') {
        //   timerExpired();
        // } else if (now - createdOn > 12 && frequency == 'Twice a Week') {
        //   timerExpired();
        // }
      
        // The timing logic for each frequency option
        if (now - createdOn > 24 && frequency == 'Daily') {
          timerExpired();
        } else if (now - createdOn > 84 && frequency == 'Twice a Week') {
          timerExpired();
        } else if (now - createdOn > 168 && frequency == 'Weekly') {
          timerExpired();
        } else if (now - createdOn > 336 && frequency == 'Every Two Weeks') {
          timerExpired();
        } else if (now - createdOn > 720 && frequency == 'Monthly') {
          timerExpired();
        }      
      });

      /////// Resetting the interval when the checkmark is clicked by updating the created_on property in the database
      let checkmarks = document.querySelectorAll('.fa-check');
      checkmarks.forEach(check => {
        check.addEventListener('click', e => {
          e.stopPropagation();
          let itemID = e.target.parentNode.parentNode.id;

          // Need parseInt - otherwise will be updated in database as a string instead of a number
          let now = parseInt(Date.now() / 3600000);

          // Update the created_on property in Firestore so that the timing interval starts over
          db.collection('contacts').doc(`${itemID}`).update({ created_on: now });

          // Update the list/UI
          document.getElementById(`${itemID}`).classList.remove('expired');
          e.target.style.display = 'none';

        })
      });
    });
  } else {
    // update UI for logged out state
    loggedIn.forEach(el => el.style.display = 'none');
    loggedOut.forEach(el => el.style.display = 'block');
  }
})


//////// EVENT LISTENER TO DISPLAY FREQUENCY (LIST ITEM MIDDLE SECTION) ON LARGER SCREENS AND TO HIDE IT ON SMALLER SCREENS

window.addEventListener('load', e => {
  let items = document.querySelector('.contact-list').childNodes;
  let itemsArr = Array.from(items);

  if (window.innerWidth < 505) {
    itemsArr.forEach(item => {
      item.childNodes[1].style.display = 'none';
    }) 
  } else if (window.innerWidth >= 505) {
    itemsArr.forEach(item => {
      item.childNodes[1].style.display = 'block';
    }) 
  }
})



