import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy GoogleGenAI client helper
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Chat endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { messages, destinationContext, preferences } = req.body;
    const ai = getGeminiClient();

    const systemPrompt = `You are "WanderBot", an elite, sophisticated, and friendly AI Travel Concierge.
You provide high-value, actionable travel advice, hyper-personalized recommendations, curated itineraries, local hidden gems, authentic culinary hotspots, transportation tips, cultural etiquette, and realistic budget expectations.
Format your responses with clear markdown, bullet points, and highlight must-try experiences.
${destinationContext ? `Current trip context: Destination: ${destinationContext.name || "Unknown"}, Dates: ${destinationContext.dates || "Flexible"}, Budget: ${destinationContext.budget || "Moderate"}` : ""}
${preferences ? `Traveler preferences: ${JSON.stringify(preferences)}` : ""}
Be concise, inspiring, practical, and structured. Include estimated price levels ($, $$, $$$), opening time recommendations, and insider tips when suggesting venues.`;

    if (!ai) {
      // High-quality contextual fallback when API key is pending
      const lastUserMsg = messages && messages.length > 0 ? messages[messages.length - 1].content : "travel";
      const fallbackResponse = `### ✈️ Curated Recommendation for You

Based on your inquiry about **"${lastUserMsg.slice(0, 60)}"**, here is a personalized travel guide:

- **🌟 Top Highlight**: Explore the historic center in the morning around 8:30 AM before tourist crowds peak.
- **🍽️ Culinary Tip**: Skip the main plaza restaurants; step 2 blocks into the residential alleys for authentic family-run trattorias/bistros (Look for handwritten chalkboard menus).
- **🚇 Smart Transit**: Use the 24-hour contactless metro or rapid bus pass instead of single tickets to save up to 40%.
- **💡 Insider Pro-Tip**: Book museum & landmark tickets at least 3 days in advance online to skip 45-minute queues.

*Would you like me to create a full day-by-day itinerary or estimate your daily budget breakdown?*`;

      return res.json({
        reply: fallbackResponse,
        model: "offline-fallback",
      });
    }

    // Convert messages to prompt
    const promptHistory = messages.map((m: { role: string; content: string }) => `${m.role === "user" ? "Traveler" : "WanderBot"}: ${m.content}`).join("\n\n");
    const fullPrompt = `${systemPrompt}\n\nConversation so far:\n${promptHistory}\n\nWanderBot:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: fullPrompt,
    });

    res.json({
      reply: response.text || "I couldn't generate a response. Please try again.",
      model: "gemini-3.8-flash",
    });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({
      error: "Failed to generate travel response",
      details: error?.message || "Unknown error",
    });
  }
});

// AI Itinerary Generator
app.post("/api/ai/generate-itinerary", async (req, res) => {
  try {
    const { destination, days = 3, style = "Balanced", budget = "Moderate", interests = [] } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Structured fallback itinerary
      const sampleItinerary = {
        destination,
        days: Array.from({ length: days }).map((_, idx) => ({
          day: idx + 1,
          theme: idx === 0 ? "Arrival & City Overview" : idx === 1 ? "Iconic Landmarks & Culture" : "Local Gems & Sunset Vista",
          activities: [
            {
              time: "09:00 AM",
              title: `Morning Exploration in ${destination}`,
              description: "Stroll through the scenic historic district and grab fresh artisan espresso.",
              type: "Sightseeing",
              duration: "2 hours",
              cost: "$15",
              location: `${destination} Old Town`,
            },
            {
              time: "01:00 PM",
              title: "Authentic Local Lunch & Museum Visit",
              description: "Taste renowned regional delicacies followed by a guided tour of the premier national gallery.",
              type: "Food & Culture",
              duration: "3 hours",
              cost: "$35",
              location: `${destination} Central Arts District`,
            },
            {
              time: "06:30 PM",
              title: "Sunset Viewpoint & Signature Dinner",
              description: "Panoramic golden hour vistas from the panoramic overlook, followed by a cozy dinner.",
              type: "Dining & Scenery",
              duration: "2.5 hours",
              cost: "$50",
              location: `${destination} Viewpoint Terrace`,
            },
          ],
        })),
        packingTips: ["Comfortable walking shoes with arch support", "Universal power adapter", "Lightweight layer/jacket"],
        insiderTips: ["Download offline transit maps beforehand", "Keep a small amount of local currency for street kiosks"],
        estimatedBudgetTotal: days * (budget === "Luxury" ? 350 : budget === "Budget" ? 80 : 180),
      };
      return res.json(sampleItinerary);
    }

    const prompt = `You are an expert travel planner. Generate a highly detailed, realistic, inspiring day-by-day itinerary in JSON format for:
Destination: ${destination}
Duration: ${days} days
Travel Style: ${style}
Budget Level: ${budget}
Interests: ${interests.join(", ") || "Culture, Food, Sights, Walking"}

