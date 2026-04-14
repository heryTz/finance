import { prisma } from "@/lib/prisma";

async function run() {
  // TODO: improve this using query row
  const users = await prisma.user.findMany();

  for (const user of users) {
    const operations = await prisma.operation.findMany({
      where: {
        userId: user.id,
        tags: { some: { userId: { not: user.id } } },
      },
      include: { tags: true },
    });

    if (operations.length === 0) continue;

    console.log(`User: ${user.id} / ${user.email}`);

    console.log(`Operations have a wrong tag: ${operations.length}`);

    for (const operation of operations) {
      const tagToDetach = operation.tags.filter((el) => el.userId !== user.id);
      const tagToAttach = operation.tags.filter((el) => {
        // we include tag that not assign to me below
        return (
          el.userId === user.id && !tagToDetach.find((d) => d.name === el.name)
        );
      });

      for (const tag of operation.tags) {
        const myTag = await prisma.tag.findFirst({
          where: { name: tag.name, userId: user.id },
        });
        if (myTag) {
          tagToAttach.push(myTag);
        } else {
          const newMyTag = await prisma.tag.create({
            data: { name: tag.name, userId: user.id },
          });
          tagToAttach.push(newMyTag);
        }
      }

      await prisma.operation.update({
        where: { id: operation.id },
        data: {
          tags: {
            connect: tagToAttach.map((el) => ({ id: el.id })),
            disconnect: tagToDetach.map((el) => ({ id: el.id })),
          },
        },
      });
    }

    console.log("===============================\n");
  }
}

run();
