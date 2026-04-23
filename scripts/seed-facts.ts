/**
 * Seed three "Did You Know?" FACT posts for the Community section.
 * Idempotent: safe to re-run (checks title + author before inserting).
 *
 * Run: npx tsx --env-file=.env scripts/seed-facts.ts
 */
import "dotenv/config";
import { prisma } from "../lib/db";

async function main() {
  // Upsert a system author so seeded facts have a consistent owner.
  const systemUser = await prisma.user.upsert({
    where: { email: "team@civilcalc.online" },
    update: {},
    create: {
      email: "team@civilcalc.online",
      name: "CivilCalc Team",
      role: "ADMIN",
    },
  });

  const facts = [
    {
      title: "The Rational Method is only valid for catchments ≤ 80 ha",
      body: `Many designers apply the Rational Method (Q = CiA/360) to catchments well beyond 80 ha without realising MSMA §2.3.1.2 explicitly cites TxDOT (2009) to cap it there.

Beyond 80 ha, assumptions like uniform rainfall intensity over the whole catchment and perfect time-of-concentration synchrony break down, and the method systematically over-predicts peak flow. MSMA recommends the **Rational Hydrograph Method** (RHM, §2.3.2) for simple hydrograph generation or the **Time-Area Method** (§2.3.3) for larger catchments with non-uniform land use. For complex drainage systems and high-risk areas, computer models such as SWMM-5, RORB, or HEC-RAS are expected.

If you have been sizing culverts or detention ponds on 100+ ha catchments using Rational alone, it is worth revisiting the calculation against RHM or a runoff hydrograph model before submission.`,
      tags: ["msma", "rational-method", "drainage", "catchment"],
      standardRef: "MSMA 2nd Ed (2012), §2.3.1.2",
    },
    {
      title: "MSMA overland flow time uses slope in PERCENT, not m/m",
      body: `The overland sheet flow formula in MSMA Table 2.1 is:

  to = 107 × n* × L^(1/3) / S^(1/5)

where **S is in percent**, not m/m. This is a common source of error — entering a 1 % slope as 0.01 instead of 1 gives a time of concentration roughly **5× too large**, which in turn under-predicts rainfall intensity and peak flow.

Another catch: the roughness variable n* is **Horton's n* (MSMA Table 2.2)**, not Manning's n. Typical values are 0.015 (paved), 0.035 (poorly grassed), 0.045 (average grassed), up to 0.060 (densely grassed). These are an order of magnitude lower than the Manning's n range for open channels.

Minimum tc is 5 minutes per §2.2.2 — this applies especially to roof drainage where catchment areas are small and travel times are short.`,
      tags: ["msma", "time-of-concentration", "drainage", "hydrology"],
      standardRef: "MSMA 2nd Ed (2012), Ch 2 Table 2.1 & Table 2.2",
    },
    {
      title: "MSMA runoff coefficients differ for minor vs major drainage systems",
      body: `MSMA Table 2.5 tabulates **two** runoff coefficients (C) for every land-use category: one for the **minor system (≤ 10-year ARI)** and one for the **major system (> 10-year ARI)**. They are not the same.

Examples:
- Link & terrace house: **0.80** (minor) / **0.90** (major)
- Condominium: **0.75** / **0.80**
- Sport fields / parks: **0.30** / **0.40**
- Bare soil: **0.50** / **0.60**

The higher C for the major system reflects soil saturation during larger storms — pervious surfaces behave increasingly like impervious ones once antecedent moisture is high. Picking the wrong column for a 100-year check (say, using 0.80 instead of 0.90 for terrace houses) understates peak flow by over 10 %, which can push a culvert or detention pond from "adequate" to "undersized" on paper.

When designing detention for both minor *and* major ARIs, remember to swap the C value — not just the rainfall intensity — between the two checks.`,
      tags: ["msma", "runoff-coefficient", "drainage", "rational-method"],
      standardRef: "MSMA 2nd Ed (2012), Ch 2 Table 2.5",
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const fact of facts) {
    const existing = await prisma.question.findFirst({
      where: { title: fact.title, authorId: systemUser.id },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      console.log(`⊘ Skipped (already exists): ${fact.title}`);
      continue;
    }
    await prisma.question.create({
      data: {
        postType: "FACT",
        title: fact.title,
        body: fact.body,
        tags: fact.tags,
        standardRef: fact.standardRef,
        authorId: systemUser.id,
      },
    });
    created++;
    console.log(`✓ Created: ${fact.title}`);
  }

  console.log(`\nDone — created ${created}, skipped ${skipped}.`);
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
