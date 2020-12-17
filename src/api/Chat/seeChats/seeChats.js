import { prisma } from "../../../../generated/prisma-client";
import { CHAT_FRAGMENT } from "../../../fragments";

export default {
  Query: {
    seeChats: (_, __, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      return prisma
        .chats({
          where: {
            participants_some: {
              id: user.id,
            },
          },
        })
        .$fragment(CHAT_FRAGMENT);
    },
  },
};
