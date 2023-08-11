import { async } from "regenerator-runtime";
import query from "../../database";

// COMMENTS

async function getPostWithComments(req, res) {
  const slug = req.params.slug;
  const postData = await query("SELECT * FROM posts WHERE slug = $1", [slug]);
  const post = postData.rows[0];

  if (!post) {
    res.status(400).json({ message: "uh-oh!" });
  } else {
    const commentsData = await query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY created_at DESC",
      [post.id]
    );
    const comments = commentsData.rows;

    const postWithComments = {
      post,
      comments: comments,
    };
    res.status(200).json({ "list of comments on post": postWithComments });
  }
}

async function insertComment(req, res) {
  const { content } = req.body;
  const user = req.session.auth;
  const userData = await query("SELECT id, username FROM users WHERE id = $1", [
    user,
  ]);
  if (!userData) {
    res.status(400).json({ message: "failed to insert comment!" });
  } else {
    const slug = req.params.slug;
    const postData = await query("SELECT id FROM posts WHERE slug = $1", [
      slug,
    ]);
    console.log(postData.rows);
    const postId = postData.rows[0].id;
    const authorId = userData.rows[0].id;
    const authorName = userData.rows[0].username;
    if (!postData.rows) {
      res.status(400).json({ message: "insert for existing post!" });
    } else {
      await query(
        "INSERT INTO comments (post_id, author_id, author_name, comment_body) VALUES ($1, $2, $3, $4)",
        [postId, authorId, authorName, content]
      );
      res.status(200).json({ message: "comment successfully inserted!" });
    }
  }
}

// async function editComment(req, res) {
//   const{ editComment } = req.body;
//   const user = req.session.auth;
//   const userData = await query("SELECT id, username FROM users WHERE id = $1", [
//     user,
//   ]);
//   if (!userData) {
//     res
//       .status(400)
//       .json({ message: "you don't have any existing comments to edit!" });
//   } else {
//     const slug = req.params.slug;
//     const postData = await query("SELECT id FROM posts WHERE slug = $1", [
//       slug,
//     ]);
//     const postId = postData.rows[0].id;

//     await query(
//       "UPDATE comments SET comment_body = $1, updated_at = CURRENT_TIMESTAMP WHERE post_id = $2, id = $3",
//       [editComment.comment, postId, editComment.id]
//     );
//     res.status(200).json({ message: "comment successfully edited!" });
//   }
// }

const commentController = {
  getPostWithComments,
  insertComment,
};

export default commentController;
