const axios = require("../utils/api");

exports.getMusics = async (req, res, next) => {
  const query = req.body.query;
  try {
    const response = await axios.get("/search/tracks", {
      params: {
        q: query,
        client_id: process.env.CLIENT_ID,
        limit: 30,
      },
    });
    const data = response.data;
    if (!data || !data.collection) {
      return res.status(500).json({
        success: false,
        error: "No songs found",
      });
    }

    res.status(200).json({
      success: true,
      data: data.collection,
    });
  } catch (err) {
    console.error(err.stack);
    next(err);
  }
};

exports.getTrackInfo = async (req, res, next) => {
  try {
    const trackId = req.params.id;
    const response = await axios.get(`/tracks/${trackId}`, {
      params: {
        client_id: process.env.CLIENT_ID,
      },
    });
    if (!response.data) {
      return res.status(500).json({
        success: false,
        error: "Failed to get the track.",
      });
    }

    const track = response.data;

    const progressiveTrans = track.media.transcodings.find(
      (t) => t.format.protocol == "progressive"
    );

    let playableUrl = null;

    if (progressiveTrans) {
      const transRes = await axios.get(progressiveTrans.url, {
        params: { client_id: process.env.CLIENT_ID },
      });
      playableUrl = transRes.data.url;
    }
    const trackinfo = {
      title: track.title,
      duration: track.duration,
      artwork: track.artwork_url,
      genre: track.genre,
      permalink: track.permalink_url,
      artist: track.user?.full_name,
      artistAvatar: track.user?.avatar_url,
      streamable: track.streamable,
      progressiveUrl: playableUrl,
    };
    res.status(200).json({ success: true, data: trackinfo });
  } catch (err) {
    console.error(err.stack);
    next(err);
  }
};
