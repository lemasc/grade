import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <img className="center" src="/logo_wpm.png" width="100" />
          <h2>ระบบแจ้งผลการเรียนจาก Student Care</h2>
          <h5 style={{fontStyle: "italic"}}>แบบรายงานผลการเรียนรายบุคคล PDF</h5>

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
