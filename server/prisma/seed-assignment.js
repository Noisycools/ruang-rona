const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.assessmentQuestion.createMany({
    data: [
      {
        order: 1,
        question: 'Apa yang paling bikin kamu kepikiran akhir-akhir ini?',
        type: 'single',
        options: ['akademik', 'sosial', 'keluarga', 'diri', 'lainnya']
      },
      {
        order: 2,
        question: 'Seberapa sering kamu ngerasain ini?',
        type: 'single',
        options: ['hampir tiap hari', 'beberapa kali seminggu', 'jarang']
      },
      {
        order: 3,
        question: 'Seberapa besar pengaruhnya ke aktivitas kamu?',
        type: 'single',
        options: ['banget', 'cukup', 'nggak terlalu']
      }
    ]
  });

  await prisma.exerciseRecommendation.createMany({
    data: [
      { code: 'akademik', title: 'Latihan napas sebelum belajar', slug: 'latihan-napas-belajar' },
      { code: 'sosial', title: 'Latihan self-compassion 3 menit', slug: 'self-compassion-3m' },
      { code: 'keluarga', title: 'Journaling untuk konflik keluarga', slug: 'journaling-keluarga' },
      { code: 'diri', title: 'Mindfulness overthinking', slug: 'mindfulness-overthinking' }
    ]
  });
}

main()
  .then(() => console.log('Seed done'))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
