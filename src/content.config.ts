import { defineCollection, z } from "astro:content";
import { docsSchema } from "@astrojs/starlight/schema";
import { glob } from "astro/loaders";

// Starlight docs collection (required when extending)
const docs = defineCollection({ schema: docsSchema() });

// Blog collection schema with glob loader for Astro 5
const blog = defineCollection({
  loader: glob({
    pattern: "*.mdx",
    base: "./src/content/blog",
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z
      .object({
        name: z.string(),
        avatar: z.string().optional(),
        role: z.string().optional(),
      })
      .default({ name: "ArtemisKit Team" }),
    category: z.enum([
      "changelog",
      "tutorials",
      "security-news",
      "engineering",
      "case-studies",
    ]),
    tags: z.array(z.string()).default([]),
    image: z
      .object({
        src: z.string(),
        alt: z.string(),
      })
      .optional(),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    readingTime: z.number().optional(), // in minutes
    incidentDate: z.coerce.date().optional(), // For security news - when the incident was first reported
  }),
});

export const collections = { docs, blog };
