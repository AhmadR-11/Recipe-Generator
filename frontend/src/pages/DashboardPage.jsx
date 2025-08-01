import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChefHat, User, History, Sparkles, Clock, LogOut, Utensils, Star, TrendingUp, Zap } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import recipeService from "../services/recipeService";
import { motion, AnimatePresence } from "framer-motion";
import { RecipeGeneratingAnimation } from "../components/ui/loading-animation";

export default function DashboardPage() {
  const [ingredients, setIngredients] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [recipe, setRecipe] = useState(null); // recipe object
  const [error, setError] = useState("");
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [hasSaved, setHasSaved] = useState(false);
  const { user, signOut, jwt } = useAuth();
  const navigate = useNavigate();

  // Fetch real recent recipes on mount and after save
  useEffect(() => {
    if (jwt) fetchRecentRecipes();
    // eslint-disable-next-line
  }, [jwt]);

  const fetchRecentRecipes = async () => {
    try {
      const recipes = await recipeService.fetchRecipesFromBackend(jwt);
      console.log("Fetched recipes:", recipes);
      setRecentRecipes(recipes.slice(0, 4)); // Show only first 4 recipes
    } catch (e) {
      console.error("Error fetching recipes:", e);
      setRecentRecipes([]);
    }
  };

  // Save recipe to backend
  const saveRecipeToHistory = async (recipeObj) => {
    console.log("=== saveRecipeToHistory START ===");
    console.log("recipeObj:", recipeObj);
    console.log("hasSaved:", hasSaved);
    console.log("recipeObj truthy:", !!recipeObj);
    console.log("=== saveRecipeToHistory called ===");
    console.log("recipeObj received:", recipeObj);
    console.log("hasSaved:", hasSaved);
    if (!recipeObj || hasSaved) return;
    console.log("Proceeding with save...");
    try {
      // Convert instructions array to string if needed
      console.log("Original instructions:", recipeObj.instructions);
      console.log("First instruction object:", recipeObj.instructions[0]);
      const instructions = Array.isArray(recipeObj.instructions)
        ? recipeObj.instructions
            .map((step) => {
              console.log("Processing step:", step);
              if (typeof step === "string") return step;
              if (typeof step === "object") {
                const text =
                  step.description ||
                  step.text ||
                  step.instruction ||
                  step.content ||
                  step.step ||
                  "";
                console.log("Extracted text:", text);
                return text;
              }
              return "";
            })
            .filter(Boolean)
            .join("\n")
        : recipeObj.instructions;
      console.log("Instructions converted:", instructions);

      // Add ingredients if missing (use the original input ingredients)
      console.log("recipeObj.cookingTime:", recipeObj.cookingTime);
      console.log("recipeObj.cookTime:", recipeObj.cookTime);
      const extractedCookTime =
        extractCookTime(recipeObj.cookingTime) ||
        extractCookTime(recipeObj.cookTime);
      console.log("Extracted cookTime:", extractedCookTime);
      const recipeToSave = {
        ...recipeObj,
        instructions,
        ingredients:
          recipeObj.ingredients ||
          ingredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        cookTime: extractedCookTime || 30,
      };

      console.log("Saving recipe to backend:", recipeToSave);
      console.log("About to call recipeService.saveRecipeToBackend...");
      const savedRecipe = await recipeService.saveRecipeToBackend(
        recipeToSave,
        jwt
      );
      if (savedRecipe && (savedRecipe._id || savedRecipe.id)) {
        navigate(`/recipe/${savedRecipe._id || savedRecipe.id}`);
      }
      console.log("recipeService.saveRecipeToBackend completed successfully");
      setHasSaved(true);
      fetchRecentRecipes();
    } catch (e) {
      console.error("Error in saveRecipeToHistory:", e);
      console.error("Error saving recipe:", e);
    }
  };

  // Generate recipe handler
  const handleGenerateRecipe = async (e) => {
    e.preventDefault();
    if (!ingredients.trim()) return;
    setIsGenerating(true);
    setRecipe(null);
    setError("");
    setHasSaved(false);
    try {
      const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
      // Ensure no trailing slash to avoid double slashes
      const cleanBackendUrl = backendUrl.replace(/\/$/, "");
      const response = await fetch(`${cleanBackendUrl}/ai-recipe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: ingredients
            .split(",")
            .map((i) => i.trim())
            .filter(Boolean),
        }),
      });
      if (!response.ok) throw new Error("Failed to generate recipe");
      const data = await response.json();
      let recipeObj = null;

      // Check if we have a direct recipe object (new format)
      if (data.recipe && typeof data.recipe === "object" && data.recipe.title) {
        recipeObj = data.recipe;
      }
      // Fallback to old format (string parsing)
      else if (data.recipe && typeof data.recipe.result === "string") {
        const match = data.recipe.result.match(/```json\n([\s\S]*?)```/);
        if (match && match[1]) {
          try {
            recipeObj = JSON.parse(match[1]);
          } catch {
            try {
              recipeObj = JSON.parse(data.recipe.result);
            } catch {
              recipeObj = null;
            }
          }
        }
      }

      setRecipe(recipeObj);
      console.log("AI Generated Recipe Object:", recipeObj);
      console.log("Full recipeObj keys:", Object.keys(recipeObj));
      console.log(
        "Testing extractCookTime with '40 minutes':",
        extractCookTime("40 minutes")
      );
      console.log(
        "Testing extractCookTime with '25 min':",
        extractCookTime("25 min")
      );
      if (recipeObj) {
        await saveRecipeToHistory(recipeObj);
        // Navigation will happen inside saveRecipeToHistory
      }
    } catch {
      setError("Error generating recipe. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Another Recipe handler
  const handleGenerateAnother = async () => {
    if (recipe && !hasSaved) {
      await saveRecipeToHistory(recipe);
    }
    setRecipe(null);
    setIngredients("");
    setError("");
    setHasSaved(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    if (diffDays <= 30) return `${Math.ceil((diffDays - 1) / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const extractCookTime = (timeString) => {
    if (!timeString) return null;
    // Extract number from strings like "40 minutes", "25 min", "1 hour", etc.
    const match = timeString.toString().match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-emerald-50/30 to-green-50/50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-200/20 to-green-300/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            rotate: [360, 0],
            scale: [1.1, 1, 1.1]
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-blue-200/20 to-emerald-300/20 rounded-full blur-3xl"
        />
      </div>
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-sm border-b"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              className="flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <ChefHat className="h-8 w-8 text-emerald-600" />
              </motion.div>
              <span className="text-xl font-bold text-gray-900">
                AI Recipe Generator
              </span>
            </motion.div>
            <div className="flex items-center space-x-4">
              <Link to="/history">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="ghost" className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <History className="h-4 w-4" />
                    </motion.div>
                    <span>History</span>
                  </Button>
                </motion.div>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                      >
                        <User className="h-4 w-4" />
                      </motion.div>
                      <span className="hidden sm:inline">{user?.email}</span>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          className="grid lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Main Content */}
          <div className="lg:col-span-2">
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Generate Your Recipe
              </h1>
              <p className="text-gray-600">
                Tell us what ingredients you have, and we'll create a delicious
                recipe for you!
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <motion.div
                      animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                    >
                      <Sparkles className="h-5 w-5 text-emerald-600" />
                    </motion.div>
                    <span>Recipe Generator</span>
                  </CardTitle>
                  <CardDescription>
                    Enter your available ingredients and preferences to get a
                    personalized recipe.
                  </CardDescription>
                </CardHeader>
              <CardContent>
                <form onSubmit={handleGenerateRecipe} className="space-y-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="ingredients"
                      className="text-sm font-medium text-gray-700"
                    >
                      What ingredients do you have? *
                    </label>
                    <motion.div
                      whileFocus={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Textarea
                        id="ingredients"
                        placeholder="e.g., chicken breast, broccoli, garlic, soy sauce, rice..."
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        className="min-h-[120px] resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-300"
                        required
                      />
                    </motion.div>
                    <p className="text-xs text-gray-500">
                      List all the ingredients you have available. Be as
                      specific as possible for better results.
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-lg py-6 shadow-lg hover:shadow-xl transition-all duration-300"
                      disabled={isGenerating || !ingredients.trim()}
                    >
                      {isGenerating ? (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          <span>Generating recipe...</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <motion.div
                            animate={{
                              rotate: [0, 10, -10, 0],
                              scale: [1, 1.1, 1]
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              repeatDelay: 3
                            }}
                          >
                            <Sparkles className="h-5 w-5" />
                          </motion.div>
                          <span>Generate Recipe</span>
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
                {/* Output Section */}
                <div className="mt-8">
                  <AnimatePresence mode="wait">
                    {isGenerating && (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                      >
                        <RecipeGeneratingAnimation />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && !isGenerating && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-600 font-medium bg-red-50 border border-red-200 rounded-lg p-4"
                    >
                      ❌ {error}
                    </motion.div>
                  )}
                  <AnimatePresence>
                    {recipe && !isGenerating && !error && (
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-lg p-6 mt-4 shadow-lg"
                      >
                        <motion.h2
                          className="text-2xl font-bold mb-3 text-emerald-800 flex items-center space-x-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <motion.div
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 2, delay: 0.5 }}
                          >
                            <Utensils className="h-6 w-6 text-emerald-600" />
                          </motion.div>
                          <span>{recipe.title || "Your AI-Generated Recipe"}</span>
                        </motion.h2>
                        {recipe.cookingTime && (
                          <div>
                            <strong>Cooking Time:</strong> {recipe.cookingTime}
                          </div>
                        )}
                        {recipe.servings && (
                          <div>
                            <strong>Servings:</strong> {recipe.servings}
                          </div>
                        )}
                        {recipe.instructions &&
                          Array.isArray(recipe.instructions) && (
                            <div className="mt-4">
                              <strong>Instructions:</strong>
                              <ol className="list-decimal list-inside ml-4">
                                {recipe.instructions.map((step, idx) => (
                                  <li key={idx}>{step.description || step}</li>
                                ))}
                              </ol>
                            </div>
                          )}
                        {recipe.instructions &&
                          !Array.isArray(recipe.instructions) && (
                            <div className="mt-4 whitespace-pre-line">
                              {recipe.instructions}
                            </div>
                          )}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                        >
                          <Button
                            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white"
                            onClick={handleGenerateAnother}
                          >
                            <Zap className="h-4 w-4 mr-2" />
                            Generate Another Recipe
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotateY: [0, 360] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <History className="h-5 w-5 text-emerald-600" />
                    </motion.div>
                    <span>Recent Recipes</span>
                  </CardTitle>
                </CardHeader>
              <CardContent className="space-y-3">
                {recentRecipes.length === 0 ? (
                  <div className="text-gray-500">No recent recipes found.</div>
                ) : (
                  recentRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe._id || recipe.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                      }}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-emerald-50 rounded-lg hover:from-emerald-50 hover:to-emerald-100 transition-all duration-300 cursor-pointer border border-gray-200 hover:border-emerald-300"
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 2, delay: index * 0.5 }}
                        >
                          <Utensils className="h-5 w-5 text-emerald-600" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {recipe.title}
                          </h4>
                          <div className="flex items-center space-x-3 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{recipe.cookTime || recipe.time || "30"} min</span>
                            </div>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: i * 0.05 + 0.3 }}
                                >
                                  <Star
                                    className={`h-3 w-3 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                  />
                                </motion.div>
                              ))}
                            </div>
                            <span>•</span>
                            <span>
                              {recipe.createdAt
                                ? formatDate(recipe.createdAt)
                                : "-"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Link to="/history">
                    <Button variant="outline" className="w-full mt-4 hover:bg-emerald-50 hover:border-emerald-300 transition-colors">
                      <History className="h-4 w-4 mr-2" />
                      View All Recipes
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Be specific about quantities when possible (e.g., "2 chicken
                    breasts" instead of just "chicken")
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Include seasonings and pantry staples you have available
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p>
                    Mention cooking equipment if you have preferences (oven,
                    stovetop, etc.)
                  </p>
                </div>
              </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Action Button */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-8 right-8 z-50"
      >
        <motion.button
          whileHover={{
            scale: 1.1,
            boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)"
          }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            document.getElementById('ingredients')?.focus();
            document.getElementById('ingredients')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-8 w-8" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
}
