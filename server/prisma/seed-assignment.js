const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Penting:
 * - order: 1 HARUS kategori utama dan HARUS string: ["school","friends","self","online","mind"]
 *   supaya nyambung ke exerciseRecommendation yang kamu seed (code-nya `category-slug`)
 */

const questions = [
    {
        order: 1,
        question: "Kalau dipilih satu dulu, area yang paling kamu pengen beresin sekarang yang mana?",
        type: "single",
        // ini sengaja pake nama kategori biar 1:1 ke exercise
        options: ["school", "friends", "self", "online", "mind"]
    },
    {
        order: 2,
        question: "Seberapa sering kamu ngerasa kepikiran atau kewalahan dalam 7 hari terakhir?",
        type: "single",
        options: ["hampir setiap hari", "3-4x seminggu", "1-2x seminggu", "jarang"]
    },
    {
        order: 3,
        question: "Kalau lagi kepikiran gitu, biasanya yang kebayang pertama kali apa?",
        type: "single",
        options: [
            "takut nggak selesai tugas",
            "takut dijauhin temen",
            "takut ngecewain keluarga",
            "ngerasa nggak cukup baik",
            "scroll sosmed malah tambah bandingin diri"
        ]
    },
    {
        order: 4,
        question: "Seberapa ngaruh hal itu ke fokus belajar / sekolah kamu?",
        type: "scale",
        options: ["1", "2", "3", "4", "5"]
    },
    {
        order: 5,
        question: "Akhir-akhir ini kamu lebih sering...",
        type: "single",
        options: [
            "menunda tugas",
            "ngerjain tapi nggak fokus",
            "ngerjain mepet deadline",
            "sebenernya aman tapi tetap kepikiran"
        ]
    },
    {
        order: 6,
        question: "Kalau masalahmu soal pertemanan, yang paling bikin nggak nyaman apa?",
        type: "single",
        options: [
            "susah ngomong jujur",
            "takut nggak dianggap",
            "punya temen yang toxic",
            "nggak terlalu, bukan di pertemanan"
        ]
    },
    {
        order: 7,
        question: "Gimana kualitas tidur kamu minggu ini?",
        type: "single",
        options: [
            "sering begadang",
            "tidur tapi kebangun-bangun",
            "lumayan aja",
            "udah oke kok"
        ]
    },
    {
        order: 8,
        question: "Kalau lagi cemas, badan kamu biasanya reaksi gimana?",
        type: "multi",
        options: [
            "jantung cepet",
            "tangan dingin / keringat",
            "perut nggak enak",
            "pengen nangis",
            "nggak terlalu ke badan, lebih ke pikiran"
        ]
    },
    {
        order: 9,
        question: "Seberapa sering kamu ngerasa bandingin diri sama orang lain di sosmed?",
        type: "single",
        options: ["sering banget", "kadang", "jarang", "nggak sih"]
    },
    {
        order: 10,
        question: "Kalau kamu ditolak / nggak diajak / nggak dibales, kamu biasanya mikir apa?",
        type: "single",
        options: [
            "mereka nggak suka aku",
            "aku kurang menarik",
            "yaudah mungkin mereka sibuk",
            "biasa aja"
        ]
    },
];

async function main() {
    console.log("🌱 Seeding assessment questions...");
    await prisma.assessmentQuestion.deleteMany(); // clear dulu biar gak duplikat

    await prisma.assessmentQuestion.createMany({
        data: questions.map(q => ({
            order: q.order,
            question: q.question,
            type: q.type,
            options: q.options,
            isActive: true
        }))
    });

    console.log("✅ Done seeding assessment questions!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        prisma.$disconnect();
        process.exit(0);
    });