import newsService from "../services/newsService.js";

/**
 * Get news articles.
 * GET /api/news
 */
export const getNews = async (req, res) => {
  try {
    const { category } = req.query;
    let result;

    if (category && category !== "All" && category !== "all") {
      result = await newsService.getNewsByCategory(category);
    } else {
      result = await newsService.getLatestAgricultureNews();
    }

    return res.status(200).json({ success: true, news: result.data || [] });
  } catch (error) {
    console.error("Error in getNews controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving news." });
  }
};

/**
 * Get news by ID.
 * GET /api/news/:id
 */
export const getNewsById = async (req, res) => {
  try {
    const news = await newsService.getNewsById(req.params.id);

    if (!news) {
      return res.status(404).json({ success: false, message: "News article not found." });
    }
    return res.status(200).json({ success: true, news });
  } catch (error) {
    console.error("Error in getNewsById controller:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error retrieving article details." });
  }
};
