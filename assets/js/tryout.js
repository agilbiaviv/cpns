let tryoutVariable = {
  durasi : (60 * 100) - 1, //100 menit (99 : 59)
  timerDisplay: document.querySelector('#timer')
}

let pilihan = ["A", "B", "C", "D", "E"]

window.onload = () => {
  // startTimer(tryoutVariable.durasi, tryoutVariable.timerDisplay)
  renderSoal()
}

// =========================== TIMER =========================
const startTimer = (durasi, display) => {
  let waktu = durasi,
      menit,
      detik

  let runTimer = setInterval(() => {
    menit = parseInt(waktu / 60)
    detik = parseInt(waktu % 60)

    menit = menit < 10 ? `0${menit}` : menit
    detik = detik < 10 ? `0${detik}` : detik

    display.textContent = `${menit} : ${detik}`

    if(--waktu < 0) {
      // alert('Waktu Habis')
      clearInterval(runTimer)
      showAlert()
    }
  }, 1000);

}
// =========================================================

// ============================UTIL=========================

var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

const showAlert = () => {
  let timerInterval
  Swal.fire({
    title: 'Waktu Habis!',
    html: 'Mengalihkan ke halaman skor <b></b> detik.',
    timer: 2000,
    timerProgressBar: true,
    didOpen: () => {
      const b = Swal.getHtmlContainer().querySelector('b')
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft()
      }, 100)
    },
    willClose: () => {
      clearInterval(timerInterval)
    }
  }).then((result) => {
    /* Read more about handling dismissals below */
    if (result.dismiss === Swal.DismissReason.timer) {
      window.location.replace('www.google.com')
    }
  })
}
// ===========================================================

// ==========================SOAL=============================
const renderSoal = async() => {
  let paket = getUrlParameter('paket')
  let res = await fetch(`./assets/paketFree/${paket}.json`)
  let dataSoal = await res.json()
  console.log(dataSoal)
  let render = document.querySelector('.soal')


  for (let i = 0; i < dataSoal.length; i++) {
    let currentData = dataSoal[i]

    //create tempat soal
    let soalBox = document.createElement('div')
    Object.assign(soalBox, {
      className : "col-12 my-2",
    })
    // soalBox.classList.add('col-12 my-2')
    soalBox.setAttribute('data-soal', i+1)

      //create paragraf soal
    let soalContent = document.createElement('p')
    soalContent.textContent = currentData.soal

    console.log(soalContent)
    //create opsibox
    let opsiBox = document.createElement('ul')
    Object.assign(opsiBox, {
      className : "px-0 py-2 border-top"
    })

    //render opsi item
    for (let j = 0; j < currentData.opsi.length; j++) {
      let li = document.createElement('li')
      li.classList.add('my-2')

      let input = document.createElement('input')
      Object.assign(input, {
        type : "radio",
        name : `r${i}`,
        className : "btn-check",
        id : `${pilihan[j]}${i+1}`,
      })
      input.setAttribute("autoComplete", "off")

      let label = document.createElement('label')
      Object.assign(label, {
        className : "btn btn-outline-primary",
      })
      label.setAttribute("for", `${pilihan[j]}${i+1}`)
      label.textContent = currentData.opsi[j]
      //append input and label to li
      li.appendChild(input)
      li.appendChild(label)
      //append li to ul ( opsibox )
      opsiBox.appendChild(li)
    }

    //append soalContent & opsi to soalBox
    soalBox.appendChild(soalContent)
    soalBox.appendChild(opsiBox)

    //append soalbox to classSoal
    render.appendChild(soalBox)
  }
}


// ===========================================================
