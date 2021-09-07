let tryoutVariable = {
  durasi: (60 * 100) - 1, //100 menit (99 : 59)
  timerDisplay: document.querySelector('#timer')
}

let pilihan = ["A", "B", "C", "D", "E"]

window.onload = () => {
  renderSoal()
  startTimer(tryoutVariable.durasi, tryoutVariable.timerDisplay)
}

// =========================== TIMER =========================
const startTimer = (durasi, display) => {
  let waktu = localStorage.getItem('waktu') === null ? durasi : parseInt(localStorage.getItem('waktu')),
    menit,
    detik

  let runTimer = setInterval(() => {
    menit = parseInt(waktu / 60)
    detik = parseInt(waktu % 60)

    menit = menit < 10 ? `0${menit}` : menit
    detik = detik < 10 ? `0${detik}` : detik

    display.textContent = `${menit} : ${detik}`
    localStorage.setItem('waktu', waktu.toString())
    if (--waktu < 0) {
      clearInterval(runTimer)
      showAlert()
    }
  }, 1000);

}
// =========================================================

// ============================MISC=========================

var getUrlParameter = (sParam) => {
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
      selesai()
      // window.location.replace('https://agilbiaviv.github.io/cpns/skor.html')
    }
  })
}
// ===========================================================

// ==========================SOAL=============================
const renderSoal = async () => {
  let paket = getUrlParameter('paket')
  let res = await fetch(`./assets/paketFree/${paket}.json`)
  let dataSoal = await res.json()
  let render = document.querySelector('.soal')

  //render button
  renderButton(dataSoal.length)

  for (let i = 0; i < dataSoal.length; i++) {
    let currentData = dataSoal[i]

    //create tempat soal
    let soalBox = document.createElement('div')
    Object.assign(soalBox, {
      className: "col-12 my-2",
    })
    // soalBox.classList.add('col-12 my-2')
    soalBox.setAttribute('data-soal', i + 1)

    //create info nomor soal
    let infoSoal = document.createElement('h4')
    infoSoal.textContent = `Soal Nomor ${i + 1}`
    //create paragraf soal
    let soalContent
    if (currentData.tipe == "teks") {
      soalContent = document.createElement('p')
      soalContent.innerHTML = currentData.soal
    } else {
      // else ini ga jadi dipake, bisa dihapus saja
      soalContent = document.createElement('img')
      soalContent.setAttribute('src', currentData.soal)
    }

    //create opsibox
    let opsiBox = document.createElement('ul')
    Object.assign(opsiBox, {
      className: "px-0 py-2 border-top"
    })

    //render opsi item
    for (let j = 0; j < currentData.opsi.length; j++) {
      let li = document.createElement('li')
      li.classList.add('my-2')

      let input = document.createElement('input')
      Object.assign(input, {
        type: "radio",
        name: `r${i + 1}`,
        className: "btn-check",
        id: `${pilihan[j]}${i + 1}`,
        value: `${currentData.opsi[j]}`,
        onclick: () => setJawaban({ index: i, jawaban: currentData.opsi[j] })
      })
      input.setAttribute("autoComplete", "off")

      let label = document.createElement('label')
      Object.assign(label, {
        className: "btn btn-outline-primary",
      })
      label.setAttribute("for", `${pilihan[j]}${i + 1}`)
      label.textContent = `${pilihan[j]}. ${currentData.opsi[j]}`
      //append input and label to li
      li.appendChild(input)
      li.appendChild(label)
      //append li to ul ( opsibox )
      opsiBox.appendChild(li)
    }

    //append soalContent & opsi to soalBox
    soalBox.appendChild(infoSoal)
    soalBox.appendChild(soalContent)
    soalBox.appendChild(opsiBox)

    //append soalbox to classSoal
    render.appendChild(soalBox)
    //tampilkan soal nomor 1
    setCurrentSoal(1)
    //Initiate Math Equation
    M.parseMath(render)
  }
}

const renderButton = (totalSoal) => {
  let container = document.querySelector('.nomor-soal-container')
  for (let i = 0; i < totalSoal; i++) {
    let button = document.createElement('button')
    Object.assign(button, {
      className: "px-1 btn btn-outline-primary nomor-soal",
    })
    button.setAttribute('data-nomor', i + 1)
    button.textContent = i + 1
    container.appendChild(button)
    button.addEventListener('click', () => setCurrentSoal(i + 1))
  }
}

const setJawaban = (data) => {
  let { index, jawaban } = data
  let arrJawaban = localStorage.getItem('jawaban') === null ? [] : JSON.parse(localStorage.getItem('jawaban'))

  arrJawaban[index] = jawaban

  localStorage.setItem('jawaban', JSON.stringify(arrJawaban))
  $(`button[data-nomor=${index + 1}]`)
    .removeClass('btn-outline-primary')
    .removeClass('btn-tersier')
    .addClass('btn-secondary')
}

const setCurrentSoal = (nomorSoal) => {
  //set active button
  $(`.nomor-soal[data-nomor=${nomorSoal}]`)
    .addClass('active')
    .siblings().removeClass('active')

  $(`div[data-soal=${nomorSoal}]`)
    .addClass('current')
    .siblings().removeClass('current')

  toggleTombolNavigasi(nomorSoal)
}

const toggleTombolNavigasi = (nomorSoal) => {
  $('#btn-kembali').prop('disabled', false)
  $('#btn-lanjut').removeClass('d-none')
  $('#btn-selesai').addClass('d-none')

  if (nomorSoal == 1) {
    $('#btn-kembali').prop('disabled', true)
  }

  if (nomorSoal == 110) {
    $('#btn-lanjut').addClass('d-none')
    $('#btn-selesai').removeClass('d-none')
  }
}
const tandaiSoal = () => {
  let tombolNomor = $('button.nomor-soal.active')
  let nomorSoal = tombolNomor.data('nomor')
  let arrJawaban = localStorage.getItem('jawaban') === null ? [] : JSON.parse(localStorage.getItem('jawaban'))
  arrJawaban[nomorSoal - 1] = ''

  $(tombolNomor)
    .addClass('btn-tersier')
    .removeClass('btn-outline-primary')
    .removeClass('btn-secondary')
  $(`input[name=r${nomorSoal}]`).prop('checked', false)
  localStorage.setItem('jawaban', JSON.stringify(arrJawaban))
  console.log(JSON.parse(localStorage.getItem('jawaban')))
}

const navigate = n => {
  let nomorSoal = $('.nomor-soal.active').data('nomor')
  setCurrentSoal(nomorSoal + n)
}

const selesai = () => {
  localStorage.removeItem('waktu')
  window.location.replace(`https://agilbiaviv.github.io/skor?paket=${getUrlParameter('paket')}`)
}

// kurang function untuk mendisplay soal mana saja yang sudah dijawab,
/*
  ambil value localStorage.jawaban
  parse menggunakan JSON.parse
  lakukan pengecekan, index berapa saja yang isinya tidak null / empty string ( '' )
  set class dari button nomor yang sudah terjawab menjadi btn-secondary
  set attribute checked pada opsi (radio button) di masing2 soal sesuai dengan index dari localStorage.jawaban & valuenya :p
*/
// ===========================================================
