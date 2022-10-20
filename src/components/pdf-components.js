import { Document, Page } from "react-pdf"

const PdfComponents = () => {
  return (
    <Document file='Resume.pdf'>
      <Page pageNumber={1} />
    </Document>
  );
}

export default PdfComponents