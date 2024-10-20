document
  .getElementById('show-more-btn')
  .addEventListener('click', showMoreAlbums)

function showMoreAlbums() {
  const moreAlbums = document.getElementById('more-albums')
  const showMoreBtn = document.getElementById('show-more-btn')
  moreAlbums.classList.toggle('d-none')

  // Change button text based on the state
  if (moreAlbums.classList.contains('d-none')) {
    showMoreBtn.textContent = 'Show More'
  } else {
    showMoreBtn.textContent = 'Show Less'
  }
}

// fade up
document.addEventListener('DOMContentLoaded', function () {
  AOS.init({
    duration: 1000,
    once: true,
  })
})

// Artist Infos API last.fm
const apiKey = ''
const artistName = 'Death'

function fetchArtistInfo() {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
    artistName
  )}&api_key=${apiKey}&format=json`

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log('Artist Info:', data)
      if (data && data.artist) {
        const artistContainer = document.getElementById('artist-info')

        let bio = data.artist.bio
          ? data.artist.bio.summary
          : 'Biography not available.'

        const disclaimer = 'There are multiple artists sharing the name Death;'
        if (bio.startsWith(disclaimer)) {
          bio = bio.replace(disclaimer, '').trim()
        }

        let textWithoutLink = bio.replace(/<a\b[^>]*>.*?<\/a>/i, '')
        let linkElement = bio.match(/<a\b[^>]*>.*?<\/a>/i)[0]
        if (!linkElement.includes('target="_blank"')) {
          linkElement = linkElement.replace('<a', '<a target="_blank"')
        }

        artistContainer.innerHTML = `
                  <h2>${data.artist.name}</h2>
                  <p>${textWithoutLink}${linkElement}</p>
              `
      } else {
        document.getElementById('artist-info').innerHTML =
          '<p>No information found for this artist.</p>'
      }
    })
    .catch((error) => {
      console.error('Error fetching artist info:', error)
      document.getElementById('artist-info').innerHTML =
        '<p>Failed to load artist information. Please try again later.</p>'
    })
}

// Events
function fetchArtistEvents() {
  const url = `https://ws.audioscrobbler.com/2.0/?method=artist.getevents&artist=${encodeURIComponent(
    artistName
  )}&api_key=${apiKey}&format=json`

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log('Artist Events:', data)

      const eventContainer = document.getElementById('event-container')

      if (data && data.events && data.events.event) {
        const events = Array.isArray(data.events.event)
          ? data.events.event
          : [data.events.event]

        events.forEach((event) => {
          const eventCard = document.createElement('div')
          eventCard.className = 'event-card'

          eventCard.innerHTML = `
                        <h3>${event.title || 'Event'}</h3>
                        <p><strong>Venue:</strong> ${
                          event.venue.name || 'N/A'
                        }</p>
                        <p><strong>Location:</strong> ${
                          event.venue.location || 'N/A'
                        }</p>
                        <p><strong>Date:</strong> ${
                          event.startDate || 'N/A'
                        }</p>
                        <a href="${
                          event.url
                        }" target="_blank" class="btn">More Info</a>
                    `

          eventContainer.appendChild(eventCard)
        })
      } else {
        eventContainer.innerHTML =
          '<p>No upcoming events found for this artist.</p>'
      }
    })
    .catch((error) => {
      console.error('Error fetching events:', error)
      document.getElementById('event-container').innerHTML =
        '<p>Failed to load events. Please try again later.</p>'
    })
}

document.addEventListener('DOMContentLoaded', () => {
  fetchArtistInfo()
  fetchArtistEvents()
})

// Form API Email.JS
emailjs.init({
  publicKey: '',
})

document
  .getElementById('contact-form')
  .addEventListener('submit', function (event) {
    event.preventDefault()

    const spinnerElement = document.getElementById('spinner-element')
    const form = document.getElementById('contact-form')
    const name = document.getElementById('name').value.trim()
    const email = document.getElementById('email').value.trim()
    const phone = document.getElementById('phone').value.trim()
    const message = document.getElementById('message').value.trim()
    const formStatus = document.getElementById('form-status')

    form.classList.add('d-none')
    spinnerElement.classList.remove('d-none')

    if (!name) {
      formStatus.innerHTML = `<p class="h3"> Please enter your name. </p>`
      return
    }

    if (!validateEmail(email)) {
      formStatus.innerHTML = `<p class="h3"> Please enter a valid email address. </p>`
      return
    }

    if (!validatePhone(phone)) {
      formStatus.innerHTML = `<p class="h3"> Please enter a valid phone number. </p>`
      return
    }

    if (!message) {
      formStatus.innerHTML = `<p class="h3"> Please enter your message. </p>`
      return
    }

    emailjs
      .send('service_gqw4uck', 'template_0hzd2zu', {
        name: name,
        email: email,
        phone: phone,
        message: message,
      })
      .then(() => {
        formStatus.innerHTML = `<p class="h3"> Message sent successfully! </p>`
        document.getElementById('contact-form').reset()
        form.classList.remove('d-none')
        spinnerElement.classList.add('d-none')
      })
      .catch(() => {
        formStatus.innerHTML = `<p class="h3"> Error sending the message. Please try again. </p>`
        form.classList.remove('d-none')
        spinnerElement.classList.add('d-none')
      })
  })

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailPattern.test(email)
}

function validatePhone(phone) {
  const phonePattern = /^\d{10,15}$/
  return phonePattern.test(phone)
}
