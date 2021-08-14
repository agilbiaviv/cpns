const getUrlParameter = (sParam) => {
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

const hitungSkor = async() => {
  let paket = getUrlParameter('paket')
  let res = await fetch(`./assets/paketFree/${paket}.json`)
  let dataSoal = await res.json()

  // console.log(dataSoal)
}