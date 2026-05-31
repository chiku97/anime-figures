import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  const cars = await prisma.car.createMany({
    data: [

      {
        maker: "Maruti Suzuki",
        model: "Swift",
        varient: "ZXI",
        bodyType: "HATCHBACK",
        fuelType: "PETROL",
        year: 2025,
        transmission: "MANUAL",
        exShowRoomPrice: 850000,
        mileage: 24.8,
        engineCC: 1197,
        powerBhp: 88,
        torqueNm: 113,
        seatCapacity: 5,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&h=340&fit=crop"
      },

      {
        maker: "Hyundai",
        model: "Creta",
        varient: "SX",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2025,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1650000,
        mileage: 18.4,
        engineCC: 1497,
        powerBhp: 115,
        torqueNm: 144,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=340&fit=crop"
      },

      {
        maker: "Tata",
        model: "Nexon",
        varient: "Fearless+",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2025,
        transmission: "MANUAL",
        exShowRoomPrice: 1400000,
        mileage: 17.5,
        engineCC: 1199,
        powerBhp: 118,
        torqueNm: 170,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=340&fit=crop"
      },

      {
        maker: "Mahindra",
        model: "XUV700",
        varient: "AX7",
        bodyType: "SUV",
        fuelType: "DIESEL",
        year: 2025,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2450000,
        mileage: 16.2,
        engineCC: 2198,
        powerBhp: 182,
        torqueNm: 450,
        seatCapacity: 7,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19d4a42f?w=600&h=340&fit=crop"
      },

      {
        maker: "Toyota",
        model: "Innova Hycross",
        varient: "ZX",
        bodyType: "MUV",
        fuelType: "HYBRID",
        year: 2025,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 3100000,
        mileage: 21.1,
        engineCC: 1987,
        powerBhp: 184,
        torqueNm: 206,
        seatCapacity: 7,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c3ca3806d?w=600&h=340&fit=crop"
      },

      {
        maker: "MG",
        model: "ZS EV",
        varient: "Essence",
        bodyType: "SUV",
        fuelType: "ELECTRIC",
        year: 2025,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2400000,
        mileage: 461,
        engineCC: 0,
        powerBhp: 174,
        torqueNm: 280,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1560958089-b8a63019cbcf?w=600&h=340&fit=crop"
      },

      // ── 7 ──
      {
        maker: "Maruti Suzuki",
        model: "Baleno",
        varient: "Alpha",
        bodyType: "HATCHBACK",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 920000,
        mileage: 22.35,
        engineCC: 1197,
        powerBhp: 88,
        torqueNm: 113,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=340&fit=crop"
      },

      // ── 8 ──
      {
        maker: "Hyundai",
        model: "Verna",
        varient: "SX(O)",
        bodyType: "SEDAN",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1750000,
        mileage: 20.6,
        engineCC: 1497,
        powerBhp: 160,
        torqueNm: 253,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507950547769-1147f900cebb?w=600&h=340&fit=crop"
      },

      // ── 9 ──
      {
        maker: "Kia",
        model: "Seltos",
        varient: "GTX+",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1980000,
        mileage: 17.7,
        engineCC: 1497,
        powerBhp: 160,
        torqueNm: 253,
        seatCapacity: 5,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop"
      },

      // ── 10 ──
      {
        maker: "Honda",
        model: "City",
        varient: "ZX CVT",
        bodyType: "SEDAN",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1620000,
        mileage: 18.4,
        engineCC: 1498,
        powerBhp: 121,
        torqueNm: 145,
        seatCapacity: 5,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1552191506-c3cb14a00d3d?w=600&h=340&fit=crop"
      },

      // ── 11 ──
      {
        maker: "Toyota",
        model: "Fortuner",
        varient: "Legender 4x4",
        bodyType: "SUV",
        fuelType: "DIESEL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 4800000,
        mileage: 14.2,
        engineCC: 2755,
        powerBhp: 201,
        torqueNm: 500,
        seatCapacity: 7,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c3ca3806d?w=600&h=340&fit=crop"
      },

      // ── 12 ──
      {
        maker: "Tata",
        model: "Punch",
        varient: "Accomplished",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "MANUAL",
        exShowRoomPrice: 790000,
        mileage: 20.09,
        engineCC: 1199,
        powerBhp: 86,
        torqueNm: 113,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1552191506-c3cb14a00d3d?w=600&h=340&fit=crop"
      },

      // ── 13 ──
      {
        maker: "Mahindra",
        model: "Scorpio-N",
        varient: "Z8 L",
        bodyType: "SUV",
        fuelType: "DIESEL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2850000,
        mileage: 15.2,
        engineCC: 2198,
        powerBhp: 175,
        torqueNm: 400,
        seatCapacity: 7,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19d4a42f?w=600&h=340&fit=crop"
      },

      // ── 14 ──
      {
        maker: "Volkswagen",
        model: "Taigun",
        varient: "GT Plus",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2150000,
        mileage: 17.42,
        engineCC: 1498,
        powerBhp: 150,
        torqueNm: 250,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=340&fit=crop"
      },

      // ── 15 ──
      {
        maker: "Skoda",
        model: "Slavia",
        varient: "Style",
        bodyType: "SEDAN",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1880000,
        mileage: 19.4,
        engineCC: 1498,
        powerBhp: 150,
        torqueNm: 250,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507950547769-1147f900cebb?w=600&h=340&fit=crop"
      },

      // ── 16 ──
      {
        maker: "Hyundai",
        model: "i20",
        varient: "Asta(O)",
        bodyType: "HATCHBACK",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1070000,
        mileage: 20.35,
        engineCC: 998,
        powerBhp: 120,
        torqueNm: 172,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&h=340&fit=crop"
      },

      // ── 17 ──
      {
        maker: "Maruti Suzuki",
        model: "Grand Vitara",
        varient: "Alpha+ AWD",
        bodyType: "SUV",
        fuelType: "HYBRID",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2060000,
        mileage: 27.97,
        engineCC: 1490,
        powerBhp: 116,
        torqueNm: 122,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop"
      },

      // ── 18 ──
      {
        maker: "Kia",
        model: "Carens",
        varient: "Luxury Plus",
        bodyType: "MUV",
        fuelType: "DIESEL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1890000,
        mileage: 19.5,
        engineCC: 1493,
        powerBhp: 115,
        torqueNm: 250,
        seatCapacity: 7,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c3ca3806d?w=600&h=340&fit=crop"
      },

      // ── 19 ──
      {
        maker: "Tata",
        model: "Harrier",
        varient: "Adventure Plus",
        bodyType: "SUV",
        fuelType: "DIESEL",
        year: 2024,
        transmission: "MANUAL",
        exShowRoomPrice: 1780000,
        mileage: 16.35,
        engineCC: 1956,
        powerBhp: 170,
        torqueNm: 350,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=340&fit=crop"
      },

      // ── 20 ──
      {
        maker: "Honda",
        model: "Amaze",
        varient: "VX CVT",
        bodyType: "SEDAN",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 960000,
        mileage: 18.6,
        engineCC: 1199,
        powerBhp: 90,
        torqueNm: 110,
        seatCapacity: 5,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1507950547769-1147f900cebb?w=600&h=340&fit=crop"
      },

      // ── 21 ──
      {
        maker: "Mahindra",
        model: "Thar Roxx",
        varient: "MX5",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2025,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1990000,
        mileage: 15.2,
        engineCC: 1997,
        powerBhp: 174,
        torqueNm: 380,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19d4a42f?w=600&h=340&fit=crop"
      },

      // ── 22 ──
      {
        maker: "Renault",
        model: "Kiger",
        varient: "RXZ Turbo",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1070000,
        mileage: 20.53,
        engineCC: 999,
        powerBhp: 100,
        torqueNm: 160,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=340&fit=crop"
      },

      // ── 23 ──
      {
        maker: "Nissan",
        model: "Magnite",
        varient: "Tekna+ Turbo",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1050000,
        mileage: 20,
        engineCC: 999,
        powerBhp: 100,
        torqueNm: 152,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop"
      },

      // ── 24 ──
      {
        maker: "Toyota",
        model: "Urban Cruiser Hyryder",
        varient: "V Hybrid",
        bodyType: "SUV",
        fuelType: "HYBRID",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2040000,
        mileage: 27.97,
        engineCC: 1490,
        powerBhp: 116,
        torqueNm: 122,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c3ca3806d?w=600&h=340&fit=crop"
      },

      // ── 25 ──
      {
        maker: "Maruti Suzuki",
        model: "Ertiga",
        varient: "ZXI+",
        bodyType: "MUV",
        fuelType: "CNG",
        year: 2024,
        transmission: "MANUAL",
        exShowRoomPrice: 1160000,
        mileage: 26.11,
        engineCC: 1462,
        powerBhp: 103,
        torqueNm: 137,
        seatCapacity: 7,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1552191506-c3cb14a00d3d?w=600&h=340&fit=crop"
      },

      // ── 26 ──
      {
        maker: "Hyundai",
        model: "Alcazar",
        varient: "Platinum",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2140000,
        mileage: 14.5,
        engineCC: 1999,
        powerBhp: 159,
        torqueNm: 191,
        seatCapacity: 7,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=340&fit=crop"
      },

      // ── 27 ──
      {
        maker: "Tata",
        model: "Tiago EV",
        varient: "Long Range XZ+",
        bodyType: "HATCHBACK",
        fuelType: "ELECTRIC",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1250000,
        mileage: 315,
        engineCC: 0,
        powerBhp: 74,
        torqueNm: 114,
        seatCapacity: 5,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1560958089-b8a63019cbcf?w=600&h=340&fit=crop"
      },

      // ── 28 ──
      {
        maker: "MG",
        model: "Astor",
        varient: "Sharp Pro",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1690000,
        mileage: 17.03,
        engineCC: 1349,
        powerBhp: 143,
        torqueNm: 220,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=340&fit=crop"
      },

      // ── 29 ──
      {
        maker: "Skoda",
        model: "Kushaq",
        varient: "Monte Carlo",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1950000,
        mileage: 17.2,
        engineCC: 1498,
        powerBhp: 150,
        torqueNm: 250,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop"
      },

      // ── 30 ──
      {
        maker: "Volkswagen",
        model: "Virtus",
        varient: "GT Plus",
        bodyType: "SEDAN",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1990000,
        mileage: 19.4,
        engineCC: 1498,
        powerBhp: 150,
        torqueNm: 250,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507950547769-1147f900cebb?w=600&h=340&fit=crop"
      },

      // ── 31 ──
      {
        maker: "Maruti Suzuki",
        model: "Fronx",
        varient: "Alpha Turbo",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1280000,
        mileage: 21.79,
        engineCC: 999,
        powerBhp: 100,
        torqueNm: 148,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=340&fit=crop"
      },

      // ── 32 ──
      {
        maker: "Honda",
        model: "Elevate",
        varient: "ZX CVT",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1920000,
        mileage: 17.8,
        engineCC: 1498,
        powerBhp: 121,
        torqueNm: 145,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=340&fit=crop"
      },

      // ── 33 ──
      {
        maker: "Mahindra",
        model: "Bolero Neo",
        varient: "N10(O)",
        bodyType: "SUV",
        fuelType: "DIESEL",
        year: 2024,
        transmission: "MANUAL",
        exShowRoomPrice: 1250000,
        mileage: 17.28,
        engineCC: 1493,
        powerBhp: 100,
        torqueNm: 260,
        seatCapacity: 7,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19d4a42f?w=600&h=340&fit=crop"
      },

      // ── 34 ──
      {
        maker: "Hyundai",
        model: "Ioniq 5",
        varient: "AWD",
        bodyType: "SUV",
        fuelType: "ELECTRIC",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 4600000,
        mileage: 631,
        engineCC: 0,
        powerBhp: 320,
        torqueNm: 605,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1560958089-b8a63019cbcf?w=600&h=340&fit=crop"
      },

      // ── 35 ──
      {
        maker: "Kia",
        model: "EV6",
        varient: "GT Line AWD",
        bodyType: "SEDAN",
        fuelType: "ELECTRIC",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 6095000,
        mileage: 708,
        engineCC: 0,
        powerBhp: 325,
        torqueNm: 605,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1560958089-b8a63019cbcf?w=600&h=340&fit=crop"
      },

      // ── 36 ──
      {
        maker: "Toyota",
        model: "Camry",
        varient: "Hybrid",
        bodyType: "SEDAN",
        fuelType: "HYBRID",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 4900000,
        mileage: 19.16,
        engineCC: 2487,
        powerBhp: 218,
        torqueNm: 221,
        seatCapacity: 5,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c3ca3806d?w=600&h=340&fit=crop"
      },

      // ── 37 ──
      {
        maker: "Maruti Suzuki",
        model: "Dzire",
        varient: "ZXI+",
        bodyType: "SEDAN",
        fuelType: "CNG",
        year: 2024,
        transmission: "MANUAL",
        exShowRoomPrice: 1020000,
        mileage: 31.12,
        engineCC: 1197,
        powerBhp: 77,
        torqueNm: 98.5,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1507950547769-1147f900cebb?w=600&h=340&fit=crop"
      },

      // ── 38 ──
      {
        maker: "Tata",
        model: "Safari",
        varient: "Gold",
        bodyType: "SUV",
        fuelType: "DIESEL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2730000,
        mileage: 16.16,
        engineCC: 1956,
        powerBhp: 170,
        torqueNm: 350,
        seatCapacity: 7,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=340&fit=crop"
      },

      // ── 39 ──
      {
        maker: "MG",
        model: "Hector Plus",
        varient: "Sharp Pro",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2290000,
        mileage: 14.81,
        engineCC: 1451,
        powerBhp: 143,
        torqueNm: 250,
        seatCapacity: 7,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=340&fit=crop"
      },

      // ── 40 ──
      {
        maker: "Citroen",
        model: "C3 Aircross",
        varient: "Max Turbo",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1370000,
        mileage: 18.5,
        engineCC: 1199,
        powerBhp: 110,
        torqueNm: 190,
        seatCapacity: 7,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop"
      },

      // ── 41 ──
      {
        maker: "Jeep",
        model: "Compass",
        varient: "Model S (O)",
        bodyType: "SUV",
        fuelType: "DIESEL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 3070000,
        mileage: 17.1,
        engineCC: 1956,
        powerBhp: 170,
        torqueNm: 350,
        seatCapacity: 5,
        safetyRating: 4,
        imageUrl: "https://images.unsplash.com/photo-1606611013016-969c19d4a42f?w=600&h=340&fit=crop"
      },

      // ── 42 ──
      {
        maker: "Honda",
        model: "WR-V",
        varient: "ZX",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2023,
        transmission: "MANUAL",
        exShowRoomPrice: 1520000,
        mileage: 16.5,
        engineCC: 1498,
        powerBhp: 121,
        torqueNm: 145,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&h=340&fit=crop"
      },

      // ── 43 ──
      {
        maker: "Renault",
        model: "Triber",
        varient: "RXZ",
        bodyType: "MUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "MANUAL",
        exShowRoomPrice: 900000,
        mileage: 19,
        engineCC: 999,
        powerBhp: 72,
        torqueNm: 96,
        seatCapacity: 7,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c3ca3806d?w=600&h=340&fit=crop"
      },

      // ── 44 ──
      {
        maker: "Mahindra",
        model: "BE 6",
        varient: "Pack Three",
        bodyType: "SUV",
        fuelType: "ELECTRIC",
        year: 2025,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2690000,
        mileage: 682,
        engineCC: 0,
        powerBhp: 286,
        torqueNm: 380,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1560958089-b8a63019cbcf?w=600&h=340&fit=crop"
      },

      // ── 45 ──
      {
        maker: "Hyundai",
        model: "Creta Electric",
        varient: "Excellence Long Range",
        bodyType: "SUV",
        fuelType: "ELECTRIC",
        year: 2025,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2310000,
        mileage: 473,
        engineCC: 0,
        powerBhp: 171,
        torqueNm: 255,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&h=340&fit=crop"
      },

      // ── 46 ──
      {
        maker: "Toyota",
        model: "Glanza",
        varient: "V AMT",
        bodyType: "HATCHBACK",
        fuelType: "CNG",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 920000,
        mileage: 30.68,
        engineCC: 1197,
        powerBhp: 77,
        torqueNm: 98.5,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=600&h=340&fit=crop"
      },

      // ── 47 ──
      {
        maker: "Tata",
        model: "Curvv EV",
        varient: "Accomplished+ S",
        bodyType: "SUV",
        fuelType: "ELECTRIC",
        year: 2025,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2190000,
        mileage: 502,
        engineCC: 0,
        powerBhp: 167,
        torqueNm: 215,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=600&h=340&fit=crop"
      },

      // ── 48 ──
      {
        maker: "Maruti Suzuki",
        model: "Invicto",
        varient: "Alpha+",
        bodyType: "MUV",
        fuelType: "HYBRID",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 2800000,
        mileage: 23.24,
        engineCC: 1987,
        powerBhp: 186,
        torqueNm: 206,
        seatCapacity: 7,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1605559424843-9e4c3ca3806d?w=600&h=340&fit=crop"
      },

      // ── 49 ──
      {
        maker: "Kia",
        model: "Sonet",
        varient: "GTX+ DCT",
        bodyType: "SUV",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 1680000,
        mileage: 18.3,
        engineCC: 998,
        powerBhp: 120,
        torqueNm: 172,
        seatCapacity: 5,
        safetyRating: 3,
        imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=340&fit=crop"
      },

      // ── 50 ──
      {
        maker: "BMW",
        model: "3 Series",
        varient: "330i M Sport",
        bodyType: "SEDAN",
        fuelType: "PETROL",
        year: 2024,
        transmission: "AUTOMATIC",
        exShowRoomPrice: 6500000,
        mileage: 14.7,
        engineCC: 1998,
        powerBhp: 258,
        torqueNm: 400,
        seatCapacity: 5,
        safetyRating: 5,
        imageUrl: "https://images.unsplash.com/photo-1507950547769-1147f900cebb?w=600&h=340&fit=crop"
      }

    ]
  });

  console.log("Cars Seeded");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });