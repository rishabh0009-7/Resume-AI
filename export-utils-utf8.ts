import puppeteer from "puppeteer";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
} from "docx";

export interface ExportResume {
  id: string;
  title: string;
  description?: string;
  sections: Array<{
    id: string;
    type: string;
    title: string;
    content: any;
    order: number;
  }>;
  template?: {
    name: string;
    styling: any;
  };
}

export async function generatePDFBuffer(resume: ExportResume): Promise<Buffer> {
  const html = generateResumeHTML(resume);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      printBackground: true,
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

export async function generateDOCXBuffer(
  resume: ExportResume
): Promise<Buffer> {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: generateDOCXContent(resume),
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

function generateResumeHTML(resume: ExportResume): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${resume.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #000000;
          margin: 0;
          padding: 20px;
        }
        .section {
          margin-bottom: 25px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #000000;
          border-bottom: 1px solid #666666;
          margin-bottom: 15px;
          padding-bottom: 5px;
        }
        .personal-info {
          text-align: center;
          font-size: 16px;
        }
        .experience-item, .education-item {
          margin-bottom: 15px;
        }
        .job-title {
          font-weight: bold;
          color: #000000;
        }
        .company {
          color: #666666;
          font-style: italic;
        }
        .date {
          color: #666666;
          font-size: 14px;
        }
        .description {
          margin-top: 8px;
        }
        .skills-category {
          margin-bottom: 10px;
        }
        .skills-list {
          display: inline-block;
          margin-left: 20px;
        }
      </style>
    </head>
    <body>
      ${generateResumeContent(resume)}
    </body>
    </html>
  `;
}

function generateResumeContent(resume: ExportResume): string {
  let content = "";

  // Sort sections by order
  const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);

  sortedSections.forEach((section) => {
    content += `<div class="section">`;
    content += `<div class="section-title">${section.title}</div>`;

    switch (section.type) {
      case "PERSONAL_INFO":
        content += generatePersonalInfoHTML(section.content);
        break;
      case "SUMMARY":
        content += generateSummaryHTML(section.content);
        break;
      case "EXPERIENCE":
        content += generateExperienceHTML(section.content);
        break;
      case "EDUCATION":
        content += generateEducationHTML(section.content);
        break;
      case "SKILLS":
        content += generateSkillsHTML(section.content);
        break;
      default:
        content += `<div>${JSON.stringify(section.content)}</div>`;
    }

    content += `</div>`;
  });

  return content;
}

function generatePersonalInfoHTML(content: any): string {
  return `
    <div class="personal-info">
      ${
        content.firstName && content.lastName
          ? `<h1>${content.firstName} ${content.lastName}</h1>`
          : ""
      }
      ${content.email ? `<div>${content.email}</div>` : ""}
      ${content.phone ? `<div>${content.phone}</div>` : ""}
      ${content.location ? `<div>${content.location}</div>` : ""}
      ${content.linkedin ? `<div>LinkedIn: ${content.linkedin}</div>` : ""}
      ${content.website ? `<div>Website: ${content.website}</div>` : ""}
    </div>
  `;
}

function generateSummaryHTML(content: any): string {
  return `<div class="description">${content.text || ""}</div>`;
}

function generateExperienceHTML(content: any): string {
  if (!content.items || !Array.isArray(content.items)) return "";

  return content.items
    .map(
      (item: any) => `
    <div class="experience-item">
      <div class="job-title">${item.title || "Position"}</div>
      <div class="company">${item.company || "Company"}</div>
      <div class="date">${item.startDate || "Start"} - ${
        item.endDate || "Present"
      }</div>
      <div class="description">${item.description || ""}</div>
    </div>
  `
    )
    .join("");
}

function generateEducationHTML(content: any): string {
  if (!content.items || !Array.isArray(content.items)) return "";

  return content.items
    .map(
      (item: any) => `
    <div class="education-item">
      <div class="job-title">${item.degree || "Degree"} in ${
        item.field || "Field"
      }</div>
      <div class="company">${item.institution || "Institution"}</div>
      <div class="date">${item.graduationYear || "Year"}</div>
      ${item.gpa ? `<div>GPA: ${item.gpa}</div>` : ""}
    </div>
  `
    )
    .join("");
}

function generateSkillsHTML(content: any): string {
  if (!content.categories || !Array.isArray(content.categories)) return "";

  return content.categories
    .map(
      (category: any) => `
    <div class="skills-category">
      <strong>${category.name || "Skills"}:</strong>
      <span class="skills-list">${
        category.skills ? category.skills.join(", ") : ""
      }</span>
    </div>
  `
    )
    .join("");
}

function generateDOCXContent(resume: ExportResume): any[] {
  const children: any[] = [];

  // Sort sections by order
  const sortedSections = [...resume.sections].sort((a, b) => a.order - b.order);

  sortedSections.forEach((section) => {
    // Add section title
    children.push(
      new Paragraph({
        text: section.title,
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
      })
    );

    // Add section content
    switch (section.type) {
      case "PERSONAL_INFO":
        children.push(...generatePersonalInfoDOCX(section.content));
        break;
      case "SUMMARY":
        children.push(...generateSummaryDOCX(section.content));
        break;
      case "EXPERIENCE":
        children.push(...generateExperienceDOCX(section.content));
        break;
      case "EDUCATION":
        children.push(...generateEducationDOCX(section.content));
        break;
      case "SKILLS":
        children.push(...generateSkillsDOCX(section.content));
        break;
    }
  });

  return children;
}

function generatePersonalInfoDOCX(content: any): any[] {
  const children: any[] = [];

  if (content.firstName && content.lastName) {
    children.push(
      new Paragraph({
        text: `${content.firstName} ${content.lastName}`,
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400, after: 200 },
      })
    );
  }

  const contactInfo = [];
  if (content.email) contactInfo.push(content.email);
  if (content.phone) contactInfo.push(content.phone);
  if (content.location) contactInfo.push(content.location);

  if (contactInfo.length > 0) {
    children.push(
      new Paragraph({
        text: contactInfo.join(" | "),
        alignment: AlignmentType.CENTER,
        spacing: { before: 200, after: 400 },
      })
    );
  }

  return children;
}

function generateSummaryDOCX(content: any): any[] {
  return [
    new Paragraph({
      text: content.text || "",
      spacing: { before: 200, after: 400 },
    }),
  ];
}

function generateExperienceDOCX(content: any): any[] {
  const children: any[] = [];

  if (!content.items || !Array.isArray(content.items)) return children;

  content.items.forEach((item: any) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: item.title || "Position",
            bold: true,
          }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.company || "Company"} | ${
              item.startDate || "Start"
            } - ${item.endDate || "Present"}`,
            italics: true,
          }),
        ],
        spacing: { before: 100, after: 100 },
      }),
      new Paragraph({
        text: item.description || "",
        spacing: { before: 100, after: 200 },
      })
    );
  });

  return children;
}

function generateEducationDOCX(content: any): any[] {
  const children: any[] = [];

  if (!content.items || !Array.isArray(content.items)) return children;

  content.items.forEach((item: any) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.degree || "Degree"} in ${item.field || "Field"}`,
            bold: true,
          }),
        ],
        spacing: { before: 200, after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: `${item.institution || "Institution"} | ${
              item.graduationYear || "Year"
            }`,
            italics: true,
          }),
        ],
        spacing: { before: 100, after: 100 },
      })
    );

    if (item.gpa) {
      children.push(
        new Paragraph({
          text: `GPA: ${item.gpa}`,
          spacing: { before: 100, after: 200 },
        })
      );
    }
  });

  return children;
}

function generateSkillsDOCX(content: any): any[] {
  const children: any[] = [];

  if (!content.categories || !Array.isArray(content.categories))
    return children;

  content.categories.forEach((category: any) => {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `${category.name || "Skills"}: `,
            bold: true,
          }),
          new TextRun({
            text: category.skills ? category.skills.join(", ") : "",
          }),
        ],
        spacing: { before: 100, after: 100 },
      })
    );
  });

  return children;
}
