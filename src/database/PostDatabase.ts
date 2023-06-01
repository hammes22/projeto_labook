import { promises } from "dns";
import {
  LIKE_DISLiKES,
  POST_CREATOR_ID,
  TABLE_POST,
  TABLE_USER,
  USER_ID,
} from "../constants/constantsTable";
import { DbError } from "../error/DbError";
import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { LikeDB } from "../models/Like";

export class PostDatabase extends BaseDatabase {
  create = async (postDB: PostDB): Promise<void> => {
    await BaseDatabase.connection(TABLE_POST)
      .insert(postDB)
      .catch((error) => {
        throw new DbError(error);
      });
  };

  getAllPosts = async (): Promise<PostDB[]> => {
    const posts: PostDB[] = await BaseDatabase.connection
      .select("posts.*", "users.name")
      .table(TABLE_POST)
      .innerJoin(TABLE_USER, USER_ID, POST_CREATOR_ID)
      .catch((error) => {
        throw new DbError(error);
      });
    return posts;
  };

  getPostId = async (id: string): Promise<PostDB> => {
    const post: PostDB[] = await BaseDatabase.connection(TABLE_POST).where({
      id,
    });
    return post[0];
  };

  editPost = async (editPost: PostDB): Promise<void> => {
    await BaseDatabase.connection
      .where({ id: editPost.id })
      .update(editPost)
      .table(TABLE_POST)
      .catch((error) => {
        throw new DbError(error);
      });
  };

  deletePost = async (id: string): Promise<void> => {
    await BaseDatabase.connection
      .where({ id })
      .delete()
      .table(TABLE_POST)
      .catch((error) => {
        throw new DbError(error);
      });
  };

  getWhereLike = async (like: LikeDB): Promise<LikeDB> => {
    const verificaLike: LikeDB[] = await BaseDatabase.connection(LIKE_DISLiKES)
      .where({ user_id: like.user_id })
      .where({ post_id: like.post_id });
    return verificaLike[0];
  };

  createLike = async (like: LikeDB) => {
    await BaseDatabase.connection(LIKE_DISLiKES)
      .insert(like)
      .catch((error) => {
        throw new DbError(error);
      });
  };

  editLike = async (like: LikeDB) => {
    await BaseDatabase.connection
      .where({ user_id: like.user_id })
      .where({ post_id: like.post_id })
      .update(like)
      .table(LIKE_DISLiKES)
      .catch((error) => {
        throw new DbError(error);
      });
  };

  deleteLike = async (like: LikeDB) => {
    await BaseDatabase.connection
      .where({ user_id: like.user_id })
      .where({ post_id: like.post_id })
      .delete()
      .table(LIKE_DISLiKES)
      .catch((error) => {
        throw new DbError(error);
      });
  };
}
