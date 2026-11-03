# Latest Insights videos

Edit `newsVideos.json` to publish videos in the home page's Latest Insights section.

1. Paste an approved YouTube link into `videoUrl`.
2. Optionally fill in `category`, `title`, `description`, and `date`.
3. Use `YYYY-MM-DD` for dates, or leave the date blank.
4. Copy the object to add more videos; give each object a unique `id`.

Watch, short, embed, and youtu.be links are supported. Entries with blank links are ignored, and duplicate videos appear once. Empty titles use the functional label “Watch video”; empty categories use “Insights”. Descriptions and dates stay hidden when blank. There are no sample or invented videos in the published data.

Keep the file valid JSON: double quotes, commas between objects, and no comments or trailing commas. The file is included in the static export; rebuild and redeploy after changing it on the source project, or update the deployed `/data/newsVideos.json` directly.
