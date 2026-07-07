"use server";
import { createServerFn } from "@tanstack/react-start";
import { CreateViewService } from "src/server/application/saved-view/create-view.service";
import { DeleteViewService } from "src/server/application/saved-view/delete-view.service";
import { UpdateViewService } from "src/server/application/saved-view/update-view.service";
import { authMiddleware } from "src/server/auth/middleware";
import { SavedViewNameConflictError } from "src/server/domain/saved-view/saved-view-name-conflict.error";
import { db } from "src/server/infrastructure/db/client";
import { DrizzleGetViewQuery } from "src/server/infrastructure/saved-view/drizzle-get-view.query";
import { DrizzleGetViewStatsQuery } from "src/server/infrastructure/saved-view/drizzle-get-view-stats.query";
import { DrizzleGetViewYearStatsQuery } from "src/server/infrastructure/saved-view/drizzle-get-view-year-stats.query";
import { DrizzleListViewsQuery } from "src/server/infrastructure/saved-view/drizzle-list-views.query";
import { DrizzleSavedViewRepository } from "src/server/infrastructure/saved-view/drizzle-saved-view.repository";
import { DrizzleUnitOfWork } from "src/server/infrastructure/shared/drizzle-unit-of-work";
import { z } from "zod";

export const listViewsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    return new DrizzleListViewsQuery(db).execute(context.session.user.id);
  });

const viewIdSchema = z.object({ id: z.string() });

export const getViewFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(viewIdSchema)
  .handler(async ({ context, data }) => {
    const view = await new DrizzleGetViewQuery(db).execute(
      data.id,
      context.session.user.id,
    );
    if (!view) throw new Error("View not found");
    return view;
  });

export const getViewStatsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(viewIdSchema)
  .handler(async ({ context, data }) => {
    const view = await new DrizzleGetViewQuery(db).execute(
      data.id,
      context.session.user.id,
    );
    if (!view) throw new Error("View not found");
    return new DrizzleGetViewStatsQuery(db).execute(context.session.user.id, {
      nameFilter: view.nameFilter,
      tagIds: view.tagIds,
    });
  });

const viewYearStatsSchema = z.object({
  id: z.string(),
  year: z.number().int().min(2000).max(2100),
});

export const getViewYearStatsFn = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator(viewYearStatsSchema)
  .handler(async ({ context, data }) => {
    const view = await new DrizzleGetViewQuery(db).execute(
      data.id,
      context.session.user.id,
    );
    if (!view) throw new Error("View not found");
    return new DrizzleGetViewYearStatsQuery(db).execute(
      context.session.user.id,
      data.year,
      { nameFilter: view.nameFilter, tagIds: view.tagIds },
    );
  });

const saveViewSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  nameFilter: z.string().optional(),
  tagIds: z.array(z.string()).default([]),
});

export const createViewFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(saveViewSchema)
  .handler(async ({ context, data }) => {
    const service = new CreateViewService({
      viewRepo: new DrizzleSavedViewRepository(),
      uow: new DrizzleUnitOfWork(),
    });
    try {
      await service.execute({
        name: data.name,
        description: data.description,
        nameFilter: data.nameFilter,
        tagIds: data.tagIds,
        userId: context.session.user.id,
      });
    } catch (err) {
      if (err instanceof SavedViewNameConflictError)
        throw new Error("name_conflict");
      throw err;
    }
  });

const updateViewSchema = saveViewSchema.extend({ id: z.string() });

export const updateViewFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(updateViewSchema)
  .handler(async ({ context, data }) => {
    const service = new UpdateViewService({
      viewRepo: new DrizzleSavedViewRepository(),
      uow: new DrizzleUnitOfWork(),
    });
    try {
      await service.execute({
        viewId: data.id,
        name: data.name,
        description: data.description,
        nameFilter: data.nameFilter,
        tagIds: data.tagIds,
        userId: context.session.user.id,
      });
    } catch (err) {
      if (err instanceof SavedViewNameConflictError)
        throw new Error("name_conflict");
      throw err;
    }
  });

export const deleteViewFn = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(viewIdSchema)
  .handler(async ({ context, data }) => {
    const service = new DeleteViewService({
      viewRepo: new DrizzleSavedViewRepository(),
      uow: new DrizzleUnitOfWork(),
    });
    await service.execute({ viewId: data.id, userId: context.session.user.id });
  });
