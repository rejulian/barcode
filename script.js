// let codigo2cifras = 7791293045122
// let codigo3cifras = 3560070255795
const inputCodigo = document.getElementById('input-codigo')

function buscarProducto(){
  let inputValue = inputCodigo.value
  location.href = `http://sqldata.dyndns.info:5002/codigoBarras?cod=${inputValue}`
}

function volver(){
  const date = new Date();
  let fechaActual = ""
  const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()];
  if (month < 9) {
    fechaActual = `${year}-0${month}-${day}`
    console.log(fechaActual);
  }else{
    fechaActual = `${year}-${month}-${day}`
    console.log(fechaActual);
  }

  location.href = `http://sqldata.dyndns.info:5002/inicio?fecha=${fechaActual}`
}

function calcular(codigo){

    let codigobarraSTR = codigo.toString()

   // let codigobarra =codigobarraSTR.split("", 12).join("")
    let codigobarra =codigobarraSTR.substring(0,12)
    console.log(codigobarra);

    let verificador = codigobarraSTR[12];

    let sumaPares = 0; //28
    let sumaImpares = 0; // 24
    let imparesPorTres = 0; // 72
    let paresMasMultiplicacion = 0; //98
    let redondeo = 0
    let total = 0;

    for (let i = 0; i < codigobarra.length; i++) {
        const numero = Number(codigobarraSTR[i]);
        
        if(i%2 === 0){
            sumaPares+=numero;
        }else{
            sumaImpares+=numero;
        }
    }

    imparesPorTres = sumaImpares * 3;
    
    paresMasMultiplicacion = sumaPares + imparesPorTres;

    if(paresMasMultiplicacion.toString().length === 2){
        let primerNumero = paresMasMultiplicacion.toString();
        primerNumero = Number(primerNumero[0]);
        redondeo = (primerNumero + 1) * 10;
        total = redondeo - paresMasMultiplicacion;
    }else{
        let primerNumero = paresMasMultiplicacion.toString();
        primerNumero = primerNumero[0];
        let segundoNumero = paresMasMultiplicacion.toString();
        segundoNumero = Number(segundoNumero[1]);
        redondeo = primerNumero + ((segundoNumero + 1) * 10);
        total = redondeo - paresMasMultiplicacion;
    }

    if(total == verificador){
      return true;
    }else{
      return false;
    }
}

function escanear() {

  const $resultados = document.querySelector('#resultado')  

  Quagga.init({
    inputStream: {
      constraints: {
        width: 1920,
        height: 1080,
      },
      name: "Live",
      type: "LiveStream",
      target: document.querySelector('#contenedor')
    },
    decoder: {
      readers: ["ean_reader", "upc_reader", "code_128_reader"] // tipos de códigos de barras que se van a escanear
    }
  }, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("Quagga initialization succeeded");
    Quagga.start();
  });

  Quagga.onDetected(function(result) {
    let codigo = result.codeResult.code
    $resultados.textContent = codigo;
    if(calcular(codigo) == true){
      Quagga.stop()
      // location.href = `http://186.182.11.84:5002/codigoBarras?cod=${codigo}`;
      location.href = `http://sqldata.dyndns.info:5002/codigoBarras?cod=${codigo}`
    }
  });

  Quagga.onProcessed(function (result) {
    var drawingCtx = Quagga.canvas.ctx.overlay,
        drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {

      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute("width")), parseInt(drawingCanvas.getAttribute("height")));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
            Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: "green", lineWidth: 2 });
          });
      }

      if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: "#00F", lineWidth: 2 });
        }

      if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 });
        }
    }

	});

}

//let codigosLeidos = [];
// const busqueda = (arreglo) => {
//   let variable = "";
//   let contador = 0;
//   let cuenta = 0;
//   arreglo.map(p => {
//     cuenta = 0
//     arreglo.map(x => {
//       if (p == x) { cuenta++ }
//     })
//     if (cuenta > contador) {
//       contador = cuenta;
//       variable = p;
//     }
//   });
//   location.href = `http://186.182.11.84:5002/codigoBarras?cod=${variable}`;
// }
