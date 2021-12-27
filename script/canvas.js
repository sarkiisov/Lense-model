let lenseMode = 'converging';
let focalLenght = 150;
let imageScale = 0.3;
const enableRays = true;
let objectCoordX = 50;

let raysArrowColor = '#FFB68D';
let raysArrowPattern = [8, 16];
let imaginaryObjectOpacity = 0.3;

window.onload = () => {
    const canvas = document.querySelector('#converging-lense');
    const ctx = canvas.getContext('2d');

    const lenseObjectImage = document.querySelector('#lense-object');
    const lenseObjectImageInverted = document.querySelector('#lense-object-inverted');
    const originalImageWidth = lenseObjectImage.width;
    const originalImageHeight = lenseObjectImage.height;

    canvas.width = 1200;
    canvas.height = 600;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    renderCanvas();

    function drawHorizontalAxis(){
        ctx.strokeStyle = '#A9A9A9';
        ctx.lineWidth = 3;

        ctx.beginPath();
        ctx.moveTo(0, centerY);
        ctx.lineTo(canvas.width, centerY);
        ctx.stroke();
    }

    function drawLineWithArrows(x0, y0, x1, y1, aWidth, aLength, arrowType){
        let startPoint = (arrowType == 'diverging') ? aLength : 0;
        let dx = x1 - x0;
        let dy = y1 - y0;
        let angle = Math.atan2(dy, dx);
        let length = Math.sqrt(dx * dx + dy * dy);

        ctx.translate(x0, y0 + startPoint);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        if(arrowType == 'converging') length += 2 * aLength;
        ctx.lineTo(length, 0);
        if(arrowType == 'diverging'){
            ctx.moveTo(-aLength, -aWidth);
            ctx.lineTo(0, 0);
            ctx.lineTo(-aLength, aWidth);
            ctx.moveTo(length + aLength, -aWidth);
            ctx.lineTo(length, 0);
            ctx.lineTo(length + aLength, aWidth);
        }
        if(arrowType == 'converging'){
            ctx.moveTo(aLength, -aWidth);
            ctx.lineTo(0, 0);
            ctx.lineTo(aLength, aWidth);
            ctx.moveTo(length - aLength, -aWidth);
            ctx.lineTo(length, 0);
            ctx.lineTo(length - aLength, aWidth);
        }
        ctx.stroke();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    }

    function drawFocusDegrees(x0, y0){
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        let arcRadius = 3;
        ctx.fillStyle = '#000000';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';

        ctx.arc(x0 - 1 * focalLenght, y0, arcRadius, 0, 2 * Math.PI);
        ctx.fillText('F', x0 - 1 * focalLenght, y0 + 30);

        ctx.arc(x0 + focalLenght, y0, arcRadius, 0, 2 * Math.PI);
        ctx.fillText('F', x0 + focalLenght, y0 + 30);

        ctx.arc(x0 - 2 * focalLenght, y0, arcRadius, 0, 2 * Math.PI);
        ctx.fillText('2F', x0 - 2 * focalLenght, y0 + 30);

        ctx.arc(x0 + 2 * focalLenght, y0, arcRadius, 0, 2 * Math.PI);
        ctx.fillText('2F', x0 + 2 * focalLenght, y0 + 30);
        ctx.fill();
    }

    function drawLenseObject(lenseObjectImage, focalDistanting, imageScale){
        let imageWidth = originalImageWidth * imageScale;
        let imageHeight = originalImageHeight * imageScale;
        let bottomRightX = centerX - focalDistanting + imageWidth / 2;
        let bottomRightY = centerY;
        ctx.drawImage(lenseObjectImage, 0, 0, originalImageWidth, originalImageHeight, bottomRightX - imageWidth, bottomRightY  - imageHeight, imageWidth, imageHeight);
        return { imageTopX: bottomRightX - imageWidth, imageTopY: bottomRightY  - imageHeight };
    }

    function getIntersectConvergingImageCoords(imageTopX, imageTopY){
        let xa = imageTopX + originalImageWidth * imageScale / 2;
        let ya = imageTopY;
        let xb = centerX;
        let yb = centerY;
        let xc = centerX;
        let yc = centerY - originalImageHeight * imageScale;
        let xd = centerX + focalLenght;
        if(imageTopX + originalImageWidth * imageScale / 2 > centerX) {
            xd = centerX - focalLenght;
        }
        let yd = centerY;

        let t = ((xc - xa) * (yb - ya) - (xb - xa) * (yc - ya)) / ((xb - xa) * (yd - yc) - (xd - xc) * (yb - ya));
        let convIntX = xc + (xd - xc) * t;
        let convIntY = yc + (yd - yc) * t;

        let isInverted = false;
        if(enableRays && Math.abs(imageTopX + originalImageWidth * imageScale / 2 - (centerX - focalLenght)) >= 1 && Math.abs(imageTopX + originalImageWidth * imageScale / 2 - (centerX + focalLenght)) >= 1) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = raysArrowColor;
            ctx.setLineDash(raysArrowPattern);
            if(!(imageTopX + originalImageWidth * imageScale / 2 > centerX - focalLenght && imageTopX + originalImageWidth * imageScale / 2 < centerX + focalLenght)){
                isInverted = true;
                ctx.beginPath();
                ctx.moveTo(xa, ya);
                ctx.lineTo(xc, yc);
                ctx.lineTo(convIntX, convIntY);
                ctx.moveTo(xa, ya);
                ctx.lineTo(centerX, convIntY);
                ctx.lineTo(convIntX, convIntY);
                ctx.stroke();
            } else {
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.lineTo(convIntX, convIntY);
                ctx.lineTo(xd, centerY);
                ctx.stroke();
            }
            ctx.setLineDash([]);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
        }

        return { convIntX, convIntY, isInverted };
    }

    function getIntersectDivergingImageCoords(imageTopX, imageTopY){
        let isInverted = false;
        let xa = imageTopX + originalImageWidth * imageScale / 2;
        let ya = imageTopY;
        let xb = centerX;
        let yb = centerY;
        let xc = centerX - focalLenght;
        if(imageTopX + originalImageWidth * imageScale / 2 > centerX) {
            xc = centerX + focalLenght;
        }
        let yc = centerY;
        let xd = centerX;
        let yd = imageTopY;

        let t = ((xc - xa) * (yb - ya) - (xb - xa) * (yc - ya)) / ((xb - xa) * (yd - yc) - (xd - xc) * (yb - ya));
        let convIntX = xc + (xd - xc) * t;
        let convIntY = yc + (yd - yc) * t;

        if(enableRays) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = raysArrowColor;
            ctx.setLineDash(raysArrowPattern);
            ctx.beginPath();
            ctx.moveTo(xa, ya);
            ctx.lineTo(xb, yb);
            ctx.lineTo(xa, ya);
            ctx.lineTo(xd, yd);
            ctx.moveTo(xc, yc);
            ctx.lineTo(xd, yd);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
        }

        return { convIntX, convIntY, isInverted };
    }

    function drawFinalImage(topX, topY, isInverted){
        let imageWidth = originalImageWidth * imageScale;
        let imageHeight = originalImageHeight * imageScale;
        let finalImageScale = Math.abs((topY - centerY) / imageHeight);

        if(isInverted){
            ctx.drawImage(lenseObjectImageInverted, 0, 0, originalImageWidth, originalImageHeight, topX - imageWidth * finalImageScale / 2, topY - imageHeight * finalImageScale, imageWidth * finalImageScale, imageHeight * finalImageScale);
        } else {
            ctx.globalAlpha = imaginaryObjectOpacity;
            ctx.drawImage(lenseObjectImage, 0, 0, originalImageWidth, originalImageHeight, topX - imageWidth * finalImageScale / 2, topY, imageWidth * finalImageScale, imageHeight * finalImageScale);
            ctx.globalAlpha = 1;
        }
    }

    function renderCanvas(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawHorizontalAxis();
        drawFocusDegrees(centerX, centerY);
        if(lenseMode == 'converging'){
            drawLineWithArrows(600, 150, 600, 450, 5, 8, 'converging');
            let { imageTopX, imageTopY } = drawLenseObject(lenseObjectImage, objectCoordX, imageScale);
            let { convIntX, convIntY, isInverted } = getIntersectConvergingImageCoords(imageTopX, imageTopY);
            drawFinalImage(convIntX, convIntY, isInverted);
        }
        else if(lenseMode == 'diverging'){
            drawLineWithArrows(600, 150, 600, 450, 5, 8, 'diverging');
            let { imageTopX, imageTopY } = drawLenseObject(lenseObjectImage, objectCoordX, imageScale);
            let { convIntX, convIntY, isInverted } = getIntersectDivergingImageCoords(imageTopX, imageTopY);
            drawFinalImage(convIntX, convIntY, isInverted);
        }
    }

    const numberInput = document.querySelector('#lense-toggler');
    numberInput.addEventListener('input', (e) => {
        objectCoordX = e.target.value;
        renderCanvas();
    });

    const lenseTypeInput = document.querySelector('#lense-type-select');
    lenseTypeInput.addEventListener('change', (e) => {
        lenseMode = e.target.value;
        renderCanvas();
    });

    const lenseObjectScale = document.querySelector('#lense-object-scale');
    lenseObjectScale.addEventListener('input', (e) => {
        imageScale = e.target.value;
        renderCanvas();
    });

    const aalenseFocalLength = document.querySelector('#lense-focal-lenght');
    aalenseFocalLength.addEventListener('input', (e) => {
        focalLenght = parseInt(e.target.value);
        renderCanvas();
    });
};