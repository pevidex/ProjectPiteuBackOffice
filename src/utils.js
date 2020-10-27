export function createImageObject(file, self){
    var blob = new Blob([file]);
    window.URL = window.URL || window.webkitURL;
    var blobURL = window.URL.createObjectURL(blob);
    
    var image = new Image();
    image.src = blobURL;
    
    self.setLocalUrl(blobURL)

    image.onload = function () {
        var canvas = document.createElement('canvas');    
        var width = image.width;
        var height = image.height;
        var ctx = canvas.getContext("2d");
        ctx.canvas.width  = width;
        ctx.canvas.height = height;
        ctx.drawImage(image, 0, 0, width, height, 0, 0, canvas.width, canvas.height);

        ctx.canvas.toBlob((blob) => {
            self.setLocalFile(new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
            }));
        }, 'image/jpeg', 0.6); //value to change image quality
    }
}