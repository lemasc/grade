import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { useForm } from "react-hook-form";
import $ from "jquery";
dayjs.extend(customParseFormat);
dayjs.extend(buddhistEra);

type Config = {
  class: number[][];
  data: {
    [yearcode: string]: {
      [termcode: string]: string;
    };
  };
};

export default function Home() {
  const [config, setConfig] = useState<Config>(null);
  const [fetching, setFetching] = useState(false);
  const { register, handleSubmit } = useForm();
  useEffect(() => {
    (async () => {
      const data = await fetch(
        `/config.json?t=${(Math.random() * 100).toFixed(2)}`
      ).then((c) => c.json());
      console.log(data);
      setConfig(data);
    })();
  }, []);

  async function submit(
    data: string | string[][] | Record<string, string> | URLSearchParams
  ) {
    if (fetching) return;
    console.log(data);
    $("#notfound").css("display", "none");
    $("#filefound").css("display", "none");
    $("#filefound").find("a").remove();
    var $inputs = $("#gradefrm").find("input, select, button, textarea");
    let body = new URLSearchParams(data).toString();
    try {
      setFetching(true);
      let checkFile = await fetch("/api/check", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
      });
      let res = await checkFile.json();
      if (!res.success) {
        throw new Error("File not found");
      }

      $("#filefound").fadeIn();
      console.log(res.url);
      var direct = document.createElement("a");
      direct.className = "alert-link";
      direct.innerText = "ที่นี่";
      direct.href = res.url;
      direct.setAttribute("download", "");
      direct.setAttribute("target", "_blank");
      $("#filefound>span").append(direct);
      $("#gradefrm").submit();
      //direct.click();
      //$("#direct").attr("download",res.url);
      //document.getElementById("direct").click();
      setFetching(false);
    } catch (err) {
      console.error(err);
      $("#notfound").fadeIn();
      setFetching(false);
    } finally {
      $inputs.prop("disabled", false);
      window.scrollTo(0, 0);
    }
  }
  // Chunk function from https://stackoverflow.com/a/60779547
  const chunk = (array: any[], size: number) =>
    array.reduce((acc: any[], _: any, i: number) => {
      if (i % size === 0) acc.push(array.slice(i, i + size));
      return acc;
    }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>EnquireStudentScore-WPM</title>
      </Head>
      <header className={styles.header}>
        <img className="center" src="/logo_wpm.png" width="100" />
        <h2>ระบบแจ้งผลการเรียนจาก Student Care</h2>
        <h5 style={{ fontStyle: "italic" }}>แบบรายงานผลการเรียนรายบุคคล PDF</h5>
      </header>
      <div className="alert center alert-danger" id="notfound">
        <strong>ล้มเหลว!</strong>{" "}
        <span className="light">
          ไม่พบข้อมูลในระบบ กรุณาตรวจสอบข้อมูลแล้วลองใหม่อีกครั้ง
        </span>
      </div>
      <div className="alert center alert-success" id="filefound">
        <strong>สำเร็จ!</strong>{" "}
        <span className="light">ไฟล์ควรโหลดภายในไม่กี่วินาที หากไม่ คลิก</span>
      </div>
      <main className={styles.main}>
        <form
          action="/api/file"
          id="gradefrm"
          onSubmit={handleSubmit(submit)}
          method="get"
        >
          {config && (
            <Fragment>
              <div className="form-group">
                <label htmlFor="term">เลือกภาคเรียน: </label>
                <select
                  name="term"
                  id="term"
                  className="form-control center"
                  title="Select Term"
                  {...register("term", { required: true })}
                >
                  <option value="">กรุณาเลือก</option>
                  {Object.entries(config.data).map(([yearcode, term]) =>
                    Object.entries(term).map(([termcode, date], i) => {
                      let curDate = dayjs(date, "DD/MM/YYYY");
                      if (curDate.unix() > dayjs().unix()) return null;
                      if (i % 2 !== 0) {
                        curDate = curDate.subtract(1, "year");
                      }
                      return (
                        <option
                          key={`${termcode}/${yearcode}`}
                          value={`${termcode}/${yearcode}`}
                        >
                          ภาคเรียนที่ {(i % 2) + 1}/{curDate.format("BBBB")}
                        </option>
                      );
                    })
                  )}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="grade">เลือกระดับชั้น:</label>
                <select
                  name="grade"
                  id="grade"
                  className="form-control center"
                  title="Select Grade"
                  {...register("grade", { required: true })}
                >
                  <option value="">กรุณาเลือก</option>
                  {config.class.map((group, isUpper) => {
                    return chunk(group, isUpper ? 3 : 4).map(
                      (classes, level: number) =>
                        classes.map((room: string, i: number) => (
                          <option value={room}>
                            ม. {(isUpper ? 3 : 0) + level + 1}/{i + 1}
                          </option>
                        ))
                    );
                  })}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="studentid">
                  ป้อนรหัสประจำตัวนักเรียน 5 หลัก:
                </label>
                <input
                  name="studentid"
                  type="number"
                  id="studentid"
                  className="form-control center"
                  {...register("studentid", { required: true, maxLength: 5 })}
                  title="Enter Student ID"
                />
              </div>
            </Fragment>
          )}
          <input
            value="ดูผลการเรียน"
            id="getgrade"
            className="btn btn-success"
            type="submit"
          />
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
                Copyright &copy; 2013-{dayjs().format("YYYY")} Student Care
                Solution
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
