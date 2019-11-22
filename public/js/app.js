let userFirstName=document.getElementsByClassName('userFirstName')
let userLastName=document.getElementsByClassName('userLastName')
let userEmail=document.getElementsByClassName('userEmail')
let phoneNumber=document.getElementsByClassName('phoneNumber')
let btn =document.querySelector('button')
let del = document.getElementById('delete')
let update= document.getElementById('update')

// btn.addEventListener('click',=>{
//
// document.getElementsByClassName('results').innerHTML= userFirstName
//
//   appendChild('results')
// })
      console.log("adding update handler",update)
     update.addEventListener('click', function(){
       console.log('running');
        const userFirstName = this.parentNode.childNodes[1].childNodes[3].childNodes[1].innerText
        const userLastName= this.parentNode.childNodes[3].childNodes[3].childNodes[1].innerText

        // const phoneNumber = this.parentNode.parentNode.childNodes[5].innerText
        fetch('profileInfo', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'userFirstName': userFirstName,
            'userLastName': userLastName,
            'phoneNumber':1,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log('response from update',data)
          window.location.reload(true)
        })
      });

      del.addEventListener('click', function(){


        fetch('profileInfo', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          }

        }).then(function (response) {
          window.location.replace('/')
        })
      });
