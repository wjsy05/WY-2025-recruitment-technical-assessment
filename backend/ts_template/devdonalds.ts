import express, { Request, Response } from "express";

// ==== Type Definitions, feel free to add or modify ==========================
interface cookbookEntry {
  name: string;
  type: string;
}

interface requiredItem {
  name: string;
  quantity: number;
}

interface recipe extends cookbookEntry {
  requiredItems: requiredItem[];
}

interface ingredient extends cookbookEntry {
  cookTime: number;
}

// =============================================================================
// ==== HTTP Endpoint Stubs ====================================================
// =============================================================================
const app = express();
app.use(express.json());

// Store your recipes here!
const cookbook: any = {};

// Task 1 helper (don't touch)
app.post("/parse", (req:Request, res:Response) => {
  const { input } = req.body;

  const parsed_string = parse_handwriting(input)
  if (parsed_string == null) {
    res.status(400).send("this string is cooked");
    return;
  } 
  res.json({ msg: parsed_string });
  return;
  
});

// [TASK 1] ====================================================================
// Takes in a recipeName and returns it in a form that 
const parse_handwriting = (recipeName: string): string | null => {
  recipeName = recipeName.replace(/[-_]+/g, " ");

  recipeName = recipeName.replace(/[^a-zA-Z\s]/g, "");

  recipeName = recipeName.trim().replace(/\s+/g, " ");

  // Words into an array, and change the first letter of word to capital everything else lowercase without changing the array using map
  recipeName = recipeName
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  if (recipeName.length <= 0) {
    return null;
  }

  return recipeName
}

// [TASK 2] ====================================================================
// Endpoint that adds a CookbookEntry to your magical cookbook
app.post("/entry", (req:Request, res:Response) => {
  const entry = JSON.parse(JSON.stringify(req.body)) as cookbookEntry;
  
  if (entry.type !== "recipe" && entry.type !== "ingredient") {
    return res.status(400).send("Invalid type, must be 'recipe' or 'ingredient'.");
  }

  if (cookbook[entry.name]) {
    return res.status(400).send("Entry name already exists");
  }

  if (entry.type === "ingredient") {
    const ingredientEntry = entry as ingredient;
    if (ingredientEntry.cookTime < 0) {
      return res.status(400).send("Cooktime must be >= 0");
    }
  }

  if (entry.type === "recipe") {
    const recipeEntry = entry as recipe;
    const uniqueItems: string[] = [];

    for (const item of recipeEntry.requiredItems) {
      if (uniqueItems.includes(item.name)) {
        return res.status(400).send("Recipe requiredItems must have unique names.");
      }
      uniqueItems.push(item.name);
    }
  }

  cookbook[entry.name] = entry;

  return res.status(200).send();
});

// [TASK 3] ====================================================================
// Endpoint that returns a summary of a recipe that corresponds to a query name
app.get("/summary", (req:Request, res:Request) => {
  // TODO: implement me
  res.status(500).send("not yet implemented!")

});

// =============================================================================
// ==== DO NOT TOUCH ===========================================================
// =============================================================================
const port = 8080;
app.listen(port, () => {
  console.log(`Running on: http://127.0.0.1:8080`);
});
