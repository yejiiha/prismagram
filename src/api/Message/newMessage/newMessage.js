import { prisma } from "../../../../generated/prisma-client";

export default {
  Subscription: {
    newMessage: {
      subscribe: (_, args) => {
        const { chatId } = args;
        return prisma.$subscribe
          .message({
            AND: [
              { mutation_in: "CREATED" },
              {
                node: {
                  chat: { id: chatId },
                },
              },
            ],
          })
          .node();
      },
      resolve: (payload) => payload,
    },
  },
};
