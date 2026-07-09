import axios from "axios";
import fs from "fs";
import os from "os";
import path from "path";

export async function downloadPdf(
  url: string,
  noteId: string
) {

    const tempPath =
        path.join(
            os.tmpdir(),
            `${noteId}.pdf`
        );
    console.log("url of the file:",url);
    const response =
        await axios.get(url,{
            responseType:"stream"
        });

    const writer =
        fs.createWriteStream(tempPath);

    response.data.pipe(writer);

    await new Promise((resolve,reject)=>{

        writer.on("finish",resolve);

        writer.on("error",reject);

    });

    return tempPath;
}