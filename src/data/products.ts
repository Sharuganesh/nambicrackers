export type Product = {
  id: number;
  name: string;
  tamil: string;
  rate: number;
  unit: string;
  price: number;
  slug: string;
};

export type Category = {
  name: string;
  products: Product[];
};

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

let counter = 0;
const p = (name: string, tamil: string, rate: number, unit: string): Product => {
  counter += 1;
  return {
    id: counter,
    name,
    tamil,
    rate,
    unit,
    price: Math.round(rate * 0.1),
    slug: slugify(name),
  };
};

export const CATEGORIES: Category[] = [
  {
    name: "One Sound Crackers",
    products: [
      p('2¾" Kuruvi', '2¾" குருவி', 70, "1 Pkt"),
      p('3½" Lakshmi', '3½" லட்சுமி', 110, "1 Pkt"),
      p('4" Gold Lakshmi', '4" கோல்டு லட்சுமி', 280, "1 Pkt"),
      p('4" Lakshmi', '4" லட்சுமி', 160, "1 Pkt"),
      p('4" Lakshmi Deluxe', '4" லட்சுமி டிலக்ஸ்', 260, "1 Pkt"),
      p('5" Tiger', '5" டைகர்', 480, "1 Pkt"),
      p('5" Jallikattu / Hulk', '5" ஜல்லிக்கட்டு / ஹல்க்', 520, "1 Pkt"),
      p('6" Lakshmi', '6" லட்சுமி', 680, "1 Pkt"),
    ],
  },
  {
    name: "Giant & Deluxe Crackers",
    products: [
      p("28 Chorsa", "28 சோர்சா", 120, "1 Pkt"),
      p("28 Giant", "28 ஜெயண்ட்", 200, "1 Pkt"),
      p("56 Giant", "56 ஜெயண்ட்", 390, "1 Pkt"),
      p("24 Deluxe", "24 டிலக்ஸ்", 350, "1 Pkt"),
      p("50 Deluxe", "50 டிலக்ஸ்", 800, "1 Pkt"),
      p("100 Deluxe", "100 டிலக்ஸ்", 1400, "1 Pkt"),
    ],
  },
  {
    name: "Day Festival Crackers",
    products: [
      p("100 Wala", "100 வாலா", 320, "1 Box"),
      p("1000 Wala", "1000 வாலா", 1500, "1 Box"),
      p("2000 Wala", "2000 வாலா", 3000, "1 Box"),
      p("5000 Wala", "5000 வாலா", 7500, "1 Box"),
      p("10000 Wala", "10000 வாலா", 15000, "1 Box"),
      p("1000 Wala Premium (Full)", "1000 வாலா பிரீமியம்", 2200, "1 Box"),
      p("2000 Wala Premium (Full)", "2000 வாலா பிரீமியம்", 4400, "1 Box"),
      p("5000 Wala Premium (Full)", "5000 வாலா பிரீமியம்", 11000, "1 Box"),
      p("10000 Wala Premium (Full)", "10000 வாலா பிரீமியம்", 22000, "1 Box"),
    ],
  },
  {
    name: "Bijili Crackers",
    products: [
      p("Red Bijili Crackers (50 Pcs)", "ரெட் பிஜிலி (50 பீஸ்)", 150, "1 Pkt"),
      p("Red Bijili Crackers (100 Pcs)", "ரெட் பிஜிலி (100 பீஸ்)", 300, "1 Pkt"),
    ],
  },
  {
    name: "Night Festival Multicolour Shots",
    products: [
      p("12 Shots", "12 ஷாட்ஸ்", 1100, "1 Box"),
      p("12 Shots Ak", "12 ஷாட்ஸ் ஏகே", 1600, "1 Box"),
      p("25 Shots Rider", "25 ஷாட்ஸ் ரைடர்", 2250, "1 Box"),
      p("25 Shots Colour Rider", "25 ஷாட்ஸ் கலர் ரைடர்", 3000, "1 Box"),
      p("30 Shots", "30 ஷாட்ஸ்", 3500, "1 Box"),
      p("60 Shots", "60 ஷாட்ஸ்", 7000, "1 Box"),
    ],
  },
  {
    name: "Premium Multicolour Shots",
    products: [
      p("30 Grand Shot", "30 கிராண்ட் ஷாட்ஸ்", 4500, "1 Box"),
      p("60 Grand Shot", "60 கிராண்ட் ஷாட்ஸ்", 8500, "1 Box"),
      p("120 Grand Shot", "120 கிராண்ட் ஷாட்ஸ்", 17000, "1 Box"),
      p("240 Grand Shot", "240 கிராண்ட் ஷாட்ஸ்", 32000, "1 Box"),
    ],
  },
  {
    name: "Rockets",
    products: [
      p("Rocket Bomb", "ராக்கெட் பாம்", 600, "1 Box"),
      p("Lunik Rocket", "லுனிக் ராக்கெட்", 1000, "1 Box"),
      p("2 Sound Rocket", "2 சவுண்ட் ராக்கெட்", 1200, "1 Box"),
      p("Whizling Rocket", "விஸ்லிங் ராக்கெட்", 1500, "1 Box"),
      p("Solar Flare (Rocket + Sky Shots)", "சோலார் ஃபிளேர்", 3200, "1 Box"),
    ],
  },
  {
    name: "Blast Bombs",
    products: [
      p("Bullet Bomb", "புல்லட் பாம்", 300, "1 Box"),
      p("King Bomb", "கிங் பாம்", 800, "1 Box"),
      p("Classic Bomb", "கிளாசிக் பாம்", 1000, "1 Box"),
      p("Agni Bomb", "அக்கினி பாம்", 1500, "1 Box"),
      p("Digital Bomb", "டிஜிட்டல் பாம்", 2000, "1 Box"),
      p("555 Bomb", "555 பாம்", 1200, "1 Box"),
      p("Cylinder Bomb (2 Pcs)", "சிலிண்டர் பாம் (2 பீஸ்)", 2800, "1 Box"),
    ],
  },
  {
    name: "Paper Bombs",
    products: [
      p("¼ Paper Bomb", "¼ பேப்பர் பாம்", 400, "1 Box"),
      p("½ Paper Bomb", "½ பேப்பர் பாம்", 800, "1 Box"),
      p("1 Kg Paper Bomb", "1 கிலோ பேப்பர் பாம்", 1600, "1 Box"),
      p("Destro Bomb (3 Pcs)", "டெஸ்ட்ரோ பாம் (3 பீஸ்)", 800, "1 Box"),
      p("Avatar 10 in 1", "அவதார் 10 in 1", 3000, "1 Box"),
      p("Royal Casino (2 Pcs)", "ராயல் கேசினோ (2 பீஸ்)", 1800, "1 Box"),
    ],
  },
  {
    name: "Peacock's",
    products: [
      p("Little Peacock", "லிட்டில் பீகாக்", 1000, "1 Box"),
      p("Magic Peacock", "மேஜிக் பீகாக்", 1500, "1 Box"),
      p("Bada Peacock", "படா பீகாக்", 3500, "1 Box"),
    ],
  },
  {
    name: "Siren",
    products: [
      p("Mini Siren (5 Pcs)", "மினி சைரன் (5 பீஸ்)", 1300, "1 Box"),
      p("Mega Siren (3 Pcs)", "மெகா சைரன் (3 பீஸ்)", 1600, "1 Box"),
    ],
  },
  {
    name: "Novelties",
    products: [
      p("Kitkat", "கிட் கேட்", 280, "1 Box"),
      p("Bim Bom", "பிம் பாம்", 450, "1 Box"),
      p("Butterfly", "பட்டர்ஃபிளை", 800, "1 Box"),
      p("Helicopter (Red & Green)", "ஹெலிகாப்டர்", 800, "1 Box"),
      p("Photo Flash", "போட்டோ ஃபிளாஷ்", 600, "1 Box"),
      p("Selfie Stick", "செல்பி ஸ்டிக்", 600, "1 Box"),
      p("Bambaram (Red & Green)", "பம்பரம்", 1000, "1 Box"),
    ],
  },
  {
    name: "Fancy Novelties",
    products: [
      p("Gold Coin (Yellow Crackling)", "கோல்டு காயின்", 1500, "1 Box"),
      p("White House (White Crackling)", "வைட் ஹவுஸ்", 1500, "1 Box"),
      p("Army Force", "ஆர்மி போர்ஸ்", 1200, "1 Box"),
      p("Dreams (Red & Green)", "ட்ரீம்ஸ்", 1200, "1 Box"),
      p("7 Shots", "7 ஷாட்ஸ்", 900, "1 Box"),
      p("Penta Magic (5 Colours)", "பென்டா மேஜிக்", 1300, "1 Box"),
    ],
  },
  {
    name: "Flower Pots",
    products: [
      p("Flower Pots Big", "பூச்சட்டி பிக்", 550, "1 Box"),
      p("Flower Pots Special", "பூச்சட்டி ஸ்பெஷல்", 720, "1 Box"),
      p("Flower Pots Asoka", "பூச்சட்டி அசோகா", 900, "1 Box"),
      p("Flower Pots Super", "பூச்சட்டி சூப்பர்", 1200, "1 Box"),
      p("Flower Pots Deluxe", "பூச்சட்டி டிலக்ஸ்", 1500, "1 Box"),
      p("Colour Koti", "கலர் கோட்டி", 1700, "1 Box"),
      p("Colour Koti Special", "கலர் கோட்டி ஸ்பெஷல்", 2250, "1 Box"),
      p("Colour Koti Deluxe", "கலர் கோட்டி டிலக்ஸ்", 2800, "1 Box"),
    ],
  },
  {
    name: "Ground Chakkars",
    products: [
      p("Ground Chakkar Big", "தரைச்சக்கரம் பிக்", 350, "1 Box"),
      p("Ground Chakkar Special", "தரைச்சக்கரம் ஸ்பெஷல்", 700, "1 Box"),
      p("Ground Chakkar Deluxe", "தரைச்சக்கரம் டிலக்ஸ்", 1200, "1 Box"),
      p("Spinner Special", "ஸ்பின்னர் ஸ்பெஷல்", 1200, "1 Box"),
      p("Spinner Deluxe", "ஸ்பின்னர் டிலக்ஸ்", 1800, "1 Box"),
    ],
  },
  {
    name: "Fancy Wheels",
    products: [
      p("Disco Wheel", "டிஸ்கோ வீல்", 650, "1 Box"),
      p("Rio Wheel", "ரியோ வீல்", 2200, "1 Box"),
      p("Tinto Wheel", "டிண்டோ வீல்", 2200, "1 Box"),
      p("Whizz Wheel", "விஸ்ஸ் வீல்", 1300, "1 Box"),
      p("Lotus Wheel", "லோட்டஸ் வீல்", 1300, "1 Box"),
    ],
  },
  {
    name: "Twinkling Stars",
    products: [
      p("1½' Twinkling Stars", "1½' ட்விங்கிளிங் ஸ்டார்", 200, "1 Box"),
      p("4' Twinkling Stars", "4' ட்விங்கிளிங் ஸ்டார்", 500, "1 Box"),
    ],
  },
  {
    name: "Galaxy Star",
    products: [
      p("Galaxy Star (Multicolour)", "கேலக்ஸி ஸ்டார்", 1500, "1 Box"),
      p("Magizh's Sky Dive", "ஸ்கை டைவ்", 1450, "1 Box"),
      p("Magizh's Mines", "மைன்ஸ்", 1450, "1 Box"),
    ],
  },
  {
    name: "Candle Varieties",
    products: [
      p("Amazing Pencil (3 Pcs)", "அமேசிங் பென்சில்", 700, "1 Box"),
      p("Star Rain (Crackling)", "ஸ்டார் ரெயின்", 1800, "1 Box"),
      p("Trix Candle", "ட்ரிக்ஸ் கேண்டில்", 1500, "1 Box"),
      p("Pistol 5G Gun (2 Pcs)", "பிஸ்டல் கன்", 1800, "1 Box"),
      p("Nayagara Handle", "நயாகரா ஹேண்டில்", 1450, "1 Box"),
      p("I Cone (2 Pcs)", "ஐ கோன்", 1700, "1 Box"),
      p("Lorex Pencil (3 Pcs)", "லோரக்ஸ் பென்சில்", 1000, "1 Box"),
      p("Colour Smoke (Multicolour)", "கலர் ஸ்மோக்", 1500, "1 Box"),
      p("Gun Squad (2 Guns)", "கன் ஸ்குவார்டு", 1750, "1 Box"),
    ],
  },
  {
    name: "Colour Fountains",
    products: [
      p("Disco Shower", "டிஸ்கோ ஷவர்", 900, "1 Box"),
      p("Colour Rain", "கலர் ரெயின்", 900, "1 Box"),
      p("Peacock Feathers", "பீகாக் பெதர்ஸ்", 900, "1 Box"),
      p("Golden Globe", "கோல்டன் குளோப்", 900, "1 Box"),
      p("Twix (5 Colour)", "ட்விக்ஸ்", 1500, "1 Box"),
      p("Red Sun", "ரெட் சன்", 1500, "1 Box"),
      p("Sunfeast", "சன்ஃபீஸ்ட்", 1350, "1 Box"),
      p("Fox Star", "பாக்ஸ் ஸ்டார்", 1150, "1 Box"),
      p("Sing Pop", "சிங் பாப்", 1450, "1 Box"),
      p("H2O Red Falls", "ஹெச்2ஓ ரெட் பால்ஸ்", 1700, "1 Box"),
      p("Pogo (5 Colour)", "போகோ", 1500, "1 Box"),
      p("Angry Bird (5 Colour)", "ஆங்கிரி பேர்ட்", 2500, "1 Box"),
      p("Tri Colour Fountain", "ட்ரை கலர் பவுண்டன்", 2000, "1 Box"),
      p("Cock Fighter (2 Pcs)", "காக் ஃபைட்டர்", 1900, "1 Box"),
      p("Water Queen", "வாட்டர் குயின்", 1500, "1 Box"),
      p("Valcano Fountain", "வல்கேனோ பவுண்டன்", 1450, "1 Box"),
      p("Teensy Green Fountain (5 Pcs)", "டீன்சி கிரீன்", 2200, "1 Box"),
      p("Teensy Red Fountain (5 Pcs)", "டீன்சி ரெட்", 2200, "1 Box"),
    ],
  },
  {
    name: "Multiple Fountain Crackers",
    products: [
      p("Emmu Egg (2 Pcs)", "ஈமு எக்", 1600, "1 Box"),
      p("Money in the Bank (3 Pcs)", "மணி இன் தி பேங்க்", 1300, "1 Box"),
      p("Old is Gold (25 Pcs)", "ஓல்ட் இஸ் கோல்டு", 1450, "1 Box"),
      p("Wire Chakkar", "வயர் சக்கரம்", 1550, "1 Box"),
      p("Fantasy Lion", "பேன்டசி லயன்", 2250, "1 Box"),
      p("Fantasy Elephant", "பேன்டசி எலிபெண்ட்", 2250, "1 Box"),
      p("Lollipop (5 Sticks)", "லாலிபாப்", 1700, "1 Box"),
      p("Crooda (Colour + Crackling)", "க்ரூடா கலர்", 1600, "1 Box"),
      p("Wonders 3 in 1 Function", "வொண்டர்ஸ்", 2250, "1 Box"),
      p("Love Dose (6 Colour Shots)", "லவ் டோஸ்", 1350, "1 Box"),
      p("Lemon Tree", "லெமன் ட்ரீ", 1600, "1 Box"),
      p("Autumn Rain", "ஆட்டமன் ரெயின்", 1550, "1 Box"),
      p("Scooby-Doo (5 Pcs)", "ஸ்கூபி டூ", 1500, "1 Box"),
      p("Dexter (5 Pcs)", "டெக்ஸ்டர்", 1500, "1 Box"),
      p("Popeye (5 Pcs)", "பாப்பாய்", 1500, "1 Box"),
      p("Moye-Moye (Fountain + Fancy)", "மாயேமாயே", 2100, "1 Box"),
      p("Kulfi Crackling Candle (3 Pcs)", "குல்ஃபி", 2800, "1 Box"),
    ],
  },
  {
    name: "Sky Shots Series",
    products: [
      p("Chotta Fancy", "சோட்டா பேன்சி", 300, "1 Box"),
      p('2" Fancy', '2" பேன்சி', 750, "1 Box"),
      p('2" (3 Pcs) Fancy', '2" (3 பீஸ்) பேன்சி', 2000, "1 Box"),
      p('2" Rockstar (3 Pcs)', '2" ராக்ஸ்டார்', 2500, "1 Box"),
      p('3" Pipe Fancy', '3" பைப் பேன்சி', 1300, "1 Box"),
      p('4" Pipe Fancy', '4" பைப் பேன்சி', 2200, "1 Box"),
      p('4" Pipe (AK Fireworks)', '4" பைப் ஏகே', 2500, "1 Box"),
      p("Nayagara Falls", "நயாகரா பால்ஸ்", 3300, "1 Box"),
      p('5" Pipe Fancy', '5" பைப் பேன்சி', 3200, "1 Box"),
      p("7 Wonders", "7 வொண்டர்ஸ்", 3600, "1 Box"),
      p("Liya 12 Steps Fancy", "லியா 12 ஸ்டெப்ஸ்", 3200, "1 Box"),
      p("3 Steps (3 Pcs)", "3 ஸ்டெப்", 3000, "1 Box"),
      p("Wow Pink", "வாவ் பிங்க்", 4200, "1 Box"),
      p("Wow Orange", "வாவ் ஆரஞ்சு", 4200, "1 Box"),
      p("Wow Lemon", "வாவ் லெமன்", 4200, "1 Box"),
      p("Texas Delight", "டெக்சாஸ் டிலைட்", 4200, "1 Box"),
      p('4" Double Ball', "டபுள் பால்", 4000, "1 Box"),
      p('5" Fancy (2 Pcs)', '5" பேன்சி', 7000, "1 Box"),
      p('5" Mega Size (2 Pcs)', '5" மெகா சைஸ்', 9000, "1 Box"),
      p('6" Mega Wolf', '6" மெகா வுல்ஃப்', 6700, "1 Box"),
    ],
  },
  {
    name: "Sparklers",
    products: [
      p("7 Cm Electric Sparklers", "7 செ.மீ எலக்ட்ரிக்", 60, "1 Box"),
      p("7 Cm Colour Sparklers", "7 செ.மீ கலர்", 70, "1 Box"),
      p("7 Cm Green Sparklers", "7 செ.மீ கிரீன்", 80, "1 Box"),
      p("7 Cm Red Sparklers", "7 செ.மீ ரெட்", 100, "1 Box"),
      p("10 Cm Electric Sparklers", "10 செ.மீ எலக்ட்ரிக்", 160, "1 Box"),
      p("10 Cm Colour Sparklers", "10 செ.மீ கலர்", 170, "1 Box"),
      p("10 Cm Green Sparklers", "10 செ.மீ கிரீன்", 180, "1 Box"),
      p("10 Cm Red Sparklers", "10 செ.மீ ரெட்", 200, "1 Box"),
      p("12 Cm Electric Sparklers", "12 செ.மீ எலக்ட்ரிக்", 280, "1 Box"),
      p("12 Cm Colour Sparklers", "12 செ.மீ கலர்", 290, "1 Box"),
      p("12 Cm Green Sparklers", "12 செ.மீ கிரீன்", 300, "1 Box"),
      p("12 Cm Red Sparklers", "12 செ.மீ ரெட்", 320, "1 Box"),
      p("15 Cm Electric Sparklers", "15 செ.மீ எலக்ட்ரிக்", 400, "1 Box"),
      p("15 Cm Colour Sparklers", "15 செ.மீ கலர்", 410, "1 Box"),
      p("15 Cm Green Sparklers", "15 செ.மீ கிரீன்", 430, "1 Box"),
      p("15 Cm Red Sparklers", "15 செ.மீ ரெட்", 450, "1 Box"),
      p("30 Cm Electric Sparklers", "30 செ.மீ எலக்ட்ரிக்", 400, "1 Box"),
      p("30 Cm Colour Sparklers", "30 செ.மீ கலர்", 410, "1 Box"),
      p("30 Cm Green Sparklers", "30 செ.மீ கிரீன்", 430, "1 Box"),
      p("30 Cm Red Sparklers", "30 செ.மீ ரெட்", 450, "1 Box"),
      p("50 Cm Electric Sparklers", "50 செ.மீ எலக்ட்ரிக்", 1500, "1 Box"),
      p("50 Cm Colour Sparklers", "50 செ.மீ கலர்", 1600, "1 Box"),
    ],
  },
  {
    name: "Special Sparklers",
    products: [
      p("Signal Pink", "சிக்னல் பிங்க்", 600, "1 Box"),
      p("Signal Orange", "சிக்னல் ஆரஞ்சு", 600, "1 Box"),
      p("Signal Blue", "சிக்னல் ப்ளூ", 600, "1 Box"),
      p("Lovely Sparklers (Heart Sparklers)", "லவ்லி ஸ்பார்க்லர்ஸ்", 1600, "1 Box"),
      p("Rotating Umbrella", "ரொட்டேட்டிங் அம்ப்ரெல்லா", 1800, "1 Box"),
      p("Poppins 5 in 1 (50 Pcs)", "பாப்பின்ஸ்", 1200, "1 Box"),
      p("Mentos 5 in 1 (50 Pcs)", "மென்டாஸ்", 1400, "1 Box"),
      p("Kit Kat 5 in 1 (50 Pcs)", "கிட்கேட்", 3600, "1 Box"),
      p("Five Star 5 in 1 (25 Pcs)", "ஃபைவ் ஸ்டார்", 3600, "1 Box"),
      p("15 Cm Crackling Comets", "15 செ.மீ கிராக்லிங் காமெட்ஸ்", 1750, "1 Box"),
      p("30 Cm Crackling Comets", "30 செ.மீ கிராக்லிங் காமெட்ஸ்", 1750, "1 Box"),
    ],
  },
  {
    name: "Colour Matches",
    products: [
      p("Classic 5 in 1 (10 Boxes)", "கிளாசிக்", 1200, "1 Box"),
      p("7up Rainbow (10 Boxes)", "7அப் ரெயின்போ", 1600, "1 Box"),
      p("Sony's Men in Blank (Ring Gun)", "ரிங் கன்", 1200, "1 Box"),
      p("Super Deluxe Matches 10 in 1", "சூப்பர் மேட்ச்", 850, "1 Box"),
    ],
  },
];

export const ALL_PRODUCTS: Product[] = CATEGORIES.flatMap((c) => c.products);
