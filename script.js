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



    ///////////////////////////////

    //////////////// ADDING CONTACT TO LIST 

// get refs from UI input

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

    db.collection('contacts').doc().set(data).then(() => {
      console.log('Entered into database');
    });

    // Clear input fields
    contactForm.reset();
  } else {
    alert('Please provide both a name and an alert frequency.');
  }


});


// create element and render new contact on list

const contactList = document.querySelector('.contact-list');

function renderContact(doc) {
  let li = document.createElement('li');
  let name = document.createElement('span');
  let frequency = document.createElement('span');


  // Add in edit functionality at a later date (add to div HTML below) -->
  // <i class="fas fa-edit"></i>

  let div = '<div class="edit-exit-icons"></i><i class="fas fa-times x contact-delete"></i></div>'

  li.setAttribute('data-id', doc.id);

  name.textContent = doc.data().name;
  frequency.textContent = doc.data().frequency;

  li.appendChild(name);
  li.appendChild(frequency);

  li.insertAdjacentHTML('beforeend', div);
  contactList.appendChild(li);

  //////////////// DELETING CONTACTS FROM LIST

  // 1. add event listener to delete button on list item (must be inside function because technically these li's don't exist yet on DOM)

  document.querySelectorAll('.contact-delete').forEach(button => {
    button.addEventListener('click', (event) => {
      // event.stopPropagation();

      // 2. event target/bubbling to grab the list item id 
      let deletedListItem = event.target.parentNode.parentNode;
      let id = deletedListItem.getAttribute('data-id');
  
      // 3. delete the selected item from the parentNode (ul)
      deletedListItem.parentNode.removeChild(deletedListItem);
      
  
      // 4. delete the item from the database
      db.collection('contacts').doc(id).delete();
      
    })
  })
}

// THIS MATCHES UP CORRECT DOCS WITH USERS
auth.onAuthStateChanged(user => {
  if(user) {
    // real-time listener
    db.collection('contacts').onSnapshot(snapshot => {
      let changes = snapshot.docChanges();
      changes.forEach(change => {
        if (change.type === 'added' && change.doc.data().id === auth.currentUser.uid) {
          renderContact(change.doc);
        } 
      })
    })
  } else {
    return;
  }
});


// RESET CONTACT LIST ON LOGOUT

const logoutButton = document.querySelector('#logout__btn');

logoutButton.addEventListener('click', event => {
  event.preventDefault();

  contactList.innerHTML = '';
})
///////////////////////////////






//////////////// EDITING CONTACT AND/OR FREQUENCY

// 1. Add event listener to edit icon on list item

// 2. Pop up modal with form and pre-filled values for selected ID 

// 3. Add a 'save changes' button with event listener

// 4. on Submit, prevent default and update UI and database



// const documentRef = db.collection('contacts');

//   documentRef.get().then(snapshot => {
//     const documentID = snapshot.docs[0].id;
//     console.log(documentID);
//   });