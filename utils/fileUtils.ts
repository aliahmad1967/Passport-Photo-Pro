export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is a data URL: "data:image/jpeg;base64,..."
      // we only want the base64 part
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const applyEditsAndGetBase64 = (
  file: File,
  edits: { brightness: number; contrast: number; saturation: number }
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const imageUrl = URL.createObjectURL(file);
    const image = new Image();
    image.src = imageUrl;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(imageUrl);
        return reject(new Error('Could not get canvas context'));
      }

      ctx.filter = `brightness(${edits.brightness}%) contrast(${edits.contrast}%) saturate(${edits.saturation}%)`;
      ctx.drawImage(image, 0, 0);

      const base64DataUrl = canvas.toDataURL(file.type);
      const base64Data = base64DataUrl.split(',')[1];

      URL.revokeObjectURL(imageUrl);
      resolve(base64Data);
    };

    image.onerror = (error) => {
      URL.revokeObjectURL(imageUrl);
      reject(error);
    };
  });
};

export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  fileName: string
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = 'anonymous'; 

    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          return reject(new Error('Canvas is empty'));
        }
        const file = new File([blob], fileName, { type: 'image/png' });
        resolve(file);
      }, 'image/png', 0.95);
    };

    image.onerror = (error) => {
      reject(error);
    };
  });
};