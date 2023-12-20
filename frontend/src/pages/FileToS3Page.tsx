import React, { useState } from "react";
import axios from "axios";
import {
  Alert,
  Button,
  Card,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

const FileToS3Page = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [arrImageUrls, setArrImageUrls] = useState<String[]>([]);
  const [openAlert, setOpenAlert] = useState(false);

  const handleFileUpload = async (event: { target: { files: any; }; }) => {
    console.log("FileToS3Page Start");

    const files = event.target.files;
    console.log("files", files);

    if (!files || files.length === 0) {
      console.error("No files selected");
      return;
    }

    const formData = new FormData();

    for (let i = 0; i < files.length; i++) {
      // formData.append(`files[${i}]`, files[i]);
      formData.append(`files`, files[i]);
    }
    console.log("formData", formData);

    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("jwt")} `,
        },
      };
      const response = await axios.post(
        `${BACKEND_URL}/fileToS3`,
        formData,
        config
      );

      console.log("Files uploaded successfully:", response);

      const resImageUrls: any[] | ((prevState: never[]) => never[]) = [];

      response.data.map((imageUrl: any) => {
        console.log("imageUrl", imageUrl);
        resImageUrls.push(imageUrl);
      });

      console.log("resImageUrls", resImageUrls);

      setArrImageUrls(resImageUrls as any[]);
    } catch (error) {
      console.error("Error uploading files:", error);
    }

    console.log("FileToS3Page End");
  };

  const handleCopyToClipboard = () => {
    if (!arrImageUrls) return;
    navigator.clipboard.writeText(arrImageUrls.join(", "));
    setOpenAlert(true);
  };

  return (
    <div className="flex flex-col justify-center w-full m-8">
      <form encType="multipart/form-data">
        <Typography placeholder={undefined} color="blue-gray" className="mb-4 mt-4">
          Choose Files to Upload directly to S3 Bucket
        </Typography>

        <input type="file" multiple onChange={handleFileUpload} />
      </form>

      <Alert
        open={openAlert}
        onClose={() => setOpenAlert(false)}
        animate={{
          mount: { y: 0 },
          unmount: { y: 100 },
        }}
      >
        Copied to Clipboard!
      </Alert>

      {arrImageUrls.length > 0 && (
        <Card className="mt-6 w-96" placeholder={undefined}>
          <CardBody placeholder={undefined}>
            <Typography variant="h6" color="blue-gray" className="mb-2" placeholder={undefined}>
              Copy and paste in{" "}
              <Link to="/getAssetJSON">Get Asset JSON Page</Link>
            </Typography>
            <Typography placeholder={undefined}>{arrImageUrls}</Typography>
          </CardBody>
          <CardFooter className="pt-0" placeholder={undefined}>
            <Button color="blue" fullWidth onClick={handleCopyToClipboard} placeholder={undefined}>
              Click to Copy{" "}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default FileToS3Page;