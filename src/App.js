import { useState } from 'react';
import './App.css';
import QRCodeSVG from 'qrcode.react';

function App() {
  const [qrCode, setQrCode] = useState('');

  const triggerDownload = (imgURI, extension) => {
    var evt = new MouseEvent('click', {
      view: window,
      bubbles: false,
      cancelable: true
    });
  
    var a = document.createElement('a');
    a.setAttribute('download', 'sperbtecnologia.com.br_qrcode.'+extension);
    a.setAttribute('href', imgURI);
    a.setAttribute('target', '_blank');
  
    a.dispatchEvent(evt);
  }

  const startDownload = () => {
    const svg = document.querySelector('svg');
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const data = (new XMLSerializer()).serializeToString(svg);
    const DOMURL = window.URL || window.webkitURL || window;
  
    const img = new Image();
    const svgBlob = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    const url = DOMURL.createObjectURL(svgBlob);
  
    img.onload = function () {
      ctx.drawImage(img, 0, 0);//, 512, 512);
      DOMURL.revokeObjectURL(url);
  
      const imgURI = canvas
          .toDataURL('image/png')
          .replace('image/png', 'image/octet-stream');
  
      triggerDownload(imgURI, 'png');
    };
    img.src = url;
  }

  const startDownloadSVG = () => {
    const svg = document.getElementById("qrcodesvg");
    const serializer = new XMLSerializer();
    let source = serializer.serializeToString(svg);
    
    if(!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
        source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
    }
    if(!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
        source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
    }
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    
    var url = "data:image/svg+xml;charset=utf-8,"+encodeURIComponent(source);
    triggerDownload(url, 'svg');
  }
  
  
  return (
    <div className="App">
      <header className="App-header">
        <div className="form">
          <input
            value={qrCode}
            placeholder="Insira aqui o texto do QRCode"
            onChange={(e) => setQrCode(e.target.value)}></input>
          
          <div className="qrcode">
            <QRCodeSVG id="qrcodesvg" renderAs="svg" size={380} value={qrCode} level={'L'}/>
          </div>

          <canvas id="canvas"
            width={380}
            height={380}></canvas>
          
          <button
            onClick={startDownloadSVG}>
            Download SVG
          </button>
    
          <button
            onClick={startDownload}>
            Download PNG
          </button>
          <p className="madeby" >Feito com ♥ por 
            <a
              href="https://sperbtecnologia.com.br"
              target="_blank"
              rel="noreferrer">
              Sperb Tecnologia
            </a>
          </p>
        </div>
      </header>
    </div>
  );
}

export default App;
