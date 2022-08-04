const Post = require("../models/Post")
const User = require("../models/User")
const Comment = require("../models/Comment")


async function getPosts(req, res) {
  const { searchQuery, byTime, skip } = req.query;

  try {
    const postsResult = await Post.aggregate([
      { "$match": { search: { $regex: searchQuery ? searchQuery : "" } } },
      { "$sort": { createdAt: byTime ? Number(byTime) : -1 } },
      {
        "$facet": {
          metadata: [{ $count: "total" }],
          data: [{ $skip: skip ? Number(skip) : 0 }, { $limit: 10 }]
        }
      }
    ]);

    res.status(200).send({
      posts: postsResult[0].data,
      count: postsResult[0].metadata[0]?.total
    });

  } catch (err) {
    throw new Error(err);
  }
}

async function getPost(req, res) {
  const { id } = req.params;

  try {
    let post = await Post.findById(id);

    res.status(200).send({ post });

  } catch (err) {
    throw new Error(err);
  }
}

async function createPost(req, res) {
  try {
    const { name, job, owner, about } = req.body;

    const post = new Post({
      name, job, owner, about, search: `${name}${job}${about}`, createdAt: new Date().toISOString()
    });

    const savedPost = await post.save();

    const user = await User.findById(req.user?.id);

    user.posts.push(String(savedPost._id));

    await user.save();

    res.status(200).send({ post, message: "U have created your post!!!" });
  } catch (err) {
    throw new Error(err);
  }
}

async function deletePost(req, res) {

  try {
    const { id } = req.body;
    const user = req.user;
    const post = await Post.findById(id);
    if (post) {
      if (post.owner !== user?.name) {
        res.status(400).send({ message: "U Can not delete post u are not owner of" });
      } else {
        if (post && post.comments.length > 0) {
          post.comments.map(async (comId) => {
            let comment = await Comment.findById(comId);
            if (comment && comment.comments.length > 0) {
              comment.comments.map(async (comComId) => {
                let comComment = await Comment.findById(comComId);
                await comComment.delete();
              });
            }
            await comment.delete();
          });
        }
        await post.delete();
      }
    } else {
      return res.status(400).send({ message: "Post does not exists" });
    }

    const usermongo = await User.findById(user?.id);

    usermongo.posts = usermongo.posts.filter(post => post._id !== post._id);

    await usermongo.save();

    res.status(200).send({ id: post._id });
  } catch (err) {
    throw new Error(err);
  }
}


async function addLike(req, res) {
  const postId = req.body?.id;
  const userId = req.user?.id;
  try {
    const post = await Post.findById(postId);
    let likes = [...post.likes];
    const likeIsAlready = likes.find(like => like === userId);
    if (!likeIsAlready) {
      likes.push(userId);
    } else {
      likes = likes.filter(like => like !== userId);
    }

    await Post.findOneAndUpdate({ _id: postId }, { likes });

    const updatedPost = await Post.findById(postId);

    res.status(200).send({ post: updatedPost, message: "Post was updated!!!" });
  } catch (err) {
    throw new Error(err);
  }
}

const PostControllers = {
  createPost, getPosts, deletePost, getPost
};

export = PostControllers
