import { Alert, Button, Input, Textarea } from "@material-tailwind/react";
import axios from "axios";
import React, { useState } from "react";

const FormUploadToDB = () => {
  // {"image":"https://lenspost.s3.ap-south-1.amazonaws.com/test/CloudRock.jpeg","tags":["sdf","Trsdee","fasa sfafdsafdas","safdsdf","fasdsdf"],"author":"rockuthor","type":"props","featured":false,"dimensions":[2048,1356],"wallet":"0xxdfsdfsdsyz","campaign":"test"}

  const BE_URL = "http://localhost:3000";
  const [openAlert, setOpenAlert] = useState(false);

  const [dataUploadToDB, setDataUploadToDB] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    

    try {
      const config = {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("jwt")} `,
        },  
      };

      const response = await axios.post(
        `${BE_URL}/uploadToDb`,
        dataUploadToDB,
        config
      );

      console.log(dataUploadToDB);

      console.log("Response:", response.data);

    } catch (error) {
      console.error("Error uploading sticker data:", error);
    }
  };

  const handleInputChange = (event) => {
      setDataUploadToDB(event.target.value);
  };

  return (
    <>
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

      <form onSubmit={handleSubmit}>
      <div className="w-full">
        <Textarea
          className="h-96 "
          type="text" 
          label="Asset JSON"
          name="assetJSON"
          value={dataUploadToDB}
          onChange={(e) => handleInputChange(e)}
        />
        </div>

        <br />

        <Button fullWidth className="mt-2" type="submit">
          {" "}
          Upload to DB{" "}
        </Button>
      </form>
    </>
  );
};

export default FormUploadToDB;