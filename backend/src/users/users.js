const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/user", async (req, res) => {
  try {
    let id = parseInt(req.query.id);
    const users = await prisma.owners.findUnique({
      where: {
        id,
      },
    });

    res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

router.get("/showUsers", async (req, res) => {
  try {
    const users = await prisma.owners.findMany({
      orderBy: {
        id: "asc",
      },
    });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/editUser", async (req, res) => {
  try {
    // console.log(req);
    const { id, evm_address, solana_address, lens_handle, username, points } =
      req.body;
    await prisma.owners.update({
      where: {
        id,
      },
      data: {
        evm_address,
        solana_address,
        lens_handle,
        username,
        points,
      },
    });

    res.status(200).json({ status: "success", message: "User data Updated" });
  } catch (error) {
    console.error("Internal Server Error", error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
