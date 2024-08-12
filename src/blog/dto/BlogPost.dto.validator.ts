import { BlogPostDto, BlogPostEditDto, EditBlogPostPropertyDto } from './BlogPost.dto';
import { DtoValidator } from '../../app/validation/dto-validator';
import { Validator } from '../../app/validation/validator';

export const BlogPostDtoValidator = new DtoValidator<BlogPostDto>({
  announce: [Validator.required()],
  category: [Validator.required()],
  content: [Validator.required()],
  image: [],
  title: [Validator.required()],
  url: [],
  publishedAt: [],
});

export const BlogPostEditDtoValidator = new DtoValidator<BlogPostEditDto>({
  announce: [Validator.required()],
  category: [Validator.required()],
  content: [Validator.required()],
  image: [],
  title: [Validator.required()],
  publishedAt: [],
});

export const EditBlogPostPropertyDtoValidator = new DtoValidator<EditBlogPostPropertyDto>({
  active: [],
});
