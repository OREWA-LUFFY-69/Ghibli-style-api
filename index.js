const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const REPLICATE_API_TOKEN = "r8_d6IP9i3AcFltzwwJCLz5BKs6Evdo7TS466CQV";

app.post("/ghibli-style", async (req, res) => {
  const imageUrl = req.body.image;
  if (!imageUrl) return res.status(400).json({ error: "No image URL provided" });

  try {
    const startRes = await axios.post("https://api.replicate.com/v1/predictions", {
      version: "c508d555b8cf39c4d7c27df6bdf4e39679cc706142c09fbf6aee9f168ecfdd48",
      input: { image: imageUrl }
    }, {
      headers: {
        Authorization: `Token ${REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    const predictionUrl = startRes.data.urls.get;

    let output = null;
    for (let i = 0; i < 20; i++) {
      const poll = await axios.get(predictionUrl, {
        headers: { Authorization: `Token ${REPLICATE_API_TOKEN}` }
      });

      if (poll.data.status === "succeeded") {
        output = poll.data.output;
        break;
      } else if (poll.data.status === "failed") {
        return res.status(500).json({ error: "Image generation failed" });
      }

      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    if (!output) return res.status(500).json({ error: "Timeout waiting for image" });

    res.json({ ghibli_image: output });
  } catch (err) {
    res.status(500).json({ error: "API error", details: err.message });
  }
});

app.listen(3000, () => {
  console.log(`Rakib's Ghibli Style API is running on port 3000 \n Author: Rakib Adil \n wa.me/+8801811276038 \n Facebook: https://www.facebook.com/RAKIB.404X \n Thank you for using my API!`);
});
