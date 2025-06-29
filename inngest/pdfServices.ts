// Declare global types for jsPDF and html2canvas
declare global {
  interface Window {
    jspdf: any;
    html2canvas: any;
  }
}

export const createPdfHTML = async (
  html: string,
  customCss: string
): Promise<string> => {
  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF("p", "mm", "a4");

    // Wrap HTML in styled container
    const container = document.createElement("div");
    container.innerHTML = `
      <style>${customCss}</style>
      <div class="pdf-wrapper p-8 prose prose-sm sm:prose lg:prose-lg xl:prose-xl 2xl:prose-2xl mx-auto">
        ${html}
      </div>
    `;
    container.style.position = "absolute";
    container.style.left = "-9999px";
    container.style.width = "210mm";
    container.style.background = "white";
    container.style.color = "black";
    document.body.appendChild(container);

    // Render to canvas
    const canvas = await window.html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    document.body.removeChild(container);

    const imgData = canvas.toDataURL("image/png");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfPageHeight = pdf.internal.pageSize.getHeight();

    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfPageHeight;

    while (heightLeft > 0) {
      position = -heightLeft;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfPageHeight;
    }

    const pdfBlob = pdf.output("blob");
    return URL.createObjectURL(pdfBlob);
  } catch (error) {
    console.error("Error creating PDF:", error);
    throw new Error("Failed to generate PDF from content.");
  }
};
