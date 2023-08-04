import { async } from "regenerator-runtime";
import query from "../../database";
// POSTS

async function getAllPosts(req, res) {
  const data = await query("SELECT * FROM posts ORDER BY id ASC");
  const posts = data.rows;

  res.status(200).json({ "List of posts available to view!": posts });
}

async function getSinglePost(req, res) {
  const slug = req.params.slug;
  const data = await query("SELECT * FROM posts WHERE slug = $1", [slug]);
  const posts = data.rows;
  if (posts.length === 0) {
    res.status(400).json({ message: "post not found" });
  } else {
    res.status(200).json({ "Here's the post!": posts });
  }
}

async function insertPost(req, res) {
  const { title, content, slug } = req.body;
  console.log(req.body);
  await query(
    "INSERT INTO posts (author_id, author_name, title, post_body, slug) SELECT users.id AS author_id, users.username AS author_name, title = $1 , content = $2 , slug = $3 FROM users;",
    [title, content, slug]
  );
}

const contentController = {
  getAllPosts,
  getSinglePost,
  insertPost,
};

export default contentController;
