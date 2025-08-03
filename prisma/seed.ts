import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create default resume templates
  const templates = [
    {
      name: "Modern Professional",
      description:
        "Clean and modern design perfect for tech and business roles",
      structure: {
        sections: [
          "PERSONAL_INFO",
          "SUMMARY",
          "EXPERIENCE",
          "EDUCATION",
          "SKILLS",
        ],
        layout: "modern",
      },
      styling: {
        font: "Inter",
        primaryColor: "#000000",
        secondaryColor: "#6B7280",
        spacing: "comfortable",
      },
      isPremium: false,
    },
    {
      name: "Classic Executive",
      description:
        "Traditional format ideal for senior positions and executive roles",
      structure: {
        sections: [
          "PERSONAL_INFO",
          "SUMMARY",
          "EXPERIENCE",
          "EDUCATION",
          "SKILLS",
          "CERTIFICATIONS",
        ],
        layout: "classic",
      },
      styling: {
        font: "Times New Roman",
        primaryColor: "#1F2937",
        secondaryColor: "#4B5563",
        spacing: "compact",
      },
      isPremium: false,
    },
    {
      name: "Creative Portfolio",
      description:
        "Eye-catching design for creative professionals and designers",
      structure: {
        sections: [
          "PERSONAL_INFO",
          "SUMMARY",
          "EXPERIENCE",
          "PROJECTS",
          "SKILLS",
          "EDUCATION",
        ],
        layout: "creative",
      },
      styling: {
        font: "Poppins",
        primaryColor: "#7C3AED",
        secondaryColor: "#8B5CF6",
        spacing: "generous",
      },
      isPremium: true,
    },
    {
      name: "Minimalist",
      description: "Simple and clean design focusing on content over style",
      structure: {
        sections: [
          "PERSONAL_INFO",
          "SUMMARY",
          "EXPERIENCE",
          "EDUCATION",
          "SKILLS",
        ],
        layout: "minimal",
      },
      styling: {
        font: "Roboto",
        primaryColor: "#000000",
        secondaryColor: "#666666",
        spacing: "minimal",
      },
      isPremium: false,
    },
    {
      name: "Technical Specialist",
      description:
        "Optimized for technical roles with emphasis on skills and projects",
      structure: {
        sections: [
          "PERSONAL_INFO",
          "SUMMARY",
          "EXPERIENCE",
          "PROJECTS",
          "SKILLS",
          "EDUCATION",
        ],
        layout: "technical",
      },
      styling: {
        font: "Fira Code",
        primaryColor: "#1E40AF",
        secondaryColor: "#3B82F6",
        spacing: "technical",
      },
      isPremium: true,
    },
  ];

  for (const template of templates) {
    await prisma.resumeTemplate.upsert({
      where: { id: template.name.toLowerCase().replace(/\s+/g, "-") },
      update: template,
      create: {
        ...template,
        id: template.name.toLowerCase().replace(/\s+/g, "-"),
      },
    });
  }

  console.log("✅ Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
