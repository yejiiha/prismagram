import { prisma } from "../../../generated/prisma-client";

export default {
  Message: {
    from: ({ id }) => prisma.message({ id }).from(),
    to: ({ id }) => prisma.message({ id }).to(),
    chat: ({ id }) => prisma.message({ id }).chat(),
  },
};
