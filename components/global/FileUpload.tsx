interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  onFileChange: (filePath: string) => void;
  value?: string;
  disabled: boolean;
}
const FileUpload = ({}: Props) => {
  return <div>FileUpload</div>;
};

export default FileUpload;
