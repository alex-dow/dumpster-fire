import fs from 'fs';
import https from 'https';
const bz2 = require('unbzip2-stream');

export async function decompress(source: string, dest: string): Promise<void> {

  const out = fs.createWriteStream(dest);

  return new Promise((resolve, reject) => {
    fs.createReadStream(source).pipe(bz2()).pipe(out);

    out.on('finish', () => {
      resolve();
    });
  });

}


export async function download(dest: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = fs.createWriteStream(dest);

    let progress = 0;
    let lastProgress = 0;
    let total = 0;
    let written = 0;

    const request = https.get("https://dumps.wikimedia.org/enwikinews/latest/enwikinews-latest-pages-articles.xml.bz2", (res) => {
      if (res.headers['content-length']) {
        total = parseInt(res.headers['content-length']);
      }
      res.pipe(writer);

      res.on("data", (chunk:any) => {
        written = written + chunk.length;
        progress = Math.ceil((written / total) * 100);

        if (progress != lastProgress) {
          console.log("Downloading: " + progress + "%");
          lastProgress = progress;
        }
      });
    });

    writer.on('finish', () => {
      resolve();
    });
    writer.on('error', (err) => {
      reject(err);
    });
  });
}