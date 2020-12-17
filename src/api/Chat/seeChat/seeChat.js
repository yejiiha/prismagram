import { prisma } from "../../../../generated/prisma-client";
import { CHAT_FRAGMENT } from "../../../fragments";

export default {
  Query: {
    seeChat: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      const canAccess = await prisma.$exists.chat({
        participants_some: {
          id: user.id,
        },
      });
      if (canAccess) {
        return prisma.chat({ id }).$fragment(CHAT_FRAGMENT);
      } else {
        throw Error("You can't access this chat");
      }
    },
  },
};
