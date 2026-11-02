import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // Courses
  await prisma.course.createMany({
    skipDuplicates: true,
    data: [
      { title: "UPSC CSE Foundation", slug: "upsc-cse-foundation", description: "Complete preparation for UPSC Civil Services Examination.", duration: "12 Months", price: 2999900, tag: "Most Popular", subjects: ["History", "Geography", "Polity", "Economy", "Science"] },
      { title: "Prelims Crash Course", slug: "prelims-crash-course", description: "Intensive preparation for UPSC Prelims with daily mock tests.", duration: "3 Months", price: 999900, tag: "Fast Track", subjects: ["GS Paper I", "CSAT", "Current Affairs", "Mock Tests"] },
      { title: "Mains Answer Writing", slug: "mains-answer-writing", description: "Master the art of answer writing for UPSC Mains.", duration: "6 Months", price: 1499900, tag: "New", subjects: ["Essay", "GS I-IV", "Optional", "Ethics"] },
      { title: "State PSC Complete", slug: "state-psc-complete", description: "Comprehensive preparation for State PSC examinations.", duration: "8 Months", price: 1999900, tag: "Popular", subjects: ["State History", "State Polity", "GS", "Current Affairs"] },
      { title: "Current Affairs Module", slug: "current-affairs-module", description: "Stay updated with curated current affairs analysis.", duration: "1 Month", price: 199900, tag: "Monthly", subjects: ["National", "International", "Economy", "Environment"] },
      { title: "Optional Subject: History", slug: "optional-history", description: "In-depth coverage of History optional for UPSC Mains.", duration: "6 Months", price: 1299900, tag: "Specialized", subjects: ["Ancient", "Medieval", "Modern", "World History"] },
    ],
  });

  // Tests
  await prisma.test.createMany({
    skipDuplicates: true,
    data: [
      { title: "GS Paper I Full Mock Test", category: "Prelims", difficulty: "HARD", questions: 100, duration: 120 },
      { title: "CSAT Practice Test", category: "Prelims", difficulty: "MEDIUM", questions: 80, duration: 120 },
      { title: "Current Affairs Quiz - Jan 2025", category: "Current Affairs", difficulty: "EASY", questions: 25, duration: 30 },
      { title: "Indian Polity Test", category: "GS", difficulty: "MEDIUM", questions: 50, duration: 60 },
      { title: "Economy Mock Test", category: "GS", difficulty: "HARD", questions: 50, duration: 60 },
    ],
  });

  // Study Materials
  await prisma.studyMaterial.createMany({
    skipDuplicates: true,
    data: [
      { title: "Indian Polity - Complete Notes", subject: "Polity", fileSize: "4.2 MB", fileUrl: "/materials/polity-notes.pdf" },
      { title: "Modern History - Spectrum Summary", subject: "History", fileSize: "6.1 MB", fileUrl: "/materials/history-spectrum.pdf" },
      { title: "Indian Economy - Ramesh Singh Notes", subject: "Economy", fileSize: "5.8 MB", fileUrl: "/materials/economy-notes.pdf" },
      { title: "Geography - NCERT Compilation", subject: "Geography", fileSize: "8.3 MB", fileUrl: "/materials/geography-ncert.pdf" },
      { title: "Environment & Ecology Notes", subject: "Environment", fileSize: "3.1 MB", fileUrl: "/materials/environment-notes.pdf" },
      { title: "Science & Technology Updates 2024", subject: "Science", fileSize: "2.4 MB", fileUrl: "/materials/science-tech.pdf" },
    ],
  });

  console.log("✅ Seed complete");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
