import {createReadStream} from "fs"
var https = require('https');

export default async (req, res) => {
    if(req.method != "GET") {
      return res.status(400).json({
        error: true,
        data: "method-not-allow"
      });
    }
    if (!req.query.term || !req.query.grade || !req.query.studentid) {
      return res.status(400).json({
        error: true,
      });
    }
    let fetchUrl = "https://webapp.student.co.th/application/uploads/institutes_gpa_attach/641/" + req.query.term + "/" + req.query.grade +"/" + req.query.studentid +".pdf";
    try {
        let file = await fetch(fetchUrl);
        let filename = "WPMReport_"+req.query.term +"_" +req.query.grade +"_"+ req.query.studentid +".pdf";
        
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
  