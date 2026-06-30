import fs from "fs";
import {PDFParse} from "pdf-parse";

const extractPdfText =
 async (
  filePath: string
 ) => {

  const buffer = fs.readFileSync(
   filePath
  );

  const unit8Array = new Uint8Array(buffer);
  const parser = new PDFParse(
   unit8Array
  );
  
  const data=await parser.getText();

  return data.text;
};

export default extractPdfText;