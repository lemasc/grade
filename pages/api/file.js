import {createReadStream} from "fs"
var https = require('https');

export default async (req, res) => {
    if(req.method != "POST") {
      return res.status(400).json({
        error: true,
        data: "method-not-allow"
      });
    }
    if (!req.body.term || !req.body.grade || !req.body.studentid) {
      return res.status(400).json({
        error: true,
      });
    }
    let fetchUrl = "https://webapp.student.co.th/application/uploads/institutes_gpa_attach/641/" + req.body.term + "/" + req.body.grade +"/" + req.body.studentid +".pdf";
    try {
        let file = await fetch(fetchUrl);
        let filename = "WPMReport_"+req.body.term +"_" +req.body.grade +"_"+ req.body.studentid +".pdf";
        
        res.setHeader("Content-Transfer-Encoding","Binary");
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);
        res.setHeader('Content-type',"application/pdf");
        https.get(fetchUrl, remote_response => remote_response.pipe(res));
    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            success: false
        })
    }
  };
  