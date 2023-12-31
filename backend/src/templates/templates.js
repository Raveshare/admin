const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const aws = require("aws-sdk");
const dotenv = require("dotenv");
const multer = require("multer");
const upload = multer();

dotenv.config();

router.get("/", async (req, res) => {
  // Shows Templates
  try {
    let page = req.query.page;
    page = parseInt(page);

    let limit = req.query.limit || 20;

    if (!page) page = 1;

    let offset = limit * (page - 1);

    let templates = await prisma.template_view.findMany({
      skip: offset,
      take: limit,
    });

    let totalAssets = await prisma.template_view.count({});

    let totalPage = Math.ceil(totalAssets / limit);

    let nextPage = page + 1 > totalPage ? null : page + 1;

    res.status(200).json({
      assets: templates,
      totalPage,
      nextPage,
    });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/add", upload.single("image"), async (req, res) => {
  let { name, tags, data } = req.body;
  tags = JSON.parse(tags);
  let image;
  let file = req.file;

  // console.log("--------------------------------------------------------");
  // console.log(req.file);
  // console.log("--------------------------------------------------------");
  let folderName = "templates";
  try {
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${folderName}/${file.originalname}`,
      Body: file.buffer,
      ContentType: "image/png",
      ACL: "public-read",
    };
    const res = await s3.upload(params).promise();
    image = res.Location;
  } catch (error) {
    console.error("Error uploading files to S3:", error);
    res.status(500).json({ error: "File Uploading Error" });
    return;
  }
  try {
    if (!image) {
      res.status(500).json({ error: "Image uploading error" });
      return;
    }
    await prisma.templates.createMany({
      data: {
        name,
        image,
        tags,
        data,
      },
    });
    res.status(200).json({ message: "Template added successfully" });
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
