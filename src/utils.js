export function processImageFile(file, self, setUrl = false){
    var blob = new Blob([file]);
    window.URL = window.URL || window.webkitURL;
    var blobURL = window.URL.createObjectURL(blob);
    
    var image = new Image();
    image.src = blobURL;
    
    if (setUrl)
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

export function downloadImageFile(url, self){
    var image = new Image();
    image.src = url;
    image.crossOrigin = "*";

    self.setLocalUrl(url)

    var onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0);
        ctx.canvas.toBlob((blob) => { 
            self.setLocalFile(new File([blob], "test.jpg", {
                type: 'image/jpeg',
                lastModified: Date.now()
            }));
            processImageFile(self.uploadedFile,self)
        }, 'image/jpeg', 1);
    };
    image.onload = onload;
}