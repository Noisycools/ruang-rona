
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const questions = [
  // --- Akademik ---
  {
    category: 'academic',
    order: 1,
    text: 'Seberapa sering Anda merasa tertekan oleh tugas-tugas sekolah atau beban belajar?',
    choices: [
      { text: 'Tidak pernah', value: 1 },
      { text: 'Jarang', value: 2 },
      { text: 'Kadang-kadang', value: 3 },
      { text: 'Sering', value: 4 },
      { text: 'Sangat sering', value: 5 },
    ],
  },
  {
    category: 'academic',
    order: 2,
    text: 'Apakah Anda merasa kesulitan untuk fokus saat belajar atau mengerjakan tugas?',
    choices: [
        { text: 'Tidak pernah', value: 1 },
        { text: 'Jarang', value: 2 },
        { text: 'Kadang-kadang', value: 3 },
        { text: 'Sering', value: 4 },
        { text: 'Sangat sering', value: 5 },
    ],
  },
  // --- Sosial ---
  {
    category: 'social',
    order: 1,
    text: 'Seberapa sering Anda merasa cemas atau tidak nyaman dalam situasi sosial (bertemu orang baru, berbicara di depan umum)?',
    choices: [
        { text: 'Tidak pernah', value: 1 },
        { text: 'Jarang', value: 2 },
        { text: 'Kadang-kadang', value: 3 },
        { text: 'Sering', value: 4 },
        { text: 'Sangat sering', value: 5 },
    ],
  },
  {
    category: 'social',
    order: 2,
    text: 'Apakah Anda merasa memiliki hubungan yang baik dan mendukung dengan teman-teman Anda?',
    choices: [
        { text: 'Sangat setuju', value: 1 },
        { text: 'Setuju', value: 2 },
        { text: 'Netral', value: 3 },
        { text: 'Tidak setuju', value: 4 },
        { text: 'Sangat tidak setuju', value: 5 },
    ],
  },
  // --- Keluarga ---
  {
    category: 'family',
    order: 1,
    text: 'Seberapa sering terjadi konflik atau pertengkaran di dalam keluarga Anda?',
    choices: [
        { text: 'Tidak pernah', value: 1 },
        { text: 'Jarang', value: 2 },
        { text: 'Kadang-kadang', value: 3 },
        { text: 'Sering', value: 4 },
        { text: 'Sangat sering', value: 5 },
    ],
  },
  {
    category: 'family',
    order: 2,
    text: 'Apakah Anda merasa mendapat dukungan emosional yang cukup dari keluarga?',
    choices: [
        { text: 'Sangat setuju', value: 1 },
        { text: 'Setuju', value: 2 },
        { text: 'Netral', value: 3 },
        { text: 'Tidak setuju', value: 4 },
        { text: 'Sangat tidak setuju', value: 5 },
    ],
  },
  // --- Personal ---
  {
    category: 'personal',
    order: 1,
    text: 'Seberapa sering Anda merasa cemas atau khawatir tentang masa depan?',
    choices: [
        { text: 'Tidak pernah', value: 1 },
        { text: 'Jarang', value: 2 },
        { text: 'Kadang-kadang', value: 3 },
        { text: 'Sering', value: 4 },
        { text: 'Sangat sering', value: 5 },
    ],
  },
  {
    category: 'personal',
    order: 2,
    text: 'Apakah Anda merasa puas dengan diri Anda sendiri dan pencapaian yang telah Anda raih?',
    choices: [
        { text: 'Sangat setuju', value: 1 },
        { text: 'Setuju', value: 2 },
        { text: 'Netral', value: 3 },
        { text: 'Tidak setuju', value: 4 },
        { text: 'Sangat tidak setuju', value: 5 },
    ],
  },
  // --- Online ---
  {
    category: 'online',
    order: 1,
    text: 'Seberapa sering Anda membandingkan diri Anda dengan orang lain di media sosial?',
    choices: [
        { text: 'Tidak pernah', value: 1 },
        { text: 'Jarang', value: 2 },
        { text: 'Kadang-kadang', value: 3 },
        { text: 'Sering', value: 4 },
        { text: 'Sangat sering', value: 5 },
    ],
  },
  {
    category: 'online',
    order: 2,
    text: 'Apakah Anda pernah mengalami perundungan atau komentar negatif di dunia maya?',
    choices: [
        { text: 'Tidak pernah', value: 1 },
        { text: 'Jarang', value: 2 },
        { text: 'Kadang-kadang', value: 3 },
        { text: 'Sering', value: 4 },
        { text: 'Sangat sering', value: 5 },
    ],
  },
];

async function main() {
  console.log('Start seeding...');

  // Hapus data lama
  await prisma.questionChoice.deleteMany();
  await prisma.question.deleteMany();
  console.log('Deleted old questions and choices.');

  for (const q of questions) {
    const question = await prisma.question.create({
      data: {
        text: q.text,
        category: q.category,
        order: q.order,
        choices: {
          create: q.choices.map(c => ({
            text: c.text,
            value: c.value,
          })),
        },
      },
    });
    console.log(`Created question with id: ${question.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
