![Light green jelly bean image](img/wellbean_favicon.png)

# Wellbean

### Created and developed by [Alex Morton](https://alexlsalt.github.io/)  

Wellbean is an app I created to help users stay in contact on a consistent basis with their loved ones. 
With the ability to add contacts' names and the desired reminder frequency, users will be notified of which contacts 
are overdue to reach out to each time they log in to the app.

## About

In April 2020, I felt inspired to develop an app that helped me keep track of which of my loved ones to contact on any given day. I'd often 
lose track of who I had and hadn't spoken to in a long time, and I wanted to create something that would remove the confusion and just 
notify me of who of my friends or family would be a good idea to call, based on how much time had passed since I'd last spoken to them.

### How it works

The app itself uses Firebase Firestore and Firebase Authentication to store users' contacts in a database. Once users have created an account 
using an email address and password, they'll have access to the logged in page, where they'll have the option to enter a contact name and 
reminder frequency. Once that information is submitted, it will immediately show up on the list below the input form, in addition to being 
added to the database.

Depending on the logged-in user, the program will return only those documents in the database that have an ID property that matches their 
unique user ID (UID) that they receive at the time their account is created. In other words, upon each contact submission into the input form, the program 
grabs the user's UID and sets a property of 'id' as that UID within the overall object of the particular contact.

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
    

Also upon submission, there is also a property called created_on that is set with a timestamp of the present moment using the Date object
in JavaScript (in hours because milliseconds can become very unruly very quickly). This is an important aspect of the overall timing function of the app.

Each time the user logs in, another snapshot of the current time is taken (again by using the now() method on the Date object), and the
program uses that in its logic to test if the time now subtracted by the created_on property is greater than a given number of hours 
(depending on the frequency set in each contact's data object).

  db.collection('contacts').where('id', '==', `${userId}`).get()
    .then(snapshot => {
      if (snapshot.empty) {
        console.log('No matching docs');
      }
    
      snapshot.forEach(doc => {
        let id = doc.id;
        let createdOn = doc.data().created_on;
        let frequency = doc.data().frequency;

        function timerExpired() { // This function will update the UI each time the timer expires on each list item
          document.getElementById(`${id}`).classList.add('expired');
          document.getElementById(`${id}`).childNodes[2].insertAdjacentHTML('beforeend', '<i class="fas fa-check"></i>');
        }
       
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

## Features

- Use of a module pattern within app.js file to control click events and displaying new idea from an array

        var setUpEventListeners = function() {
            document.querySelector(DOM.newIdeaBtn).addEventListener('click', ctrlDisplayNewIdea);
            document.querySelector('.button').addEventListener('click', subscribeClearInput);
        };

        var ctrlDisplayNewIdea = function() {
            // 3. Get ideas from dataCtrl
            var ideas = dataCtrl.getIdeas();

            // 4. Display one random idea from ideas array
            UICtrl.displayIdea(ideas);

            // 5. Arrow interaction
            UICtrl.transformArrowIcon();
           };

         var subscribeClearInput = function() {
            UIController.clearField();
           };

    
- Use of Font Awesome icons within 'New idea' button to rotate 180° upon click

        transformArrowIcon: function() {
            document.getElementById('arrow-icon').classList.toggle('rotated');
        };
