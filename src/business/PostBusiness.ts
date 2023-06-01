import {
  CreatePostInputDTO,
  DeletePostInputDTO,
  EditPostInputDTO,
  GetPostInputDTO,
  LikePostInputDTO,
  PostOutputDTO,
} from "../dto/post.dto";
import { BadRequestError } from "../error/BadRequestError";
import { GetPostDB, Post } from "../models/Post";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { PostDatabase } from "../database/PostDatabase";
import { Like } from "../models/Like";

export class PostBusiness {
  constructor(
    private postDatabase = new PostDatabase(),
    private tokenManager = new TokenManager(),
    private idGenerator = new IdGenerator()
  ) {}

  private date = new Date();

  create = async (input: CreatePostInputDTO) => {
    const payload = this.tokenManager.getPayload(input.token);
    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    const id = this.idGenerator.generate();
    const newPostDB = new Post(
      id,
      payload.id,
      input.content,
      0,
      0,
      this.date.toISOString(),
      this.date.toISOString()
    ).toDBModel();

    await this.postDatabase.create(newPostDB);
    const output: PostOutputDTO = {
      message: "Post criado com sucesso",
      postId: id,
    };

    return output;
  };

  getAllPosts = async (input: GetPostInputDTO) => {
    const payload = this.tokenManager.getPayload(input.token);
    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    const posts = await this.postDatabase.getAllPosts();
    const allPosts: GetPostDB[] = posts.map((post) =>
      new Post(
        post.id,
        post.creator_id,
        post.content,
        post.likes,
        post.dislikes,
        post.updated_at,
        post.created_at,
        post.name
      ).toGetDBModel()
    );

    return allPosts;
  };

  editPost = async (input: EditPostInputDTO) => {
    const payload = this.tokenManager.getPayload(input.token);
    if (payload === null) {
      throw new BadRequestError("token inválido");
    }
    const postDB = await this.postDatabase.getPostId(input.id);
    if (!postDB) {
      throw new BadRequestError(`Não encontramos o post id: ${input.id}`);
    }

    if (payload.id !== postDB.creator_id) {
      throw new BadRequestError(
        `Somente o criador do post tem permissão para edita-lo`
      );
    }

    const editPostDB = new Post(
      postDB.id,
      postDB.creator_id,
      input.content,
      postDB.likes,
      postDB.dislikes,
      this.date.toISOString(),
      postDB.created_at
    ).toDBModel();

    await this.postDatabase.editPost(editPostDB);

    const output: PostOutputDTO = {
      message: "Post editado com sucesso",
      postId: postDB.id,
    };
    return output;
  };

  deletePost = async (input: DeletePostInputDTO) => {
    const payload = this.tokenManager.getPayload(input.token);
    if (payload === null) {
      throw new BadRequestError("token inválido");
    }
    const postDB = await this.postDatabase.getPostId(input.id);
    if (!postDB) {
      throw new BadRequestError(`Não encontramos o post id: ${input.id}`);
    }

    if (payload.id !== postDB.creator_id) {
      throw new BadRequestError(
        `Somente o criador do post tem permissão para deleta-lo`
      );
    }

    await this.postDatabase.deletePost(input.id);

    const output: PostOutputDTO = {
      message: "Post deletado com sucesso",
    };
    return output;
  };

  like = async (input: LikePostInputDTO) => {
    const payload = this.tokenManager.getPayload(input.token);
    if (payload === null) {
      throw new BadRequestError("token inválido");
    }

    const postDB = await this.postDatabase.getPostId(input.id);
    if (!postDB) {
      throw new BadRequestError(`Não encontramos o post id: ${input.id}`);
    }

    if (payload.id === postDB.creator_id) {
      throw new BadRequestError(
        `O criador do post não tem permissão para dar like ou dislike`
      );
    }

    const newLike = new Like(payload.id, input.id, input.like);

    const editPostDB = new Post(
      postDB.id,
      postDB.creator_id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      this.date.toISOString(),
      postDB.created_at
    );

    const likeDB = await this.postDatabase.getWhereLike(newLike.toDBModel());

    if (likeDB) {
      if (likeDB.like !== input.like) {
        input.like ? editPostDB.addLike(1) : editPostDB.addDislikes(1);
        input.like ? editPostDB.removeDislikes(1) : editPostDB.removeLike(1);
        await this.postDatabase.editLike(newLike.toDBModel());
        await this.postDatabase.editPost(editPostDB.toDBModel());
        const output: PostOutputDTO = {
          message: `${input.like ? "Like" : "Dislike"} adicionado com sucesso`,
        };
        return output;
      }

      await this.postDatabase.deleteLike(newLike.toDBModel());
      input.like ? editPostDB.removeLike(1) : editPostDB.removeDislikes(1);
      await this.postDatabase.editPost(editPostDB.toDBModel());

      const output: PostOutputDTO = {
        message: `${input.like ? "Like" : "Dislike"} removido com sucesso`,
      };
      return output;
    }

    input.like ? editPostDB.addLike(1) : editPostDB.addDislikes(1);
    await this.postDatabase.createLike(newLike.toDBModel());
    await this.postDatabase.editPost(editPostDB.toDBModel());
    const output: PostOutputDTO = {
      message: `${input.like ? "Like" : "Dislike"} adicionado com sucesso`,
    };
    return output;
  };
}
