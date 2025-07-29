
        document.addEventListener('DOMContentLoaded', function() {
            
            const contentInput = document.getElementById('content');
            const sizeInput = document.getElementById('size');
            const sizeValue = document.getElementById('size-value');
            const fgColorInput = document.getElementById('fgColor');
            const bgColorInput = document.getElementById('bgColor');
            const fgPreview = document.getElementById('fg-preview');
            const bgPreview = document.getElementById('bg-preview');
            const fgColorValue = document.getElementById('fg-color-value');
            const bgColorValue = document.getElementById('bg-color-value');
            const generateBtn = document.getElementById('generate-btn');
            const resultContainer = document.getElementById('result');
            const qrcodeContainer = document.getElementById('qrcode');
            const infoContent = document.getElementById('info-content');
            const infoSize = document.getElementById('info-size');
            const infoFgColor = document.getElementById('info-fgColor');
            const infoBgColor = document.getElementById('info-bgColor');
            const downloadPngBtn = document.getElementById('download-png');
            const downloadSvgBtn = document.getElementById('download-svg');
            
            
            let qrcode = null;
            
           
            sizeInput.addEventListener('input', function() {
                sizeValue.textContent = this.value + 'px';
            });
            
            fgColorInput.addEventListener('input', function() {
                fgPreview.style.backgroundColor = this.value;
                fgColorValue.textContent = this.value;
            });
            
            bgColorInput.addEventListener('input', function() {
                bgPreview.style.backgroundColor = this.value;
                bgColorValue.textContent = this.value;
            });
            
            
            generateBtn.addEventListener('click', function() {
                const content = contentInput.value.trim();
                
                if (!content) {
                    alert('Por favor, insira um conteúdo para o QR Code.');
                    return;
                }
                
                
                qrcodeContainer.innerHTML = '';
                
                qrcode = new QRCode(qrcodeContainer, {
                    text: content,
                    width: parseInt(sizeInput.value),
                    height: parseInt(sizeInput.value),
                    colorDark: fgColorInput.value,
                    colorLight: bgColorInput.value,
                    correctLevel: QRCode.CorrectLevel.H
                });
                
         
                infoContent.textContent = content;
                infoSize.textContent = sizeInput.value + 'px';
                infoFgColor.textContent = fgColorInput.value;
                infoBgColor.textContent = bgColorInput.value;
          
                resultContainer.style.display = 'block';
                
            
                setTimeout(() => {
                    resultContainer.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            });
    
            downloadPngBtn.addEventListener('click', function() {
                if (!qrcode) return;
                
                const canvas = qrcodeContainer.querySelector('canvas');
                if (canvas) {
                    const link = document.createElement('a');
                    link.download = 'qrcode.png';
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                }
            });
            
            
            downloadSvgBtn.addEventListener('click', function() {
                if (!qrcode) return;
                
              
                const canvas = qrcodeContainer.querySelector('canvas');
                if (canvas) {
                    const size = parseInt(sizeInput.value);
                    const svgNS = "http://www.w3.org/2000/svg";
              
                    const svg = document.createElementNS(svgNS, "svg");
                    svg.setAttribute("width", size);
                    svg.setAttribute("height", size);
                    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
                    
                   
                    const background = document.createElementNS(svgNS, "rect");
                    background.setAttribute("width", size);
                    background.setAttribute("height", size);
                    background.setAttribute("fill", bgColorInput.value);
                    svg.appendChild(background);
                    
         
                    const ctx = canvas.getContext('2d');
                    const imageData = ctx.getImageData(0, 0, size, size);
                    const data = imageData.data;
     
                    const cellSize = size / 33; 
                    
          
                    for (let y = 0; y < size; y += cellSize) {
                        for (let x = 0; x < size; x += cellSize) {
                            const pixelPos = (Math.floor(y) * size + Math.floor(x)) * 4;
                            
              
                            if (data[pixelPos] === 0) {
                                const cell = document.createElementNS(svgNS, "rect");
                                cell.setAttribute("x", x);
                                cell.setAttribute("y", y);
                                cell.setAttribute("width", cellSize);
                                cell.setAttribute("height", cellSize);
                                cell.setAttribute("fill", fgColorInput.value);
                                svg.appendChild(cell);
                            }
                        }
                    }
                    
                 
                    const serializer = new XMLSerializer();
                    const svgString = serializer.serializeToString(svg);
                    const svgBlob = new Blob([svgString], {type: "image/svg+xml;charset=utf-8"});
                    
               
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(svgBlob);
                    link.download = 'qrcode.svg';
                    link.click();
                }
            });
        });
    


