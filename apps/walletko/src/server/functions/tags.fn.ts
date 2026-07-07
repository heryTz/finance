"use server";
import { createServerFn } from "@tanstack/react-start";
import { AddTagService } from "src/server/application/tag/add-tag.service";
import { DeleteTagService } from "src/server/application/tag/delete-tag.service";
import { EditTagService } from "src/server/application/tag/edit-tag.service";
import { authMiddleware } from "src/server/auth/middleware";
import { Id } from "src/server/domain/shared/value-object/id";
import { TagNameConflictError } from "src/server/domain/tag/tag-name-conflict.error";
import { db } from "src/server/infrastructure/db/client";
import { DrizzleUnitOfWork } from "src/server/infrastructure/shared/drizzle-unit-of-work";
import { DrizzleListTagsQuery } from "src/server/infrastructure/tag/drizzle-list-tags.query";
import { DrizzleTagRepository } from "src/server/infrastructure/tag/drizzle-tag.repository";
import { z } from "zod";

export const listTagsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const userId = new Id(context.session.user.id);
    const repo = new DrizzleTagRepository();
    const tagEntities = await repo.findAll(userId);
    return tagEntities.map((t) => ({
      id: t.data.id.value,
      name: t.data.name.value,
    }));
  });

const listTagsPagedSchema = z.object({
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1),
});

export const listTagsPagedFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(listTagsPagedSchema)
  .handler(async ({ context, data }) => {
    const query = new DrizzleListTagsQuery(db);
    return query.execute(context.session.user.id, data.page, data.pageSize);
  });

const addTagSchema = z.object({ name: z.string().trim().min(1) });

export const addTagFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(addTagSchema)
  .handler(async ({ context, data }) => {
    const service = new AddTagService({
      tagRepo: new DrizzleTagRepository(),
      uow: new DrizzleUnitOfWork(),
    });
    try {
      await service.execute({
        name: data.name,
        userId: context.session.user.id,
      });
    } catch (err) {
      if (err instanceof TagNameConflictError) throw new Error("name_conflict");
      throw err;
    }
  });

const editTagSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1),
});

export const editTagFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(editTagSchema)
  .handler(async ({ context, data }) => {
    const service = new EditTagService({
      tagRepo: new DrizzleTagRepository(),
      uow: new DrizzleUnitOfWork(),
    });
    try {
      await service.execute({
        tagId: data.id,
        name: data.name,
        userId: context.session.user.id,
      });
    } catch (err) {
      if (err instanceof TagNameConflictError) throw new Error("name_conflict");
      throw err;
    }
  });

const deleteTagSchema = z.object({ id: z.string() });

export const deleteTagFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(deleteTagSchema)
  .handler(async ({ context, data }) => {
    const service = new DeleteTagService({
      tagRepo: new DrizzleTagRepository(),
      uow: new DrizzleUnitOfWork(),
    });
    await service.execute({ tagId: data.id, userId: context.session.user.id });
  });
