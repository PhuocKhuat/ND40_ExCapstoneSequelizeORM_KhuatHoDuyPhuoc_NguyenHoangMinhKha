import compress_images from "compress-images";

// Hàm nén ảnh đơn lẻ
const compressImage = async (inputPath, outputPath) => {
  return new Promise((resolve, reject) => {
    compress_images(
      inputPath,
      outputPath,
      { compress_force: false, statistic: true, autoupdate: true },
      false,
      { jpg: { engine: "mozjpeg", command: ["-quality", "20"] } },
      { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
      { svg: { engine: "svgo", command: "--multipass" } },
      {
        gif: {
          engine: "gifsicle",
          command: ["--colors", "64", "--use-col=web"],
        },
      },
      function (error, completed, statistic) {
        if (error) {
          reject(error);
        } else {
          resolve(completed);
        }
      }
    );
  });
};

export default compressImage;