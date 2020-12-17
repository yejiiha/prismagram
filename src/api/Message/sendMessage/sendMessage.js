import { prisma } from "../../../../generated/prisma-client";
import { CHAT_FRAGMENT } from "../../../fragments";

export default {
  Mutation: {
    sendMessage: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { user } = request;
      const { chatId, message, toId } = args;
      let chat;
      if (chatId === undefined) {
        if (user.id !== toId) {
          chat = await prisma
            .createChat({
              participants: {
                connect: [{ id: toId }, { id: user.id }],
              },
            })
            .$fragment(CHAT_FRAGMENT);
        }
      } else {
        chat = await prisma.chat({ id: chatId }).$fragment(CHAT_FRAGMENT);
      }
      if (!chat) {
        throw Error("Chat isn't found");
      }
      const getTo = chat.participants.filter(
        (participant) => participant.id !== user.id
      )[0];
      return prisma.createMessage({
        text: message,
        from: {
          connect: { id: user.id },
        },
        to: {
          connect: {
            id: chatId ? getTo.id : toId,
          },
        },
        chat: {
          connect: {
            id: chat.id,
          },
        },
      });
    },
  },
};
