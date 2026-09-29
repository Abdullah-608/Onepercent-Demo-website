// URL-safe anchor for a client story, shared by the stories page and links to it
export const storySlug = (client: string) => client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
