import { db } from "./db";
import { events, competitions, competitionQuestions } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Seed events
  const eventData = [
    {
      title: "Caspian Beach Cleanup",
      description: "Join us for a community cleanup along the beautiful Caspian Sea coastline. Help preserve marine life and keep our beaches pristine for future generations.",
      location: "Bilgah Beach, Baku",
      eventDate: new Date("2025-01-15T09:00:00"),
      category: "Beach Cleanup",
      isPast: false,
    },
    {
      title: "Mountain Reforestation Day",
      description: "Plant native trees in the Caucasus foothills. Learn about local flora and contribute to restoring Azerbaijan's forest cover.",
      location: "Shamakhi District",
      eventDate: new Date("2025-01-22T08:00:00"),
      category: "Tree Planting",
      isPast: false,
    },
    {
      title: "Birdwatching at Shirvan Reserve",
      description: "Observe migratory birds and learn about wildlife conservation at Shirvan National Park, home to gazelles and flamingos.",
      location: "Shirvan National Park",
      eventDate: new Date("2025-02-08T07:00:00"),
      category: "Wildlife",
      isPast: false,
    },
    {
      title: "Environmental Workshop for Schools",
      description: "Interactive workshop teaching students about recycling, conservation, and sustainable living practices.",
      location: "Youth Center, Baku",
      eventDate: new Date("2025-02-15T10:00:00"),
      category: "Education",
      isPast: false,
    },
    {
      title: "Gobustan Nature Walk",
      description: "Explore the unique mud volcanoes and semi-desert ecosystem of the Gobustan reserve while learning about geological conservation.",
      location: "Gobustan State Reserve",
      eventDate: new Date("2025-03-01T09:00:00"),
      category: "Awareness",
      isPast: false,
    },
    {
      title: "Kura River Cleanup Campaign",
      description: "Help clean the banks of the Kura River and raise awareness about freshwater ecosystem protection.",
      location: "Mingachevir",
      eventDate: new Date("2024-11-20T09:00:00"),
      category: "Beach Cleanup",
      isPast: true,
    },
  ];

  await db.insert(events).values(eventData).onConflictDoNothing();
  console.log("Events seeded!");

  // Seed competitions
  const competitionData = [
    {
      title: "Azerbaijan Biodiversity Quiz",
      description: "Test your knowledge about the diverse flora and fauna found across Azerbaijan's varied landscapes.",
      difficulty: "Easy",
      questionCount: 10,
      estimatedMinutes: 10,
      prizeDescription: "Win eco-friendly merchandise!",
      isActive: true,
    },
    {
      title: "Caspian Sea Conservation Challenge",
      description: "Learn about the unique ecosystem of the Caspian Sea and the efforts to protect its endangered species.",
      difficulty: "Medium",
      questionCount: 15,
      estimatedMinutes: 15,
      prizeDescription: "Win a guided nature tour!",
      isActive: true,
    },
    {
      title: "Climate Change & Azerbaijan",
      description: "Explore how climate change affects Azerbaijan and discover ways to reduce your carbon footprint.",
      difficulty: "Medium",
      questionCount: 12,
      estimatedMinutes: 12,
      prizeDescription: "Win eco-friendly gift basket!",
      isActive: true,
    },
    {
      title: "Forest Conservation Expert Quiz",
      description: "An advanced quiz about forest ecosystems, reforestation techniques, and sustainable forestry practices.",
      difficulty: "Hard",
      questionCount: 20,
      estimatedMinutes: 25,
      prizeDescription: "Win a tree planted in your name!",
      isActive: true,
    },
  ];

  const insertedCompetitions = await db.insert(competitions).values(competitionData).onConflictDoNothing().returning();
  console.log("Competitions seeded!");

  // Seed questions for the first competition
  if (insertedCompetitions.length > 0) {
    const questionsData = [
      {
        competitionId: insertedCompetitions[0].id,
        question: "What percentage of Azerbaijan is covered by forests?",
        options: ["5%", "11%", "25%", "40%"],
        correctAnswer: 1,
        points: 10,
      },
      {
        competitionId: insertedCompetitions[0].id,
        question: "Which is the largest national park in Azerbaijan?",
        options: ["Gobustan", "Shirvan", "Shahdag", "Hirkan"],
        correctAnswer: 2,
        points: 10,
      },
      {
        competitionId: insertedCompetitions[0].id,
        question: "What is the national animal of Azerbaijan?",
        options: ["Brown Bear", "Gazelle", "Karabakh Horse", "Caspian Seal"],
        correctAnswer: 2,
        points: 10,
      },
      {
        competitionId: insertedCompetitions[0].id,
        question: "How many mud volcanoes are there in Azerbaijan?",
        options: ["About 50", "About 200", "About 400", "About 600"],
        correctAnswer: 2,
        points: 10,
      },
      {
        competitionId: insertedCompetitions[0].id,
        question: "Which rare feline species can be found in Azerbaijan's mountains?",
        options: ["Snow Leopard", "Caucasian Leopard", "Lynx", "Cheetah"],
        correctAnswer: 1,
        points: 10,
      },
    ];

    await db.insert(competitionQuestions).values(questionsData).onConflictDoNothing();
    console.log("Questions seeded!");
  }

  console.log("Database seeding completed!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error seeding database:", error);
    process.exit(1);
  });
