
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
    data['created_on'] = Date.now();

    db.collection('contacts').doc().set(data).then(() => {
      console.log('Entered into database');
    });

    // Clear input fields
    contactForm.reset();
  } else {
    alert('Please provide both a name and an alert frequency.');
  }

  // Put the focus back on name input after submit
  document.querySelector('#newContact__input').focus();

});

const contactList = document.querySelector('.contact-list');

// THIS MATCHES UP CORRECT DOCS WITH USERS
auth.onAuthStateChanged(user => {
  if(user) {
    // real-time listener
    db.collection('contacts').onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === 'added' && change.doc.data().id === auth.currentUser.uid) {
          renderContact(change.doc);
        } else if (change.type === 'removed') {
          let li = document.getElementById(change.doc.id);
          contactList.removeChild(li);
        }
      })
    })
  } else {
    return;
  }
}); 

// create element and render new contact on list

function renderContact(doc) {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let frequency = document.createElement('span');
  let cross = document.createElement('div');

  li.setAttribute('id', doc.id);

  name.textContent = doc.data().name;
  frequency.textContent = doc.data().frequency;
  cross.textContent = 'x';

  li.appendChild(name);
  li.appendChild(frequency);
  li.appendChild(cross);


  contactList.appendChild(li);

  // deleting data 
  cross.addEventListener('click', e => {
    e.stopPropagation();

    let id = e.target.parentElement.getAttribute('id');
    db.collection('contacts').doc(id).delete();
    
  })
}


// RESET CONTACT LIST ON LOGOUT

const logoutButton = document.querySelector('#logout__btn');

logoutButton.addEventListener('click', event => {
  event.preventDefault();
  contactList.innerHTML = '';
});


const getUserContacts = 
auth.onAuthStateChanged(user => {
  if (user !== null) {
    const currentUser = auth.currentUser;
    console.log(currentUser);
    db.collection('contacts').get().then(snapshot => {
      snapshot.docs.forEach(doc => {
        if (user.uid === doc.data().id) {
          
        } else {
          return;
        }
      })
    })
  }
  

})

exports = getUserContacts;