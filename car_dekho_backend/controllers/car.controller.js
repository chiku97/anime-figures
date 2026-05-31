import prisma from "../config/config.js";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const safeJsonParse = (rawText) => {
  if (!rawText) return null;
  try {
    return JSON.parse(rawText);
  } catch {
    const match = rawText.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
};

const fallbackExtractCriteria = (queryText) => {
  const text = String(queryText || "").toLowerCase();
  const makerMap = [
    "maruti suzuki",
    "hyundai",
    "tata",
    "mahindra",
    "toyota",
    "kia",
    "honda",
    "volkswagen",
    "skoda",
    "mg",
    "renault",
    "nissan",
    "jeep",
    "citroen",
    "bmw",
  ];

  const fuelTypeMap = ["petrol", "diesel", "electric", "cng", "hybrid"];
  const transmissionMap = ["manual", "automatic"];
  const bodyTypeMap = ["hatchback", "sedan", "suv", "muv", "coupe", "convertible"];

  const makers = makerMap.filter((maker) => text.includes(maker));
  const fuelTypes = fuelTypeMap.filter((fuel) => text.includes(fuel)).map((fuel) => fuel.toUpperCase());
  const bodyTypes = bodyTypeMap.filter((body) => text.includes(body)).map((body) => body.toUpperCase());
  const transmission = transmissionMap.find((type) => text.includes(type));

  const mileageMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:kmpl|km\/l|kmpl\b)/i);

  return {
    makers,
    models: [],
    bodyTypes,
    fuelTypes,
    transmission: transmission ? transmission.toUpperCase() : null,
    minMileage: mileageMatch ? Number(mileageMatch[1]) : null,
  };
};

const getGeminiCriteria = async (queryText) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { criteria: fallbackExtractCriteria(queryText), source: "fallback" };
  }

  const prompt = `Extract structured car search criteria from this user request.\nRequest: "${queryText}"\n\nReturn strict JSON only with this schema:\n{\n  "makers": [string],\n  "models": [string],\n  "bodyTypes": ["HATCHBACK"|"SEDAN"|"SUV"|"MUV"|"COUPE"|"CONVERTIBLE"],\n  "fuelTypes": ["PETROL"|"DIESEL"|"ELECTRIC"|"CNG"|"HYBRID"],\n  "transmission": "MANUAL"|"AUTOMATIC"|null,\n  "minMileage": number|null\n}`;

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0,
          responseMimeType: "application/json",
        },
      }),
    });

    if (!response.ok) {
      console.error("Gemini API error", response.status);
      return { criteria: fallbackExtractCriteria(queryText), source: "fallback" };
    }

    const payload = await response.json();
    const aiText =
      payload?.candidates?.[0]?.content?.parts?.[0]?.text ||
      payload?.candidates?.[0]?.content?.parts?.map((part) => part.text).join("\n");

    const parsed = safeJsonParse(aiText);
    if (!parsed) {
      return { criteria: fallbackExtractCriteria(queryText), source: "fallback" };
    }

    return {
      criteria: {
        makers: Array.isArray(parsed.makers) ? parsed.makers : [],
        models: Array.isArray(parsed.models) ? parsed.models : [],
        bodyTypes: Array.isArray(parsed.bodyTypes) ? parsed.bodyTypes : [],
        fuelTypes: Array.isArray(parsed.fuelTypes) ? parsed.fuelTypes : [],
        transmission: parsed.transmission || null,
        minMileage:
          parsed.minMileage !== null && parsed.minMileage !== undefined
            ? Number(parsed.minMileage)
            : null,
      },
      source: "gemini",
    };
  } catch (error) {
    console.error("Gemini integration failed:", error);
    return { criteria: fallbackExtractCriteria(queryText), source: "fallback" };
  }
};

export const getAllCars = async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);
    const cursor = req.query.cursor || null;

    const queryOptions = {
      take: limit + 1,
      orderBy: { created_at: "desc" },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1; // skip the cursor record itself
    }

    const cars = await prisma.car.findMany(queryOptions);

    let nextCursor = null;
    if (cars.length > limit) {
      nextCursor = cars[limit].id;
      cars.splice(limit); // return only `limit` items
    }

    res.json({ cars, nextCursor });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getFilteredCars = async (req, res) => {
  try {
    const {
      maker,
      fuelType,
      transmission,
      minPrice,
      maxPrice,
      search,
      limit,
      cursor,
    } = req.query;

    const parsedLimit = Math.min(parseInt(limit) || 12, 50);
    const where = {};

    if (maker) where.maker = maker;
    if (fuelType) where.fuelType = fuelType;
    if (transmission) where.transmission = transmission;

    if (minPrice || maxPrice) {
      where.exShowRoomPrice = {};
      if (minPrice) where.exShowRoomPrice.gte = Number(minPrice);
      if (maxPrice) where.exShowRoomPrice.lte = Number(maxPrice);
    }

    if (search) {
      where.OR = [
        { maker: { contains: search } },
        { model: { contains: search } },
        { varient: { contains: search } },
      ];
    }

    const queryOptions = {
      where,
      take: parsedLimit + 1,
      orderBy: { created_at: "desc" },
    };

    if (cursor) {
      queryOptions.cursor = { id: cursor };
      queryOptions.skip = 1;
    }

    const cars = await prisma.car.findMany(queryOptions);

    let nextCursor = null;
    if (cars.length > parsedLimit) {
      nextCursor = cars[parsedLimit].id;
      cars.splice(parsedLimit);
    }

    res.json({ cars, nextCursor });
  } catch (error) {
    console.error("Error fetching filtered cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getCarById = async (req, res) => {
    try {
        const { id } = req.params;
        const car = await prisma.car.findUnique({
            where: { id }
        });
        if (!car) {
            return res.status(404).json({ error: "Car not found" });
        }
        res.json(car);
    } catch (error) {
        console.error("Error fetching car by ID:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getAiRecommendedCars = async (req, res) => {
  try {
    const queryText = (req.body?.query || req.query?.query || "").trim();
    const limit = Math.min(parseInt(req.body?.limit || req.query?.limit) || 20, 50);

    if (!queryText) {
      return res.status(400).json({ error: "query is required" });
    }

    const { criteria, source } = await getGeminiCriteria(queryText);

    const andConditions = [];

    if (criteria.makers?.length) {
      andConditions.push({
        OR: criteria.makers.map((maker) => ({ maker: { contains: maker } })),
      });
    }

    if (criteria.models?.length) {
      andConditions.push({
        OR: criteria.models.map((model) => ({ model: { contains: model } })),
      });
    }

    if (criteria.bodyTypes?.length) {
      andConditions.push({ bodyType: { in: criteria.bodyTypes } });
    }

    if (criteria.fuelTypes?.length) {
      andConditions.push({ fuelType: { in: criteria.fuelTypes } });
    }

    if (criteria.transmission) {
      andConditions.push({ transmission: criteria.transmission });
    }

    if (criteria.minMileage) {
      andConditions.push({ mileage: { gte: criteria.minMileage } });
    }

    // "In stock" is treated as cars available in the Car table.
    // If AI could not extract any criteria, return no records instead of unrelated cars.
    const where = andConditions.length ? { AND: andConditions } : { id: "__no_match__" };

    const cars = await prisma.car.findMany({
      where,
      take: limit,
      orderBy: { created_at: "desc" },
    });

    res.json({
      cars,
      source,
      criteria,
      userPrompt: queryText,
      fallbackUsed: source !== "gemini",
    });
  } catch (error) {
    console.error("Error getting AI recommended cars:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};