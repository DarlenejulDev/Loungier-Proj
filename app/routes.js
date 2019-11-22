module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // This will bring you to loungier home page immediately
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    // This route brings the user to their profile page once they have successfully logged in making sure to check the user's email.
    app.get('/profile', isLoggedIn, function(req, res) {
      // console.log();
      console.log('profile email' , req.user.local.email)
        db.collection('loungierList').findOne({userEmail:req.user.local.email},(err, result) => {
          if (err) return console.log(err)
          console.log(result);
          res.render('profile.ejs', {
            user : req.user,
            loungierListResults: result
          })
        })
    });

// Once the user logouts , the page goes to the login page
    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
// ===================================================


// This takes the user's information from the form and saves it into the database.Then it goes to the profile route which redisplays the page with the new information.

app.post('/profile', (req, res) => {
  db.collection('loungierList').save({userFirstName: req.body.userFirstName, userLastName: req.body.userLastName, userEmail:req.body.userEmail, phoneNumber:parseFloat(req.body.phoneNumber)}, (err, result) => {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/profile')
  })
})

// This updates the user info by finding their email in the database, then updating their first name, last name, and phone number.
app.put('/profileInfo', (req, res) => { console.log('hello')
  db.collection('loungierList')
  .findOneAndUpdate({userEmail:req.user.local.email}, {
    $set: {
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      phoneNumber:req.body.phoneNumber,
    }
  },
  {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

// this finds the user's email,once it is a match, it then deletes all of the user information in the collections.
app.delete('/profileInfo', (req, res) => { console.log(req.body)
  db.collection('loungierList').findOneAndDelete({userEmail: req.user.local.email}, (err, result) => {
    if (err) return res.send(500, err)
    console.log("about to delete user doc",req.user.local.email)
    db.collection('users').findOneAndDelete({ "local.email": req.user.local.email}, (err, result) => {
      if (err) return res.send(500, err)
        res.send('Message deleted!')
    })

  })
})

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { userList: req.flash('loginMessage')});
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));



        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
