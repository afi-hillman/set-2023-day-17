import { async } from "regenerator-runtime";
import query from "../../database";
// POSTS

async function getAllPosts(req, res) {
  const data = await query("SELECT * FROM posts ORDER BY id ASC");
  const posts = data.rows;

  res.status(200).json({ posts });
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
  const user = req.session.auth;
  const data = await query("SELECT id, username FROM users WHERE id = $1", [
    user,
  ]);
  if (!data) {
    res.status(400).json({ message: "failed to insert post!" });
  } else {
    console.log(data.rows[0].username);
    const authorId = data.rows[0].id;
    const authorName = data.rows[0].username;
    await query(
      "INSERT INTO posts (author_id, author_name, title, post_body, slug) VALUES ($1, $2, $3, $4, $5)",
      [authorId, authorName, title, content, slug]
    );
    res.status(200).json({ message: "post insertion successful!" });
  }
}

const postController = {
  getAllPosts,
  getSinglePost,
  insertPost,
};

export default postController;
