import fs from "fs"

export const removeLocalFile = (filePath)=>{
    if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}