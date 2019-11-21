let userFirstName=document.querySelector('.userFirstName').value
let userLastName=document.querySelector('.userLastName').value
let userEmail=document.querySelector('.userEmail').value
let phoneNumber=document.querySelector('.phoneNumber').value
let btn =document.querySelector('button')
let del = document.getElementsByClassName('delete')
let update= document.getElementsByClassName('update')

// btn.addEventListener('click',=>{
//
// document.getElementsByClassName('results').innerHTML= userFirstName
//
//   appendChild('results')
// })

Array.from(update).forEach(function(element) {
      element.addEventListener('click', function(){
        const userFirstName = this.parentNode.parentNode.childNodes[1].innerText
        const userLastName = this.parentNode.parentNode.childNodes[3].innerText
        const userEmail = this.parentNode.parentNode.childNodes[3].innerText
        const phoneNumber = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('profileInfo', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'userFirstName': userFirstName,
            'userLastName': userLastName,
            'userEmail':userEmail,
            'phoneNumber':phoneNumber,
          })
        })
        .then(response => {
          if (response.ok) return response.json()
        })
        .then(data => {
          console.log(data)
          window.location.reload(true)
        })
      });
});

Array.from(del).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        fetch('profileInfo', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            'userFirstName': userFirstName,
            'userLastName': userLastName,
            'userEmail':userEmail,
            'phoneNumber':phoneNumber,
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
