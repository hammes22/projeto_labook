import { string, z } from "zod";

export interface CreatePostInputDTO {
  content: string;
  token: string;
}

export interface EditPostInputDTO {
  id: string;
  content: string;
  token: string;
}

export interface LikePostInputDTO {
  id: string;
  like: number;
  token: string;
}

export interface DeletePostInputDTO {
  id: string;
  token: string;
}

export interface GetPostInputDTO {
  token: string;
}

export interface PostOutputDTO {
  message: string;
  postId?: string;
}

export const CreatePostSchema = z
  .object({
    content: z
      .string({
        required_error: "'content' é obrigatório",
        invalid_type_error: "'content' deve ser do tipo string",
      })
      .min(2, "'content' deve possuir no mínimo 2 caracteres"),
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1),
  })
  .transform((data) => data as CreatePostInputDTO);

export const GetPostSchema = z
  .object({
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1),
  })
  .transform((data) => data as GetPostInputDTO);

export const EditPostSchema = z
  .object({
    id: string({
      required_error: "'token' é obrigatório",
      invalid_type_error: "'token' deve ser do tipo string",
    }).min(1),
    content: z
      .string({
        required_error: "'content' é obrigatório",
        invalid_type_error: "'content' deve ser do tipo string",
      })
      .min(2, "'content' deve possuir no mínimo 2 caracteres"),
    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1),
  })
  .transform((data) => data as EditPostInputDTO);

const verdadeiro = 1;
const falso = 0;
export const LikePostSchema = z
  .object({
    id: string({
      required_error: "'token' é obrigatório",
      invalid_type_error: "'token' deve ser do tipo string",
    }).min(1),
    like: z
      .boolean({
        required_error: "'like' é obrigatório",
        invalid_type_error: "'like' deve ser do tipo boolean",
      })
      .transform((l) => {
        return l ? verdadeiro : falso;
      }),

    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1),
  })
  .transform((data) => data as LikePostInputDTO);

export const DeletePostSchema = z
  .object({
    id: string({
      required_error: "'token' é obrigatório",
      invalid_type_error: "'token' deve ser do tipo string",
    }).min(1),

    token: z
      .string({
        required_error: "'token' é obrigatório",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1),
  })
  .transform((data) => data as DeletePostInputDTO);
