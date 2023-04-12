let codigosLeidos = [];

const busqueda = (arreglo) => {

  let variable = "";
  let contador = 0;
  let cuenta = 0;
  arreglo.map(p => {
    cuenta = 0
    arreglo.map(x => {
      if (p == x) { cuenta++ }
    })
    if (cuenta > contador) {
      contador = cuenta;
      variable = p;
    }
  });
  location.href = `http://186.182.11.84:5002/codigoBarras?cod=${variable}`;
}

document.addEventListener("DOMContentLoaded", function() {

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
    $resultados.textContent = result.codeResult.code;
    codigosLeidos.push(result.codeResult.code);
    if (codigosLeidos.length === 10) {
      busqueda(codigosLeidos);
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

});

