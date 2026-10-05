const fs=require("fs");fs.copyFileSync("data/db.json","data/runtime.json");fs.rmSync("data/uploads",{recursive:true,force:true});console.log("Setu demo database reset.");
