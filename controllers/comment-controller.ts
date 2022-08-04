const Post = require( "../models/Post")
const Comment =  require("../models/Comment")

async function getComments(req, res) {

  const { targetId } = req.params;

  try {
    const comments = await Comment.find({ targetId }).sort({ createdAt: -1 });
    res.status(200).send({ comments });

  } catch (err) {
    throw new Error(err);
  }
}

async function createComment(req, res) {
  try {
    const { targetId, text, owner, target } = req.body;

    const comment = await new Comment({
      owner, text, comments: [], likes: [], createdAt: new Date().toISOString(), targetId
    });

    let targetBody = target === "comment" ? await Comment.findById(targetId) : await Post.findById(targetId);

    targetBody.comments.push(String(comment._id));

    await targetBody.save();

    await comment.save();

    res.status(200).send({ comment });
  } catch (err) {
    throw new Error(err);
  }
}

async function deleteComment(req, res) {

  const {id} = req.params
  const user = req.user
  const {target, targetId} = req.body

  try {
    let comment = await Comment.findById(id)

    if (comment) {
      if (comment?.owner !== user?.name) {
        res.status(400).send({message: 'U Can not delete comment u are not owner of'})
      } else {
        let targetBody = target === 'comment' ? await Comment.findById(targetId) : await Post.findById(targetId)

        //delete commentId from Array of target Object

        if (targetBody) {
          targetBody.comments = targetBody.comments.filter(com => com !== id)
          await targetBody.save()
        }

        //before deleting the current comment its need to delete all comments that belongs to this comment as well

        if (comment && comment.comments.length > 0) {
          comment.comments.map(async (comComId) => {
            let comComment = await Comment.findById(comComId)
            await comComment.delete()
          })
        }
        await comment.delete()
      }

    } else {
      return res.status(400).send({message: "Comment does not exists"})
    }

    res.status(200).send({id, message: 'Comment has been deleted'})

  } catch (err) {
    throw new Error(err)
  }
}

const CommentControllers = {
  createComment, getComments, deleteComment
};

export = CommentControllers