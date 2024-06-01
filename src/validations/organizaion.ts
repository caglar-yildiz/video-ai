import { z } from "zod"


export const inviteSchema = z.object({
  email: z.string().email().optional(),
});

export const useInviteSchema = z.object({
  token : z.string()
});

export const createOrganizationSchema = z.object({
  name: z.string(),
  email : z.string().email()
});

export const updateOrganizationSchema = z.object({
  name: z.string(),
  email : z.string().email()
});


export const removeUserSchema = z.object({
  userId: z.string(),
});

export type CreateOrganization = z.infer<typeof createOrganizationSchema>;

export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>;
