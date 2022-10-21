import { Document, Page } from "react-pdf"
import React, { useState } from 'react';

const PdfComponents = () => {

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <Document file={"./Resume.pdf"}
      onLoadSuccess={onDocumentLoadSuccess}
    >
      <Page pageNumber={1} />
    </Document>
  );
}

export default PdfComponents