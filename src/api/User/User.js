import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    posts: ({ id }) => prisma.user({ id }).posts(),
    following: ({ id }) => prisma.user({ id }).following(),
    followers: ({ id }) => prisma.user({ id }).followers(),
    likes: ({ id }) => prisma.user({ id }).likes(),
    comments: ({ id }) => prisma.user({ id }).comments(),
    chats: ({ id }) => prisma.user({ id }).chats(),
    followingCount: ({ id }) =>
      prisma
        .usersConnection({ where: { followers_some: { id } } })
        .aggregate()
        .count(),
    followersCount: ({ id }) =>
      prisma
        .usersConnection({ where: { following_none: { id } } })
        .aggregate()
        .count(),
    postsCount: ({ id }) =>
      prisma
        .postsConnection({ where: { user: { id } } })
        .aggregate()
        .count(),
    fullName: (parent) => {
      return `${parent.firstName} ${parent.lastName}`;
    },
    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        return prisma.$exists.user({
          AND: [
            {
              id: user.id,
            },
            {
              following_some: {
                id: parentId,
              },
            },
          ],
        });
      } catch {
        return false;
      }
    },
    // 요청하는 사람(parent)과 요청받는 사람(request)이 같으면 내 프로필을 요청함
    isSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    },
  },
};
