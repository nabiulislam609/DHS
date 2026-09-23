/**
 * Utility to process, resize and optimize user uploaded images from their device
 * into lightweight base64 Data URLs so they can be stored in localStorage safely.
 */
export const compressImageFile = (
  file: File,
  maxWidth = 500,
  maxHeight = 500,
  quality = 0.82
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('দয়া করে একটি ইমেজ ফাইল নির্বাচন করুন (JPG, PNG, ইত্যাদি)'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('ছবি পড়তে সমস্যা হয়েছে'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('ছবি প্রসেস করতে ত্রুটি হয়েছে'));
      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Use standard jpeg for compact size and broad compatibility
        const optimizedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(optimizedDataUrl);
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
};
