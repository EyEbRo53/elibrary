export const getFile = async () => {
  fetch("http://localhost:3000/api/pdf?url=http://localhost:3000/nextjs.pdf")
    .then((res) => res.blob())
    .then((blob) => {
      const blobUrl = URL.createObjectURL(blob);
      console.log();
      return blobUrl;
    });
};