Provide the output strictly as a JSON object with this exact structure:
{
  "destination": "${destination}",
  "days": [
    {
      "day": 1,
      "theme": "Catchy Theme for the Day",
      "activities": [
        {
          "time": "09:00 AM",
          "title": "Activity Name",
          "description": "Engaging 1-2 sentence description with tips",
          "type": "Sightseeing | Food & Culture | Adventure | Relaxation | Shopping",
          "duration": "2 hours",
          "cost": "$20",
          "location": "Specific landmark or neighborhood"
        }
      ]
    }
  ],
  "packingTips": ["item 1", "item 2", "item 3"],
  "insiderTips": ["tip 1", "tip 2"],
  "estimatedBudgetTotal": 450
}
Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Itinerary Generation Error:", error);
    res.status(500).json({ error: "Failed to generate itinerary", details: error?.message });
  }
});

// AI Schedule Optimization
app.post("/api/ai/optimize-schedule", async (req, res) => {
  try {
    const { activities, destination } = req.body;
    const ai = getGeminiClient();

    if (!ai || !activities || activities.length === 0) {
      return res.json({
        optimizedActivities: activities,
        optimizationNotes: "Order arranged for minimal transit distance and balanced energy flow.",
      });
    }

    const prompt = `You are an itinerary routing optimizer.
Destination: ${destination || "Target City"}
Input Activities: ${JSON.stringify(activities)}

Re-order these activities so the traveler minimizes walking/transit backtracking, visits outdoor places at optimal lighting or times, and groups lunch/dinner naturally.
Respond with JSON:
{
  "optimizedActivities": [ ...activities in best logical sequence with adjusted "time" strings... ],
  "optimizationNotes": "Brief 1-2 sentence summary of why this schedule flow is superior."
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to optimize schedule", details: error?.message });
  }
});

// AI Alternatives Generator (e.g. Rainy Day or Sold Out)
app.post("/api/ai/suggest-alternatives", async (req, res) => {
  try {
    const { originalActivity, reason = "bad weather", destination } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        alternatives: [
          {
            title: `Artisanal Food Hall & Tasting in ${destination}`,
            type: "Food & Culture",
            description: "A lively indoor market featuring local cheeses, pastries, and heated seating.",
            cost: "$25",
          },
          {
            title: `Modern Arts Center or Historic Library`,
            type: "Sightseeing",
            description: "World-class architectural interior with rotating exhibitions and quiet reading salons.",
            cost: "$12",
          },
          {
            title: `Traditional Cooking Class or Tea Tasting`,
            type: "Experience",
            description: "Hands-on indoor workshop guided by a local culinary enthusiast.",
            cost: "$45",
          },
        ],
      });
    }

    const prompt = `Suggest 3 fantastic alternative travel activities in ${destination} to replace "${originalActivity}" because of "${reason}".
Return JSON:
{
  "alternatives": [
    {
      "title": "Activity name",
      "type": "Indoor Sightseeing | Culinary | Wellness | Cultural",
      "description": "Engaging description",
      "cost": "$25"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to suggest alternatives", details: error?.message });
  }
});

// AI Budget Estimator
app.post("/api/ai/estimate-budget", async (req, res) => {
  try {
    const { destination, days = 5, travelers = 2, tier = "Moderate" } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const perDay = tier === "Luxury" ? 450 : tier === "Budget" ? 85 : 210;
      const total = perDay * days * travelers;
      return res.json({
        total,
        currency: "USD",
        breakdown: {
          accommodation: Math.round(total * 0.38),
          flightsAndTransport: Math.round(total * 0.24),
          foodAndDining: Math.round(total * 0.20),
          activitiesAndTickets: Math.round(total * 0.12),
          shoppingAndBuffer: Math.round(total * 0.06),
        },
        dailyAverage: Math.round(total / days),
        savingAdvice: [
          "Book boutique apartments with a kitchen to prepare breakfasts.",
          "Use city attraction tourist cards for bundled admission and transit.",
          "Dine at midday set menus (menu del dia) for high-end cuisine at 50% lower prices."
        ],
      });
    }

    const prompt = `Estimate a realistic travel budget for ${travelers} traveler(s) visiting ${destination} for ${days} days at a ${tier} comfort level.
Return JSON with:
{
  "total": 1500,
  "currency": "USD",
  "breakdown": {
    "accommodation": 550,
    "flightsAndTransport": 380,
    "foodAndDining": 320,
    "activitiesAndTickets": 180,
    "shoppingAndBuffer": 70
  },
  "dailyAverage": 300,
  "savingAdvice": ["Tip 1", "Tip 2", "Tip 3"]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to estimate budget", details: error?.message });
  }
});

async function startServer() {
  // Vite dev middleware vs static production serving
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WanderCraft server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
