import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useForm } from "react-hook-form";
import $ from "jquery"
dayjs.extend(customParseFormat);

export default function Home() {
  let [config, setConfig] = useState(null);
  let { register, handleSubmit } = useForm();
  useEffect(async () => {
    let cfg = await fetch("/config.json");
    let data = await cfg.json();
    console.log(data);
    setConfig(data);
  }, []);
  let $mathayom = 0;
  async function submit(data) {
    console.log(data);
    $("#notfound").css("display", "none");
    $("#filefound").css("display", "none");
    $("#filefound").find('a').remove();
    var $inputs = $("#gradefrm").find("input, select, button, textarea");
    let body = new URLSearchParams(data).toString();
    try {
      let checkFile = await fetch("/api/check", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });
      let res = await checkFile.json();
      if(!res.success) {
        throw new Error("File not found");
      }
      
      $("#filefound").fadeIn();
      console.log(res.url);
      var direct = document.createElement("a");
      direct.className = "alert-link"
      direct.innerText = "ที่นี่"
      direct.href= res.url;
      direct.setAttribute("download","");
      direct.setAttribute("target","_blank");
      $("#filefound>span").append(direct);
      $("#gradefrm").submit();
      //direct.click();
      //$("#direct").attr("download",res.url);
      //document.getElementById("direct").click();
    }
    catch (err) {
      console.error(err);
      $("#notfound").fadeIn();
    }
    finally {
      $inputs.prop("disabled", false);
      window.scrollTo(0, 0);
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>EnquireStudentScore-WPM</title>
        <link
          href="https://fonts.googleapis.com/css?family=Mitr:300,400|Sarabun&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="alert center alert-danger" id="notfound">
            <strong>ล้มเหลว!</strong>{" "}
            <span className="light">
              ไม่พบข้อมูลในระบบ กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง
            </span>
          </div>
          <div className="alert center alert-success" id="filefound">
            <strong>สำเร็จ!</strong>{" "}
            <span className="light">
              ไฟล์ควรโหลดภายในไม่กี่วินาที หากไม่ คลิก
            </span>
          </div>
      <main>
        <form action="/api/file" id="gradefrm" onSubmit={handleSubmit(submit)}method="post">
         
          {config && (
            <Fragment>
              <div className="form-group">
                <label htmlFor="term">เลือกภาคเรียน: </label>
                <select
                  name="term"
                  id="term"
                  className="form-control center"
                  title="Select Term"
                  ref={register({ required: true })}
                >
                  <option value="">กรุณาเลือก</option>
                  {config.data.map((data) => {
                    return data.term.map((v, i) => {
                      let curDate = dayjs(v.date, "DD/MM/YYYY");
                      let $year;
                      switch (curDate.format("YYYY")) {
                        case "2018":
                          $year = 2561;
                          break;
                        case "2019":
                          $year = 2562;
                          break;
                        case "2020":
                          $year = 2563;
                          break;
                        case "2021":
                          $year = 2564;
                          break;
                      }
                      if (i % 2 !== 0) {
                        $year = $year - 1;
                      }
                      return (
                        <option value={v.id + "/" + data.yearcode}>
                          ภาคเรียนที่ {(i % 2) + 1}/{$year}
                        </option>
                      );
                    });
                  })}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="grade">เลือกระดับชั้น:</label>
                <select
                  name="grade"
                  id="grade"
                  className="form-control center"
                  title="Select Grade"
                  ref={register({ required: true })}
                >
                  <option value="">กรุณาเลือก</option>
                  {config.class.map(($room, $i) => {
                    if (($i + 1) % 4 === 1) {
                      $mathayom++;
                    }
                    return (
                      <option value={$room}>
                        ม. {$mathayom}/{($i % 4) + 1}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="studentid">ป้อนรหัสประจำตัวนักเรียน 5 หลัก:</label>
                <input
                  name="studentid"
                  type="number"
                  id="studentid"
                  class="form-control center"
                  ref={register({ required: true, maxLength: 5})}
                  title="Enter Student ID"
                />
              </div>
            </Fragment>
          )}
          <input value="ดูผลการเรียน" id="getgrade" class="btn btn-success" type="submit"></input>
        </form>
      </main>

      <footer className={styles.footer + " footer"}>
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <i>
                EnquireStudentScore V3.5 (NextJS)
                <br />
              </i>
              <span className="copyright">
                Copyright &copy; 2013- Student Care Solution
                <br />
              </span>
            </div>
            <div className="col-md-6">
              <a href="http://student.co.th" title="Student Care Website">
                <img id="studentimg" src="/scs_logo.png" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
