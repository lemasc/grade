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
      let blob = await file.blob();
      if(file.status != 200) {
        return res.status(file.status).json({
            success: false
        })
      }
      
      res.status(200).json({
          success: true,
          url: fetchUrl,
      })
      
  }
  catch(err) {
      console.log(err);
      res.status(500).json({
          success: false
      })
  }
};
