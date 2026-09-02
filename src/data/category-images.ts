import oneSound from "@/assets/cat/one-sound.jpg";
import flowerPots from "@/assets/cat/flower-pots.jpg";
import groundChakkar from "@/assets/cat/ground-chakkar.jpg";
import bomb from "@/assets/cat/bomb.jpg";
import multiShots from "@/assets/cat/multi-shots.jpg";
import pencil from "@/assets/cat/pencil.jpg";
import crackers from "@/assets/cat/crackers.jpg";
import peacock from "@/assets/cat/peacock.jpg";
import rockets from "@/assets/cat/rockets.jpg";
import skyFancy from "@/assets/cat/sky-fancy.jpg";
import sparklers from "@/assets/cat/sparklers.jpg";
import colourMatches from "@/assets/cat/colour-matches.jpg";
import fancyFountain from "@/assets/cat/fancy-fountain.jpg";
import kidsSparklers from "@/assets/cat/kids-sparklers.jpg";
import wowStar from "@/assets/cat/wow-star.jpg";
import skyKing from "@/assets/cat/sky-king.jpg";

export const CATEGORY_IMAGES: Record<string, string> = {
  "One Sound Crackers": oneSound,
  "Flower Pots": flowerPots,
  "Ground Chakkar": groundChakkar,
  Bomb: bomb,
  "Multi Colour Shots": multiShots,
  Pencil: pencil,
  Crackers: crackers,
  Peacock: peacock,
  Rockets: rockets,
  "Sky Fancy": skyFancy,
  Sparklers: sparklers,
  "Colour Matches": colourMatches,
  "Golden Agency Special Fancy & Fountain": fancyFountain,
  "Maharaj Sparklers (Kids Special Colour Sparklers)": kidsSparklers,
  "Wow Star Special Colour Sky Fancy": wowStar,
  "Sky King": skyKing,
};

export const categoryImage = (name: string) => CATEGORY_IMAGES[name] ?? crackers;
